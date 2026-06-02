import { useState, useMemo, useCallback } from "react";
import { isPast, parseISO, startOfWeek, isAfter } from "date-fns";
import { useLeads } from "../hooks/useLeads";
import { useAuth } from "../hooks/useAuth";
import StatCard from "../components/StatCard";
import FilterBar from "../components/FilterBar";
import LeadTable from "../components/LeadTable";
import LeadModal from "../components/LeadModal";

export default function Dashboard() {
  const { leads, loading, addLead, updateLead, markFollowupDone } = useLeads();
  const { user, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const handleFilterChange = useCallback((f) => {
    setFilters(f);
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const nameMatch = lead.name?.toLowerCase().includes(q);
        const phoneMatch = lead.phone?.toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch) return false;
      }
      return true;
    });
  }, [leads, filters]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });

    return {
      total: leads.length,
      newThisWeek: leads.filter(
        (l) => l.created_at && isAfter(parseISO(l.created_at), weekStart)
      ).length,
      overdue: leads.filter(
        (l) => l.next_followup && isPast(parseISO(l.next_followup))
      ).length,
      won: leads.filter((l) => l.status === "won").length,
    };
  }, [leads]);

  const handleAddLead = async (data) => {
    await addLead(data);
  };

  const handleEditLead = async (data) => {
    if (editLead) {
      await updateLead(editLead.id, data);
    }
  };

  const handleFollowUp = async (id) => {
    try {
      await markFollowupDone(id);
    } catch (err) {
      console.error("Follow-up error:", err);
    }
  };

  const openAddModal = () => {
    setEditLead(null);
    setModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditLead(lead);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditLead(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">LeadFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي العملاء" value={stats.total} icon="👥" color="blue" />
          <StatCard title="جديد هذا الأسبوع" value={stats.newThisWeek} icon="🆕" color="teal" />
          <StatCard title="متابعات متأخرة" value={stats.overdue} icon="⚠️" color="red" />
          <StatCard title="تم البيع" value={stats.won} icon="✅" color="amber" />
        </div>

        {/* Filter + Add button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <FilterBar onFilterChange={handleFilterChange} />
          </div>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm whitespace-nowrap"
          >
            + إضافة عميل
          </button>
        </div>

        {/* Leads table */}
        <LeadTable
          leads={filteredLeads}
          onEdit={openEditModal}
          onFollowUpDone={handleFollowUp}
        />
      </main>

      {/* Add/Edit modal */}
      <LeadModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editLead ? handleEditLead : handleAddLead}
        lead={editLead}
      />
    </div>
  );
}