-- ============================================================================
-- PulseDesk: Supabase Database Schema & Seed Data
-- Unified Clinical & Emergency Command Center
-- ============================================================================

-- 1. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    phone TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "emergencyContact" TEXT DEFAULT '',
    address TEXT DEFAULT '',
    "medicalHistory" TEXT DEFAULT '',
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    "patientId" TEXT,
    "patientName" TEXT NOT NULL,
    phone TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    department TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    priority TEXT NOT NULL DEFAULT 'Normal',
    notes TEXT DEFAULT '',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_appointment_patient FOREIGN KEY ("patientId") REFERENCES public.patients(id) ON DELETE SET NULL
);

-- 3. AMBULANCES TABLE
CREATE TABLE IF NOT EXISTS public.ambulances (
    id TEXT PRIMARY KEY,
    "vehicleNumber" TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'Basic Life Support (BLS)',
    "driverName" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available',
    "currentLocation" TEXT NOT NULL,
    "baseHospital" TEXT NOT NULL,
    "fuelLevel" INTEGER NOT NULL DEFAULT 100,
    "etaMinutes" INTEGER DEFAULT 5,
    "lastUpdated" TEXT DEFAULT 'Just now'
);

-- 4. EMERGENCY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.emergency_requests (
    id TEXT PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    contact TEXT NOT NULL,
    "emergencyType" TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'Critical',
    location TEXT NOT NULL,
    "ambulanceAssignedId" TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    notes TEXT DEFAULT '',
    "requestedAt" TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_emergency_ambulance FOREIGN KEY ("ambulanceAssignedId") REFERENCES public.ambulances(id) ON DELETE SET NULL
);

-- 5. BLOOD STOCKS TABLE
CREATE TABLE IF NOT EXISTS public.blood_stocks (
    id TEXT PRIMARY KEY,
    "bloodGroup" TEXT NOT NULL UNIQUE,
    "unitsAvailable" INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Sufficient',
    "hospitalName" TEXT NOT NULL,
    "lastDonationDate" TEXT NOT NULL,
    "minThreshold" INTEGER NOT NULL DEFAULT 10
);

-- 6. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.facilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    "totalBeds" INTEGER NOT NULL DEFAULT 0,
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "icuBeds" INTEGER NOT NULL DEFAULT 0,
    "availableIcu" INTEGER NOT NULL DEFAULT 0,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    "emergencyServices" BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC NOT NULL DEFAULT 5.0,
    "operatingHours" TEXT NOT NULL DEFAULT '24/7 All Days'
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for PulseDesk clinical operations
-- ============================================================================

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated full access for development
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public access patients" ON public.patients;
    CREATE POLICY "Public access patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access appointments" ON public.appointments;
    CREATE POLICY "Public access appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access ambulances" ON public.ambulances;
    CREATE POLICY "Public access ambulances" ON public.ambulances FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access emergencies" ON public.emergency_requests;
    CREATE POLICY "Public access emergencies" ON public.emergency_requests FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access blood_stocks" ON public.blood_stocks;
    CREATE POLICY "Public access blood_stocks" ON public.blood_stocks FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public access facilities" ON public.facilities;
    CREATE POLICY "Public access facilities" ON public.facilities FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ============================================================================
-- ENABLE REALTIME REPLICATION (For live alerts and telemetry)
-- ============================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_requests;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ambulances;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_stocks;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;

-- ============================================================================
-- SEED DATA (Realistic Hospital & Emergency Data)
-- ============================================================================

