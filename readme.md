# 🥔 PotatoVault: Cold Storage Management System

**PotatoVault** is a specialized inventory management web application designed for cold storage service providers. It digitizes the traditional paper-based ledger system used to track potato stocks deposited by farmers, providing real-time transparency for the producer and centralized control for the facility owner.

---

## 🚀 Overview

In the traditional cold storage business, tracking thousands of quintals across different farmers can lead to manual errors and data discrepancies. **PotatoVault** solves these challenges by providing:

- **For Farmers:** A personal dashboard to monitor their deployed stock (variety, bag count, and storage duration) in real-time.
- **For Owners:** A centralized "Command Center" to manually update stock levels, manage farmer profiles, and oversee total warehouse capacity.

---

## 🛠️ Tech Stack

The backend is built using a modern, scalable stack designed for data integrity and high performance:

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) for secure session management
- **Environment:** npm (Node Package Manager)

---

## 🔑 Key Features

### 👤 User Roles & Permissions

The system implements strict **Role-Based Access Control (RBAC)** to ensure data security:

- **Admin/Owner:** Full **CRUD** (Create, Read, Update, Delete) access. Owners can register farmers, add new stock batches, manually adjust bag counts, and verify deposits.
- **Farmer:** Secure access to a private dashboard. Farmers can only view their specific stock details and status updates (e.g., "Active", "Pending", or "Withdrawn").

### 📦 Stock Management

- **Granular Tracking:** Organizes inventory by variety (e.g., Russet, Kufri), weight per bag, and specific warehouse chamber/rack locations.
- **Live Updates:** Immediate stock reflection—changes made by the owner are visible to the farmer instantly, eliminating the need for manual reports.
- **Transaction Logs:** Maintains a transparent history of stock movements (Inbound/Outbound) to build and maintain trust between the service provider and the farmer.
