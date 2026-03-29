# AbaAccess

AbaAccess is a digital health access platform that enables individuals and families to purchase healthcare packages, manage dependents, and seamlessly access services across partner facilities through a consent-first system.

---

## 🌍 Overview

AbaAccess is part of the **ABA ecosystem**, which includes:

- **AbaAccess (Member App):** For patients and families
- **ABA Partner (Facility App):** For clinics, laboratories, and pharmacies

Together, they create a connected experience where healthcare services can be accessed predictably, transparently, and efficiently.

---

## 🎯 Problem

Healthcare access is often:
- **Unpredictable in cost**
- **Fragmented across services** (consultation, lab, pharmacy)
- **Difficult to coordinate for dependents**
- **Lacking transparency and trust**

---

## 💡 Solution

AbaAccess introduces **healthcare packages (bundles)** and a **consent-driven redemption flow**:

- Users purchase packages (e.g., Care Bundle, Consultation-only, Lab-only, Pharmacy-only)
- Facilities initiate service requests
- Users approve requests using a **secure PIN**
- The system automatically applies the most appropriate package
- Any uncovered services are handled via **out-of-pocket payment**

---

## 🧩 Core Features

### 👤 Member Management
- User registration and authentication (phone + PIN)
- Profile setup (name, location)
- ABA Member ID (unique identifier)

### 👨‍👩‍👧 Dependents
- Add and manage up to 3 dependents
- Assign healthcare usage across family members

### 📦 Packages
- Purchase healthcare packages
- Track usage (visits remaining)
- Support for bundled and single-service packages

### ✅ Approvals (Consent-first)
- Facility requests require user approval
- Approval via PIN ensures consent and transparency
- Supports remote approvals (e.g., caregiver scenarios)

### 🏥 Care Journey
- Track visits across:
  - Consultation
  - Laboratory
  - Pharmacy
- View prescriptions, lab results, and visit summaries

### 💰 Wallet & Payments
- Wallet top-up (Mobile Money)
- Transaction history
- Out-of-pocket payments when coverage is insufficient

### 📅 Booking (MVP)
- Discover partner facilities
- Book visits for self or dependents
- Track booking status

---

## 🔄 How It Works

1. User signs up and sets up profile
2. User purchases a healthcare package
3. User visits a partner facility
4. Facility initiates a service request (via ABA Partner)
5. User approves request using PIN
6. System applies package coverage
7. User continues through care (consultation → lab → pharmacy)
8. Transactions and visit history are recorded

---

## 🧠 Key Concepts

- **Consent-first:** Every service requires explicit user approval
- **Station-based flow:** Coverage is applied at each service point
- **Package intelligence:** System selects the best available package automatically
- **Fallback flexibility:** Out-of-pocket payment supported when needed

---

## 🛠️ Tech Stack (Suggested)

- **Frontend:** React + TypeScript
- **UI Components:** Kendo React / Custom Design System
- **State Management:** React Query / Redux Toolkit
- **Backend:** Node.js / .NET / Firebase (depending on implementation)
- **Database:** PostgreSQL / Firestore
- **Authentication:** OTP (phone) + PIN
- **Payments:** Mobile Money (MTN, Airtel)

---

## 🚀 Project Status

- ✅ MVP prototypes completed (AbaAccess + ABA Partner)
- 🔄 Preparing for pilot launch (Kampala & Wakiso)
- ⏳ Payment integrations and backend implementation in progress

---

## 🧪 Pilot Plan

- **Location:** Kampala & Wakiso
- **Target:** 200 users (founding members)
- **Partners:** Clinics, labs, pharmacies
- **Duration:** 8–10 weeks

---

## 📊 Success Metrics

- Package purchase rate
- Redemption success rate
- Approval time (request → approval)
- Out-of-pocket reduction
- User satisfaction
- Partner adoption and retention

---

## 🔐 Privacy & Trust

- Secure PIN-based approvals
- Minimal data exposure to facilities
- Transparent transaction and care history

---

## 🤝 Contributing

This project is currently in early-stage development. Contributions, feedback, and collaboration ideas are welcome.

---

## 📬 Contact

**Nakitto Catherine**  
Founder & Product Designer  
📍 Kampala, Uganda  

---

## 📌 Vision

To make healthcare access **predictable, transparent, and family-centered**, especially in emerging markets.