INSERT INTO public.patients (id, name, age, gender, phone, "bloodGroup", "emergencyContact", address, "medicalHistory", "createdAt")
VALUES
('PAT-1001', 'Aarav Sharma', 34, 'Male', '9876543210', 'O+', '9876500001', 'B-204, Green Meadows, Pune', 'Asthma, Seasonal allergies', '2026-09-20T10:00:00Z'),
('PAT-1002', 'Priya Patil', 28, 'Female', '9876543211', 'B+', '9876500002', 'Flat 12, Sunrise Residency, Pune', 'Post-surgery recovery (appendectomy)', '2026-09-22T14:30:00Z'),
('PAT-1003', 'Rahul Deshmukh', 45, 'Male', '9876543212', 'A+', '9876500003', '74, MG Road, Camp, Pune', 'Hypertension, Mild Type 2 Diabetes', '2026-09-24T09:15:00Z'),
('PAT-1004', 'Sneha Joshi', 52, 'Female', '9876543213', 'AB+', '9876500004', '15 Nilayam Heights, Kothrud', 'Hypothyroidism', '2026-09-25T11:45:00Z'),
('PAT-1005', 'Vikram Malhotra', 61, 'Male', '9876543214', 'O-', '9876500005', 'Plot 89, Baner Hills, Pune', 'Cardiac bypass 2024, Aspirin therapy', '2026-09-26T16:20:00Z'),
('PAT-1006', 'Ananya Iyer', 23, 'Female', '9876543215', 'A-', '9876500006', 'A-102, Viman Nagar, Pune', 'None', '2026-09-27T08:10:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.appointments (id, "patientId", "patientName", phone, "doctorName", department, date, time, purpose, status, priority, notes, "createdAt")
VALUES
('APT-2001', 'PAT-1001', 'Aarav Sharma', '9876543210', 'Dr. Sandeep Kulkarni', 'General Medicine', '2026-09-27', '09:30 AM', 'General check-up & breathing assessment', 'Waiting', 'Normal', 'Patient arrived 10 mins early', '2026-09-26T18:00:00Z'),
('APT-2002', 'PAT-1002', 'Priya Patil', '9876543211', 'Dr. Neha Mehta', 'Surgery Post-Op', '2026-09-27', '10:00 AM', 'Surgical suture removal and dressing', 'In Consultation', 'Normal', 'Room 104', '2026-09-25T11:00:00Z'),
('APT-2003', 'PAT-1003', 'Rahul Deshmukh', '9876543212', 'Dr. Aniruddh Gupta', 'Cardiology', '2026-09-27', '10:45 AM', 'Blood pressure fluctuation evaluation', 'Scheduled', 'Urgent', 'High priority due to BP spike (165/100)', '2026-09-27T08:30:00Z'),
('APT-2004', 'PAT-1004', 'Sneha Joshi', '9876543213', 'Dr. Meera Nambiar', 'Endocrinology', '2026-09-27', '11:30 AM', 'Quarterly Thyroid profile review', 'Scheduled', 'Follow-up', 'Lab reports attached', '2026-09-24T15:00:00Z'),
('APT-2005', 'PAT-1005', 'Vikram Malhotra', '9876543214', 'Dr. Sandeep Kulkarni', 'General Medicine', '2026-09-27', '02:00 PM', 'Routine lipid profile follow-up', 'Scheduled', 'Normal', '', '2026-09-26T12:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ambulances (id, "vehicleNumber", type, "driverName", "driverPhone", status, "currentLocation", "baseHospital", "fuelLevel", "etaMinutes", "lastUpdated")
VALUES
('AMB-01', 'MH-12-QX-4011', 'Advanced Life Support (ALS)', 'Ramesh Pawar', '+91 94230 11223', 'Available', 'PulseDesk Station Alpha (Sector 4)', 'PulseDesk Central Hospital', 92, 4, 'Just now'),
('AMB-02', 'MH-12-QX-7729', 'Advanced Life Support (ALS)', 'Suresh Gaikwad', '+91 98221 44556', 'Dispatched', 'Express Highway Junction, KM 14', 'PulseDesk Central Hospital', 78, 7, '2 mins ago'),
('AMB-03', 'MH-12-TC-1102', 'Basic Life Support (BLS)', 'Santosh Shinde', '+91 97654 33221', 'Available', 'North City Triage Post', 'PulseDesk North Annex', 85, 6, '5 mins ago'),
('AMB-04', 'MH-12-TC-9804', 'Patient Transport', 'Dinesh More', '+91 93701 99887', 'On Route', 'Transit to Westwing Dialysis Hub', 'PulseDesk Care Center', 64, 12, '3 mins ago'),
('AMB-05', 'MH-12-QX-3055', 'Advanced Life Support (ALS)', 'Mahesh Jagtap', '+91 91580 44332', 'Maintenance', 'Service Depot 2', 'PulseDesk Central Hospital', 45, NULL, '1 hour ago')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.emergency_requests (id, "patientName", contact, "emergencyType", severity, location, "ambulanceAssignedId", status, "requestedAt", notes)
VALUES
('EMG-901', 'Gopal Krishna', '9823101122', 'Suspected Acute Myocardial Infarction (Chest Pain)', 'Critical', 'Kalyani Nagar, Road No. 5', 'AMB-02', 'Dispatched', '2026-09-27T10:14:00Z', 'Patient is conscious, experiencing acute shortness of breath and left arm numbness.'),
('EMG-902', 'Rashmi Varma', '9890123456', 'High Velocity Two-Wheeler Collision', 'Severe', 'Aundh Flyover, Westbound lane', NULL, 'Pending', '2026-09-27T10:22:00Z', 'Multiple abrasions, visible limb fracture. Passerby initiated helpline call.'),
('EMG-903', 'Tanvi Saxena', '9766554433', 'Severe Pediatric Respiratory Distress (Croup)', 'Severe', 'Magarpatta Cybercity, Tower 7', 'AMB-01', 'Dispatched', '2026-09-27T09:50:00Z', 'Child age 4, pediatric bag-valve mask requested.'),
('EMG-904', 'Kishore Chawla', '9422009988', 'Fall with Head Trauma (Elderly)', 'Moderate', 'Model Colony, Bunglow 18', NULL, 'Resolved', '2026-09-27T08:15:00Z', 'Admitted to Trauma Bay 3. Stable vitals.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.blood_stocks (id, "bloodGroup", "unitsAvailable", status, "hospitalName", "lastDonationDate", "minThreshold")
VALUES
('BLD-01', 'O+', 42, 'Sufficient', 'PulseDesk Regional Blood Bank', '2026-09-26', 20),
('BLD-02', 'O-', 4, 'Critical', 'PulseDesk Regional Blood Bank', '2026-09-21', 10),
('BLD-03', 'A+', 28, 'Sufficient', 'PulseDesk Regional Blood Bank', '2026-09-25', 15),
('BLD-04', 'A-', 6, 'Low', 'PulseDesk Regional Blood Bank', '2026-09-23', 8),
('BLD-05', 'B+', 35, 'Sufficient', 'PulseDesk Regional Blood Bank', '2026-09-26', 15),
('BLD-06', 'B-', 5, 'Low', 'PulseDesk Regional Blood Bank', '2026-09-22', 8),
('BLD-07', 'AB+', 18, 'Sufficient', 'PulseDesk Regional Blood Bank', '2026-09-24', 10),
('BLD-08', 'AB-', 2, 'Critical', 'PulseDesk Regional Blood Bank', '2026-09-19', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.facilities (id, name, type, "totalBeds", "availableBeds", "icuBeds", "availableIcu", address, phone, "emergencyServices", rating, "operatingHours")
VALUES
('FAC-01', 'PulseDesk Central Multi-Specialty Hospital', 'Hospital', 250, 48, 35, 6, 'Senapati Bapat Road, Shivaji Nagar, Pune', '+91 20 6600 1000', true, 4.8, '24/7 All Days'),
('FAC-02', 'PulseDesk North Trauma & Critical Care', 'ICU Center', 120, 19, 40, 8, 'Plot 42, Nagar Road, Viman Nagar, Pune', '+91 20 6712 2000', true, 4.7, '24/7 All Days'),
('FAC-03', 'PulseDesk Regional Blood & Component Center', 'Blood Bank', 20, 14, 0, 0, 'Health City Complex, Camp, Pune', '+91 20 2613 5500', true, 4.9, '24/7 Emergency Blood Dispensing'),
('FAC-04', 'PulseDesk West Community Clinic & Diagnostics', 'Clinic', 40, 18, 4, 2, 'Baner-Pashan Link Road, Pune', '+91 20 2729 4400', false, 4.6, '08:00 AM - 10:00 PM'),
('FAC-05', 'PulseDesk Precision Pathology & Imaging Lab', 'Diagnostic Lab', 10, 8, 0, 0, 'Kothrud Central Plaza, Karve Road', '+91 20 2544 8899', false, 4.8, '06:30 AM - 11:00 PM')
ON CONFLICT (id) DO NOTHING;
