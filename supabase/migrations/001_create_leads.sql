-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT NOT NULL,
  budget NUMERIC(10,2),
  property_type TEXT CHECK (property_type IN ('Villa', 'Apartment', 'Land', 'Commercial')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'follow_up_due', 'viewing_scheduled', 'cold', 'won', 'lost')),
  last_contact DATE,
  next_followup DATE DEFAULT (CURRENT_DATE + INTERVAL '3 days'),
  assigned_agent UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Agent can see only their own leads
CREATE POLICY "agents_select_own" ON leads
  FOR SELECT USING (assigned_agent = auth.uid());

-- Admin (based on user metadata role) can see all leads
CREATE POLICY "admin_select_all" ON leads
  FOR SELECT USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Agent can insert leads assigned to themselves
CREATE POLICY "agents_insert_own" ON leads
  FOR INSERT WITH CHECK (assigned_agent = auth.uid());

-- Agent can update their own leads
CREATE POLICY "agents_update_own" ON leads
  FOR UPDATE USING (assigned_agent = auth.uid());

-- Create indexes for common queries
CREATE INDEX idx_leads_assigned_agent ON leads(assigned_agent);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_next_followup ON leads(next_followup);