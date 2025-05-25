import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  student_id: string
  date_of_birth: string
  gender: string
  phone: string
  emergency_contact: string
  password_hash: string
  created_at: string
}

export interface MedicalRecord {
  id: string
  user_id: string
  date: string
  type: string
  description: string
  doctor: string
  notes: string
  created_at: string
}

export interface Appointment {
  id: string
  user_id: string
  date: string
  time: string
  type: string
  doctor: string
  location: string
  notes: string
  status: string
  created_at: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: string
  frequency: string
  prescribed_by: string
  start_date: string
  end_date: string
  status: string
  notes: string
  created_at: string
}
