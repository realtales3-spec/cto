import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./useAuth";

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLeads = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (leadData) => {
    const nextFollowup = new Date();
    nextFollowup.setDate(nextFollowup.getDate() + 3);

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          ...leadData,
          next_followup: nextFollowup.toISOString().split("T")[0],
          assigned_agent: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    await fetchLeads();
    return data;
  };

  const updateLead = async (id, updates) => {
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    await fetchLeads();
    return data;
  };

  const markFollowupDone = async (id) => {
    const nextFollowup = new Date();
    nextFollowup.setDate(nextFollowup.getDate() + 3);
    const today = new Date().toISOString().split("T")[0];

    return updateLead(id, {
      last_contact: today,
      next_followup: nextFollowup.toISOString().split("T")[0],
      status: "follow_up_due",
    });
  };

  return { leads, loading, error, fetchLeads, addLead, updateLead, markFollowupDone };
}