# PulseDesk 🩺
> **Unified Clinical & Emergency Command Center**
> Modern Healthcare Management, Emergency Dispatch & Patient Operations Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 💡 Overview

**PulseDesk** is an executive-grade healthcare operations and rapid emergency triage platform built for modern hospital networks and emergency response teams. It unifies high-stress workflows—from 108 emergency hotline dispatch and real-time ambulance tracking to outpatient scheduling, patient records, and regional blood supply alerts—into a single high-availability command center.

---

## 📁 Project Architecture & File Tree

```
pulsedesk/
│
├── app/
│   ├── page.tsx               # Executive Command Center Dashboard
│   ├── layout.tsx             # Root layout with Sidebar and Header shell
│   ├── globals.css            # Tailwind utilities and base typography
│   │
│   ├── emergency/             # Emergency room triage & 108 dispatch
│   │   └── page.tsx
│   ├── appointments/          # Outpatient appointment management
│   │   └── page.tsx
│   ├── patients/              # Patient registry and medical history
│   │   └── page.tsx
│   ├── ambulance/             # Real-time ambulance fleet telemetry
│   │   └── page.tsx
│   ├── blood/                 # Blood bank inventory and deficit alerts
│   │   └── page.tsx
│   ├── facilities/            # Regional hospital & ICU bed capacity
│   │   └── page.tsx
│   │
│   └── api/                   # REST API backend endpoints
│       ├── patients/route.ts
│       ├── appointments/route.ts
│       ├── ambulance/route.ts
│       ├── emergency/route.ts
│       ├── blood/route.ts
│       └── facilities/route.ts
│
├── components/                # Reusable UI component library
│   ├── Sidebar.tsx            # Navigation drawer with live badges
│   ├── Header.tsx             # Top bar with quick emergency triggers
│   ├── StatCard.tsx           # Telemetry KPI cards with trends
│   ├── Button.tsx             # Accessible button with design variants
│   ├── Modal.tsx              # Focus-trapped dialog modals
│   ├── StatusBadge.tsx        # Dynamic state pills
│   ├── AppointmentCard.tsx    # Appointment schedule item
│   ├── PatientCard.tsx        # Patient identity card
│   ├── EmergencyCard.tsx      # High-visibility emergency triage card
│   ├── AmbulanceCard.tsx      # Fleet status & driver telemetry
│   └── BloodStockCard.tsx     # Blood volume gauge with adjusters
│
├── lib/
│   ├── types.ts               # Core TypeScript domain models
│   ├── data.ts                # Mock dataset with realistic clinic data
│   ├── db.ts                  # In-memory and Prisma database abstraction
│   └── utils.ts               # Formatting, styles, and status helpers
│
├── prisma/
│   └── schema.prisma          # PostgreSQL relational schema
│
├── public/
│   ├── logo.png               # PulseDesk identity icon
│   ├── ambulance.png          # Emergency fleet asset
│   └── hospital.png           # Healthcare facility asset
│
├── Dockerfile                 # Multi-stage production container
├── docker-compose.yml         # Containerized Next.js + PostgreSQL
├── .env                       # Local environment variables
├── .env.example               # Environment template
└── README.md                  # Hackathon documentation
```

---

## 🏥 Core Domain Models

| Model | Key Fields | Purpose |
|---|---|---|
| **Patient** | `id`, `name`, `age`, `gender`, `phone`, `bloodGroup`, `emergencyContact`, `medicalHistory` | Comprehensive patient health registry |
| **Appointment** | `id`, `patientName`, `doctorName`, `department`, `date`, `time`, `purpose`, `status`, `priority` | Clinical appointment scheduling & queue management |
| **Ambulance** | `id`, `vehicleNumber`, `type`, `driverName`, `driverPhone`, `status`, `currentLocation`, `fuelLevel` | Rapid response vehicle dispatch & telemetry |
| **EmergencyRequest** | `id`, `patientName`, `contact`, `emergencyType`, `severity`, `location`, `ambulanceAssignedId`, `status` | Real-time triage and 108 incident response |
| **BloodStock** | `id`, `bloodGroup`, `unitsAvailable`, `status`, `hospitalName`, `minThreshold` | Blood bank inventory with shortage alerts |
| **Facility** | `id`, `name`, `type`, `totalBeds`, `availableBeds`, `icuBeds`, `availableIcu`, `rating` | Bed occupancy and healthcare provider directory |

---

## ⚡ Key Modules & Features

### 1. Executive Hospital Command Center (`/`)
- Unified KPI summary: Active emergencies, ambulances ready, outpatient queue, rare blood reserves, and regional bed counts.
- High-visibility banner alert triggered automatically on critical triage cases.
- Live Emergency Dispatch stream with one-click ambulance deployment modal.

### 2. Emergency Room & 108 Dispatch (`/emergency`)
- Color-coded severity triage: **Critical (Red)**, **Severe (Orange)**, **Moderate (Yellow)**.
- Dispatch modal with automated GPS coordinate transmission simulation.
- Incident resolution workflow with trauma center handoff.

### 3. Outpatient Appointments (`/appointments`)
- Multi-criteria search (Patient name, phone, doctor) and status filtering.
- Intuitive modal booking with auto-populated patient datalists and doctor specialty routing.
- Real-time status lifecycle: `Scheduled` ➔ `Waiting` ➔ `In Consultation` ➔ `Completed`.

### 4. Patient Directory (`/patients`)
- Electronic medical registry with blood type badges and emergency contacts.
- Quick patient registration modal and detailed medical background drawer.

### 5. Ambulance Fleet Telemetry (`/ambulance`)
- Fleet readiness breakdown: `Available`, `Dispatched`, `On Route`, `Maintenance`.
- Driver communication details, fuel status gauge, and vehicle registration.

### 6. Blood Bank & Component Inventory (`/blood`)
- Complete stock monitoring across 8 blood groups (A±, B±, AB±, O±).
- Automatic threshold alarms for dangerous deficits (e.g. O- / AB-).
- Donation logging and ward dispensation tracking.

### 7. Facilities & Bed Capacity Directory (`/facilities`)
- Live bed occupancy percentage meters for General and ICU units.
- Real-time bed allocation adjusters (`+` / `-`).

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET`, `POST` | `/api/patients` | Retrieve patient list or register new patient |
| `GET`, `POST`, `PATCH` | `/api/appointments` | Manage appointment slots and update status |
| `GET`, `PATCH` | `/api/ambulance` | Query fleet availability and update vehicle status |
| `GET`, `POST`, `PATCH` | `/api/emergency` | Log emergency incident, dispatch ambulance, resolve case |
| `GET`, `PATCH` | `/api/blood` | Monitor blood stock and increment/decrement units |
| `GET`, `PATCH` | `/api/facilities` | List healthcare facilities and update available bed counts |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- npm or pnpm or yarn
- Docker & Docker Compose (optional, for containerized run)

### Local Development Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-org/pulsedesk.git
   cd pulsedesk
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker & Cloud Deployment

### Run with Docker Compose (App + PostgreSQL)
```bash
docker-compose up --build
```
The application will be live at `http://localhost:3000` connected to PostgreSQL on port `5432`.

### Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Clinical Disclaimer
PulseDesk is designed for administrative, dispatch, and triage coordination workflows. It does not replace medical diagnostics or licensed clinical judgment.
