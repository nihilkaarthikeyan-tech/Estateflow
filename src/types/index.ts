export type PropertyStatus = "available" | "sold" | "reserved" | "upcoming";

export type LeadUrgency = "high" | "medium" | "low";

export type BuyerIntent = "serious" | "researching" | "comparing";

export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "site_visit"
  | "negotiation"
  | "closed"
  | "lost";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  city?: string;
  description?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities?: string[];
  images?: string[];
  videos?: string[];
  status: PropertyStatus;
  property_type?: string;
  furnishing?: string;
  tour_url?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  raw_message?: string;
  name: string;
  phone?: string;
  email?: string;
  budget?: string;
  location?: string;
  property_type?: string;
  urgency?: LeadUrgency;
  buyer_intent?: BuyerIntent;
  summary?: string;
  status: LeadStage;
  assigned_to?: string;
  notes?: string;
  source?: string;
  ai_analyzed?: boolean;
  golden_visa?: boolean;
  visit_date?: string;
  closed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  user_id?: string;
  direction: "inbound" | "outbound";
  channel: string;
  message: string;
  created_at: string;
}

export type TenantStatus = "active" | "inactive" | "pending";
export type LeaseStatus = "active" | "expired" | "terminated";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "high" | "medium" | "low";
export type TicketCategory = "plumbing" | "electrical" | "carpentry" | "cleaning" | "security" | "general";
export type VisitorStatus = "pending" | "approved" | "rejected";

export interface Tenant {
  id: string;
  property_id?: string;
  name: string;
  phone?: string;
  email?: string;
  unit_number?: string;
  status: TenantStatus;
  created_at: string;
}

export interface Lease {
  id: string;
  tenant_id: string;
  property_id?: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: LeaseStatus;
  created_at: string;
}

export interface MaintenanceTicket {
  id: string;
  tenant_id?: string;
  property_id?: string;
  title: string;
  description?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface Visitor {
  id: string;
  tenant_id?: string;
  visitor_name: string;
  visitor_phone?: string;
  purpose?: string;
  visit_date?: string;
  status: VisitorStatus;
  created_at: string;
}

export interface Visit {
  id: string;
  property_id?: string;
  lead_id?: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_email?: string;
  visit_date: string;
  visit_time: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: "info" | "lead" | "follow_up" | "ai";
  read: boolean;
  link?: string;
  created_at: string;
}