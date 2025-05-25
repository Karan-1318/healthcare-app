// Dashboard specific JavaScript
let currentUser

document.addEventListener("DOMContentLoaded", () => {
  checkDashboardAuth()
  initializeDashboard()
})

function checkDashboardAuth() {
  const user = localStorage.getItem("currentUser")
  if (!user) {
    window.location.href = "index.html"
    return
  }
  currentUser = JSON.parse(user)
}

function initializeDashboard() {
  loadUserProfile()
  loadDashboardStats()
  loadRecentActivity()
  setupDashboardEventListeners()

  // Set welcome message
  const welcomeElement = document.getElementById("welcomeUser")
  if (welcomeElement && currentUser) {
    welcomeElement.textContent = `Welcome, ${currentUser.firstName}!`
  }
}

function setupDashboardEventListeners() {
  // Medical record form
  const medicalRecordForm = document.getElementById("medicalRecordForm")
  if (medicalRecordForm) {
    medicalRecordForm.addEventListener("submit", handleAddMedicalRecord)
  }

  // Appointment form
  const appointmentForm = document.getElementById("appointmentForm")
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", handleAddAppointment)
  }

  // Medication form
  const medicationForm = document.getElementById("medicationForm")
  if (medicationForm) {
    medicationForm.addEventListener("submit", handleAddMedication)
  }

  // Menu items
  const menuItems = document.querySelectorAll(".menu-item")
  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault()
      const sectionName = this.getAttribute("onclick").match(/'([^']+)'/)[1]
      showSection(sectionName)
    })
  })
}

function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".dashboard-section")
  sections.forEach((section) => section.classList.remove("active"))

  // Remove active class from all menu items
  const menuItems = document.querySelectorAll(".menu-item")
  menuItems.forEach((item) => item.classList.remove("active"))

  // Show selected section
  const targetSection = document.getElementById(sectionName)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Load section-specific data
  switch (sectionName) {
    case "profile":
      loadProfileSection()
      break
    case "medical-history":
      loadMedicalHistorySection()
      break
    case "appointments":
      loadAppointmentsSection()
      break
    case "medications":
      loadMedicationsSection()
      break
  }
}

function loadUserProfile() {
  if (!currentUser) return

  const profileInfo = document.getElementById("profileInfo")
  if (profileInfo) {
    const age = calculateAge(currentUser.dateOfBirth)
    profileInfo.innerHTML = `
            <h3>${currentUser.firstName} ${currentUser.lastName}</h3>
            <p><strong>Student ID:</strong> ${currentUser.studentId}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Age:</strong> ${age} years</p>
            <p><strong>Gender:</strong> ${currentUser.gender}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Emergency Contact:</strong> ${currentUser.emergencyContact}</p>
            <p><strong>Registration Date:</strong> ${formatDate(currentUser.registrationDate)}</p>
        `
  }
}

function loadDashboardStats() {
  if (!currentUser) return

  const totalRecords = currentUser.medicalRecords ? currentUser.medicalRecords.length : 0
  const upcomingAppointments = currentUser.appointments
    ? currentUser.appointments.filter((apt) => new Date(apt.date) > new Date()).length
    : 0
  const activeMedications = currentUser.medications
    ? currentUser.medications.filter((med) => med.status === "active").length
    : 0

  document.getElementById("totalRecords").textContent = totalRecords
  document.getElementById("upcomingAppointments").textContent = upcomingAppointments
  document.getElementById("activeMedications").textContent = activeMedications
}

function loadRecentActivity() {
  if (!currentUser) return

  const activityList = document.getElementById("recentActivityList")
  const activities = []

  // Add recent medical records
  if (currentUser.medicalRecords) {
    currentUser.medicalRecords.slice(0, 3).forEach((record) => {
      activities.push({
        type: "medical-record",
        date: record.dateAdded,
        description: `Added medical record: ${record.type}`,
      })
    })
  }

  // Add recent appointments
  if (currentUser.appointments) {
    currentUser.appointments.slice(0, 2).forEach((appointment) => {
      activities.push({
        type: "appointment",
        date: appointment.dateScheduled,
        description: `Scheduled appointment: ${appointment.type}`,
      })
    })
  }

  // Sort by date
  activities.sort((a, b) => new Date(b.date) - new Date(a.date))

  if (activities.length === 0) {
    activityList.innerHTML = '<p class="no-data">No recent activity</p>'
    return
  }

  activityList.innerHTML = activities
    .slice(0, 5)
    .map(
      (activity) => `
        <div class="activity-item">
            <p>${activity.description}</p>
            <small>${formatDate(activity.date)}</small>
        </div>
    `,
    )
    .join("")
}

function loadProfileSection() {
  loadUserProfile()
}

function loadMedicalHistorySection() {
  if (!currentUser || !currentUser.medicalRecords) {
    document.getElementById("medicalRecordsList").innerHTML = '<p class="no-data">No medical records found</p>'
    return
  }

  const recordsList = document.getElementById("medicalRecordsList")
  recordsList.innerHTML = currentUser.medicalRecords
    .map(
      (record) => `
        <div class="record-item">
            <div class="record-info">
                <h4>${record.type.charAt(0).toUpperCase() + record.type.slice(1)}</h4>
                <p><strong>Description:</strong> ${record.description}</p>
                <p><strong>Doctor:</strong> ${record.doctor}</p>
                ${record.notes ? `<p><strong>Notes:</strong> ${record.notes}</p>` : ""}
            </div>
            <div class="record-date">${formatDate(record.date)}</div>
        </div>
    `,
    )
    .join("")
}

