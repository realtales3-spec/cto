-- Email Digest Function (placeholder for future daily digest)
-- This will be expanded to query overdue leads and send notifications

CREATE OR REPLACE FUNCTION get_overdue_leads()
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone TEXT,
  status TEXT,
  next_followup DATE,
  assigned_agent UUID
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT id, name, phone, status, next_followup, assigned_agent
  FROM leads
  WHERE next_followup < CURRENT_DATE
  ORDER BY next_followup ASC;
$$;