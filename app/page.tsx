"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, FileText, Calendar, Pill, Plus, LogOut, Loader2, Settings } from "lucide-react"
import { DataManager } from "@/components/data-manager"
import { DeployButtons } from "@/components/deploy-buttons"

interface MedicalRecord {
  id: string
  date: string
  type: string
  description: string
  doctor: string
  notes: string
  dateAdded: string
}

interface Appointment {
  id: string
  date: string
  time: string
  type: string
  doctor: string
  location: string
  notes: string
  status: string
  dateScheduled: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
  startDate: string
  endDate: string
  status: string
  notes: string
  dateAdded: string
}

interface AppUser {
  id: string
  firstName: string
  lastName: string
  email: string
  studentId: string
  dateOfBirth: string
  gender: string
  phone: string
  emergencyContact: string
  password: string
  registrationDate: string
  medicalRecords: MedicalRecord[]
  appointments: Appointment[]
  medications: Medication[]
}

export default function HealthcareApp() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showMedicalRecordDialog, setShowMedicalRecordDialog] = useState(false)
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [showMedicationDialog, setShowMedicationDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
  })
  const [medicalRecordForm, setMedicalRecordForm] = useState({
    date: "",
    type: "",
    description: "",
    doctor: "",
    notes: "",
  })
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    type: "",
    doctor: "",
    location: "",
    notes: "",
  })
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    prescribedBy: "",
    startDate: "",
    endDate: "",
    status: "active",
    notes: "",
  })

  // Load user from localStorage on component mount
  useEffect(() => {
    // Check for import parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    const importData = urlParams.get("import")

    if (importData) {
      try {
        const decodedData = JSON.parse(atob(importData))
        if (decodedData.user) {
          handleDataImported(decodedData.user)
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
          return
        }
      } catch (error) {
        console.error("Error importing data from URL:", error)
      }
    }

    const user = localStorage.getItem("currentUser")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setCurrentUser(userData)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const handleDataImported = (userData: AppUser) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUserIndex = users.findIndex((u: AppUser) => u.email === userData.email)

      if (existingUserIndex !== -1) {
        users[existingUserIndex] = userData
      } else {
        users.push(userData)
      }

      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setCurrentUser(userData)
    } catch (error) {
      console.error("Error handling imported data:", error)
    }
  }

  // Save user data to localStorage
  const saveUserData = (userData: AppUser) => {
    try {
      // Update users array in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: AppUser) => u.id === userData.id)

      if (userIndex !== -1) {
        users[userIndex] = userData
      } else {
        users.push(userData)
      }

      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setCurrentUser(userData)
    } catch (error) {
      console.error("Error saving user data:", error)
      alert("Error saving data. Please try again.")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: AppUser) => u.email === loginForm.email && u.password === loginForm.password)

      if (user) {
        setCurrentUser(user)
        localStorage.setItem("currentUser", JSON.stringify(user))
        setShowAuthDialog(false)
        setLoginForm({ email: "", password: "" })
      } else {
        alert("Invalid email or password!")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match!")
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      alert("Password must be at least 6 characters long!")
      setLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      if (users.find((user: AppUser) => user.email === registerForm.email)) {
        alert("User with this email already exists!")
        setLoading(false)
        return
      }

      if (users.find((user: AppUser) => user.studentId === registerForm.studentId)) {
        alert("User with this student ID already exists!")
        setLoading(false)
        return
      }

      const newUser: AppUser = {
        id: Date.now().toString(),
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        studentId: registerForm.studentId,
        dateOfBirth: registerForm.dateOfBirth,
        gender: registerForm.gender,
        phone: registerForm.phone,
        emergencyContact: registerForm.emergencyContact,
        password: registerForm.password,
        registrationDate: new Date().toISOString(),
        medicalRecords: [],
        appointments: [],
        medications: [],
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      alert("Registration successful! Please login with your credentials.")
      setIsLoginMode(true)
      setRegisterForm({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        emergencyContact: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    setActiveTab("overview")
  }

  const handleAddMedicalRecord = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)
    try {
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        ...medicalRecordForm,
        dateAdded: new Date().toISOString(),
      }

      const updatedUser = {
        ...currentUser,
        medicalRecords: [newRecord, ...currentUser.medicalRecords],
      }

      saveUserData(updatedUser)
      setShowMedicalRecordDialog(false)
      setMedicalRecordForm({ date: "", type: "", description: "", doctor: "", notes: "" })
      alert("Medical record added successfully!")
    } catch (error) {
      console.error("Error adding medical record:", error)
      alert("Failed to add medical record. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)
    try {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...appointmentForm,
        status: "scheduled",
        dateScheduled: new Date().toISOString(),
      }

      const updatedUser = {
        ...currentUser,
        appointments: [newAppointment, ...currentUser.appointments],
      }

      saveUserData(updatedUser)
      setShowAppointmentDialog(false)
      setAppointmentForm({ date: "", time: "", type: "", doctor: "", location: "", notes: "" })
      alert("Appointment scheduled successfully!")
    } catch (error) {
      console.error("Error adding appointment:", error)
      alert("Failed to schedule appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)
    try {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name: medicationForm.name,
        dosage: medicationForm.dosage,
        frequency: medicationForm.frequency,
        prescribedBy: medicationForm.prescribedBy,
        startDate: medicationForm.startDate,
        endDate: medicationForm.endDate,
        status: medicationForm.status,
        notes: medicationForm.notes,
        dateAdded: new Date().toISOString(),
      }

      const updatedUser = {
        ...currentUser,
        medications: [newMedication, ...currentUser.medications],
      }

      saveUserData(updatedUser)
      setShowMedicationDialog(false)
      setMedicationForm({
        name: "",
        dosage: "",
        frequency: "",
        prescribedBy: "",
        startDate: "",
        endDate: "",
        status: "active",
        notes: "",
      })
      alert("Medication added successfully!")
    } catch (error) {
      console.error("Error adding medication:", error)
      alert("Failed to add medication. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">HealthCare Hub</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost">About</Button>
                <Button variant="ghost">Services</Button>
                <Button variant="ghost">Contact</Button>
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button>Get Started</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isLoginMode ? "Login" : "Register"}</DialogTitle>
                      <DialogDescription>
                        {isLoginMode ? "Sign in to your account" : "Create a new account"}
                      </DialogDescription>
                    </DialogHeader>

                    {isLoginMode ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Login
                        </Button>
                        <p className="text-center text-sm">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setIsLoginMode(false)}
                            className="text-blue-600 hover:underline"
                            disabled={loading}
                          >
                            Register here
                          </button>
                        </p>
                      </form>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={registerForm.firstName}
                              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                              required
                              disabled={loading}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={registerForm.lastName}
                              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="studentId">Student ID</Label>
                          <Input
                            id="studentId"
                            value={registerForm.studentId}
                            onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={registerForm.dateOfBirth}
                              onChange={(e) => setRegisterForm({ ...registerForm, dateOfBirth: e.target.value })}
                              required
                              disabled={loading}
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                              value={registerForm.gender}
                              onValueChange={(value) => setRegisterForm({ ...registerForm, gender: value })}
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact</Label>
                          <Input
                            id="emergencyContact"
                            type="tel"
                            value={registerForm.emergencyContact}
                            onChange={(e) => setRegisterForm({ ...registerForm, emergencyContact: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Register
                        </Button>
                        <p className="text-center text-sm">
                          Already have an account?{" "}
                          <button
                            type="button"
                            onClick={() => setIsLoginMode(true)}
                            className="text-blue-600 hover:underline"
                            disabled={loading}
                          >
                            Login here
                          </button>
                        </p>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">Student Healthcare Management System</h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Manage your health records, appointments, and medical history all in one secure place.
              <br />
              <strong className="text-blue-600">Multiple deployment options available!</strong>
            </p>
            <div className="mt-10">
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button size="lg" className="mr-4">
                    Get Started
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600" />
                <CardTitle>Easy Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Multiple hosting options including Surge.sh, GitHub Pages, and more</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600" />
                <CardTitle>No Git Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Deploy with simple commands or web interfaces - no Git knowledge needed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-blue-600" />
                <CardTitle>Free Hosting</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All deployment options are completely free with permanent links</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HealthCare Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser.firstName}!</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="medical-history">Medical History</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentUser.medicalRecords.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentUser.appointments.filter((apt) => new Date(apt.date) > new Date()).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentUser.medications.filter((med) => med.status === "active").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser.medicalRecords.length === 0 && currentUser.appointments.length === 0 ? (
                  <p className="text-gray-500">No recent activity</p>
                ) : (
                  <div className="space-y-2">
                    {currentUser.medicalRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex justify-between items-center">
                        <span>Added medical record: {record.type}</span>
                        <span className="text-sm text-gray-500">{formatDate(record.dateAdded)}</span>
                      </div>
                    ))}
                    {currentUser.appointments.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-center">
                        <span>Scheduled appointment: {appointment.type}</span>
                        <span className="text-sm text-gray-500">{formatDate(appointment.dateScheduled)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Student ID:</strong> {currentUser.studentId}
                      </p>
                      <p>
                        <strong>Email:</strong> {currentUser.email}
                      </p>
                      <p>
                        <strong>Age:</strong> {calculateAge(currentUser.dateOfBirth)} years
                      </p>
                      <p>
                        <strong>Gender:</strong> {currentUser.gender}
                      </p>
                      <p>
                        <strong>Phone:</strong> {currentUser.phone}
                      </p>
                      <p>
                        <strong>Emergency Contact:</strong> {currentUser.emergencyContact}
                      </p>
                      <p>
                        <strong>Registration Date:</strong> {formatDate(currentUser.registrationDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical-history">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Medical History
                </CardTitle>
                <Dialog open={showMedicalRecordDialog} onOpenChange={setShowMedicalRecordDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Medical Record</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddMedicalRecord} className="space-y-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={medicalRecordForm.date}
                          onChange={(e) => setMedicalRecordForm({ ...medicalRecordForm, date: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={medicalRecordForm.type}
                          onValueChange={(value) => setMedicalRecordForm({ ...medicalRecordForm, type: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkup">Regular Checkup</SelectItem>
                            <SelectItem value="illness">Illness</SelectItem>
                            <SelectItem value="injury">Injury</SelectItem>
                            <SelectItem value="vaccination">Vaccination</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={medicalRecordForm.description}
                          onChange={(e) => setMedicalRecordForm({ ...medicalRecordForm, description: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="doctor">Doctor/Healthcare Provider</Label>
                        <Input
                          id="doctor"
                          value={medicalRecordForm.doctor}
                          onChange={(e) => setMedicalRecordForm({ ...medicalRecordForm, doctor: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={medicalRecordForm.notes}
                          onChange={(e) => setMedicalRecordForm({ ...medicalRecordForm, notes: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Record
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {currentUser.medicalRecords.length === 0 ? (
                  <p className="text-gray-500">No medical records found</p>
                ) : (
                  <div className="space-y-4">
                    {currentUser.medicalRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold capitalize">{record.type}</h4>
                            <p className="text-gray-600 mt-1">{record.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              <strong>Doctor:</strong> {record.doctor}
                            </p>
                            {record.notes && (
                              <p className="text-sm text-gray-500 mt-1">
                                <strong>Notes:</strong> {record.notes}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary">{formatDate(record.date)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointments
                </CardTitle>
                <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Appointment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddAppointment} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={appointmentForm.date}
                            onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={appointmentForm.time}
                            onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={appointmentForm.type}
                          onValueChange={(value) => setAppointmentForm({ ...appointmentForm, type: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general-checkup">General Checkup</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="specialist">Specialist Visit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="doctor">Doctor/Healthcare Provider</Label>
                        <Input
                          id="doctor"
                          value={appointmentForm.doctor}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={appointmentForm.location}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, location: e.target.value })}
                          placeholder="e.g., Campus Health Center"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={appointmentForm.notes}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                          placeholder="Additional notes or symptoms"
                          disabled={loading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Schedule Appointment
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {currentUser.appointments.length === 0 ? (
                  <p className="text-gray-500">No appointments scheduled</p>
                ) : (
                  <div className="space-y-4">
                    {currentUser.appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold capitalize">{appointment.type.replace("-", " ")}</h4>
                            <p className="text-gray-600 mt-1">
                              <strong>Doctor:</strong> {appointment.doctor}
                            </p>
                            <p className="text-gray-600">
                              <strong>Date:</strong> {formatDate(appointment.date)} at {appointment.time}
                            </p>
                            {appointment.location && (
                              <p className="text-gray-600">
                                <strong>Location:</strong> {appointment.location}
                              </p>
                            )}
                            {appointment.notes && (
                              <p className="text-sm text-gray-500 mt-2">
                                <strong>Notes:</strong> {appointment.notes}
                              </p>
                            )}
                          </div>
                          <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2" />
                  Medications
                </CardTitle>
                <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Medication</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddMedication} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Medication Name</Label>
                        <Input
                          id="name"
                          value={medicationForm.name}
                          onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                          placeholder="e.g., Ibuprofen"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            value={medicationForm.dosage}
                            onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                            placeholder="e.g., 200mg"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select
                            value={medicationForm.frequency}
                            onValueChange={(value) => setMedicationForm({ ...medicationForm, frequency: value })}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once-daily">Once Daily</SelectItem>
                              <SelectItem value="twice-daily">Twice Daily</SelectItem>
                              <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                              <SelectItem value="four-times-daily">Four Times Daily</SelectItem>
                              <SelectItem value="as-needed">As Needed</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="prescribedBy">Prescribed By</Label>
                        <Input
                          id="prescribedBy"
                          value={medicationForm.prescribedBy}
                          onChange={(e) => setMedicationForm({ ...medicationForm, prescribedBy: e.target.value })}
                          placeholder="Doctor's name"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={medicationForm.startDate}
                            onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date (Optional)</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={medicationForm.endDate}
                            onChange={(e) => setMedicationForm({ ...medicationForm, endDate: e.target.value })}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={medicationForm.status}
                          onValueChange={(value) => setMedicationForm({ ...medicationForm, status: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="discontinued">Discontinued</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={medicationForm.notes}
                          onChange={(e) => setMedicationForm({ ...medicationForm, notes: e.target.value })}
                          placeholder="Side effects, instructions, etc."
                          disabled={loading}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Add Medication
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {currentUser.medications.length === 0 ? (
                  <p className="text-gray-500">No medications recorded</p>
                ) : (
                  <div className="space-y-4">
                    {currentUser.medications.map((medication) => (
                      <div key={medication.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{medication.name}</h4>
                            <p className="text-gray-600 mt-1">
                              <strong>Dosage:</strong> {medication.dosage}
                            </p>
                            <p className="text-gray-600">
                              <strong>Frequency:</strong> {medication.frequency.replace("-", " ")}
                            </p>
                            <p className="text-gray-600">
                              <strong>Prescribed by:</strong> {medication.prescribedBy}
                            </p>
                            <p className="text-gray-600">
                              <strong>Start Date:</strong> {formatDate(medication.startDate)}
                            </p>
                            {medication.endDate && (
                              <p className="text-gray-600">
                                <strong>End Date:</strong> {formatDate(medication.endDate)}
                              </p>
                            )}
                            {medication.notes && (
                              <p className="text-sm text-gray-500 mt-2">
                                <strong>Notes:</strong> {medication.notes}
                              </p>
                            )}
                          </div>
                          <Badge variant={medication.status === "active" ? "default" : "secondary"}>
                            {medication.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <DeployButtons />
              <DataManager currentUser={currentUser} onDataImported={handleDataImported} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
