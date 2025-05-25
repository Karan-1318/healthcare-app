import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export async function registerUser(userData: {
  firstName: string
  lastName: string
  email: string
  studentId: string
  dateOfBirth: string
  gender: string
  phone: string
  emergencyContact: string
  password: string
}) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("email").eq("email", userData.email).single()

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10)

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          student_id: userData.studentId,
          date_of_birth: userData.dateOfBirth,
          gender: userData.gender,
          phone: userData.phone,
          emergency_contact: userData.emergencyContact,
          password_hash: passwordHash,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Get user by email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      throw new Error("Invalid email or password")
    }

    // Remove password hash from returned user
    const { password_hash, ...userWithoutPassword } = user

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