function loadAppointmentsSection() {
  const appointmentsList = document.getElementById("appointmentsList")

  if (!currentUser || !currentUser.appointments || currentUser.appointments.length === 0) {
    appointmentsList.innerHTML = '<p class="no-data">No appointments scheduled</p>'
    return
  }

  appointmentsList.innerHTML = currentUser.appointments
    .map(
      (appointment) => `
        <div class="appointment-item">
            <div class="appointment-info">
                <h4>${appointment.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</h4>
                <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                <p><strong>Date:</strong> ${formatDate(appointment.date)} at ${appointment.time}</p>
                ${appointment.location ? `<p><strong>Location:</strong> ${appointment.location}</p>` : ""}
                ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ""}
                <p><strong>Status:</strong> <span class="status-${appointment.status}">${appointment.status}</span></p>
            </div>
            <div class="appointment-date">${formatDate(appointment.dateScheduled)}</div>
        </div>
    `,
    )
    .join("")
}

function loadMedicationsSection() {
  const medicationsList = document.getElementById("medicationsList")

  if (!currentUser || !currentUser.medications || currentUser.medications.length === 0) {
    medicationsList.innerHTML = '<p class="no-data">No medications recorded</p>'
    return
  }

  medicationsList.innerHTML = currentUser.medications
    .map(
      (medication) => `
        <div class="medication-item">
            <div class="medication-info">
                <h4>${medication.name}</h4>
                <p><strong>Dosage:</strong> ${medication.dosage}</p>
                <p><strong>Frequency:</strong> ${medication.frequency.replace("-", " ")}</p>
                <p><strong>Prescribed by:</strong> ${medication.prescribedBy}</p>
                <p><strong>Start Date:</strong> ${formatDate(medication.startDate)}</p>
                ${medication.endDate ? `<p><strong>End Date:</strong> ${formatDate(medication.endDate)}</p>` : ""}
                ${medication.notes ? `<p><strong>Notes:</strong> ${medication.notes}</p>` : ""}
            </div>
            <div class="medication-dosage status-${medication.status}">${medication.status}</div>
        </div>
    `,
    )
    .join("")
}

function handleAddMedicalRecord(event) {
  event.preventDefault()

  const recordData = {
    date: document.getElementById("recordDate").value,
    type: document.getElementById("recordType").value,
    description: document.getElementById("recordDescription").value,
    doctor: document.getElementById("recordDoctor").value,
    notes: document.getElementById("recordNotes").value,
  }

  addMedicalRecord(recordData)
  closeModal("medicalRecordModal")
  loadMedicalHistorySection()
  loadDashboardStats()
  loadRecentActivity()

  // Reset form
  document.getElementById("medicalRecordForm").reset()

  alert("Medical record added successfully!")
}

function handleAddAppointment(event) {
  event.preventDefault()

  const appointmentData = {
    id: Date.now().toString(),
    date: document.getElementById("appointmentDate").value,
    time: document.getElementById("appointmentTime").value,
    type: document.getElementById("appointmentType").value,
    doctor: document.getElementById("appointmentDoctor").value,
    location: document.getElementById("appointmentLocation").value,
    notes: document.getElementById("appointmentNotes").value,
    dateScheduled: new Date().toISOString(),
    status: "scheduled",
  }

  if (!currentUser.appointments) {
    currentUser.appointments = []
  }

  currentUser.appointments.unshift(appointmentData)
  saveUserData(currentUser)

  closeModal("appointmentModal")
  loadAppointmentsSection()
  loadDashboardStats()
  loadRecentActivity()

  // Reset form
  document.getElementById("appointmentForm").reset()

  alert("Appointment scheduled successfully!")
}

function handleAddMedication(event) {
  event.preventDefault()

  const medicationData = {
    id: Date.now().toString(),
    name: document.getElementById("medicationName").value,
    dosage: document.getElementById("medicationDosage").value,
    frequency: document.getElementById("medicationFrequency").value,
    prescribedBy: document.getElementById("medicationPrescribedBy").value,
    startDate: document.getElementById("medicationStartDate").value,
    endDate: document.getElementById("medicationEndDate").value,
    status: document.getElementById("medicationStatus").value,
    notes: document.getElementById("medicationNotes").value,
    dateAdded: new Date().toISOString(),
  }

  if (!currentUser.medications) {
    currentUser.medications = []
  }

  currentUser.medications.unshift(medicationData)
  saveUserData(currentUser)

  closeModal("medicationModal")
  loadMedicationsSection()
  loadDashboardStats()
  loadRecentActivity()

  // Reset form
  document.getElementById("medicationForm").reset()

  alert("Medication added successfully!")
}

function saveUserData(userData) {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const userIndex = users.findIndex((u) => u.id === userData.id)

  if (userIndex !== -1) {
    users[userIndex] = userData
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(userData))
    currentUser = userData
  }
}

function editProfile() {
  alert("Profile editing feature will be implemented in the next version!")
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
}

// Update the logout function
function logout() {
  localStorage.removeItem("currentUser")
  currentUser = null
  window.location.href = "index.html"
}

// Utility function to calculate age (if not already defined)
function calculateAge(dateOfBirth) {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

// Utility function to format date (if not already defined)
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function addMedicalRecord(recordData) {
  if (!currentUser || !currentUser.medicalRecords) {
    currentUser.medicalRecords = []
  }
  currentUser.medicalRecords.push(recordData)
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
}

function scheduleAppointment() {
  document.getElementById("appointmentModal").style.display = "block"
}

function addMedication(medicationData) {
  if (!currentUser || !currentUser.medications) {
    currentUser.medications = []
  }
  currentUser.medications.push(medicationData)
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
}
