import { supabase } from "./supabase"
import type { MedicalRecord, Appointment, Medication } from "./supabase"

// Medical Records
export async function addMedicalRecord(
  userId: string,
  recordData: Omit<MedicalRecord, "id" | "user_id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("medical_records")
    .insert([{ ...recordData, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMedicalRecords(userId: string) {
  const { data, error } = await supabase
    .from("medical_records")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

// Appointments
export async function addAppointment(
  userId: string,
  appointmentData: Omit<Appointment, "id" | "user_id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("appointments")
    .insert([{ ...appointmentData, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAppointments(userId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) throw error
  return data || []
}

// Medications
export async function addMedication(userId: string, medicationData: Omit<Medication, "id" | "user_id" | "created_at">) {
  const { data, error } = await supabase
    .from("medications")
    .insert([{ ...medicationData, user_id: userId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMedications(userId: string) {
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false })

  if (error) throw error
  return data || []
}
