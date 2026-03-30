# 🎓 University Management System

**A full-featured University Management System** built with modern web technologies, designed to manage academic and administrative workflows efficiently.

---

## 🌐 Live Demo
🔗 https://university-system-beta.vercel.app/

---

## 🧠 Overview

This project is a **comprehensive university platform** that supports multiple user roles and core modules including:

- **Admin**
- **Student**
- **Faculty**
- **Student & Graduate Affairs**
- **Postgraduate Studies**
- **Cafeteria Management**
- **Exam Control**

Each module includes dashboards, secure API routes, and role-based access control to streamline university processes. :contentReference[oaicite:2]{index=2}

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | **Next.js (React)** |
| State Management | **Redux** |
| Authentication | **NextAuth.js** |
| Database | **MongoDB** |
| Styling | **Tailwind CSS & MUI (Material UI)** |
| Charts & Visualization | **Recharts** |
| Hosting / Deployment | **Vercel** | :contentReference[oaicite:3]{index=3}

---

## ✨ Key Features

✅ **Multi-Role Dashboards** – Custom interfaces for Admin, Students, Faculty, etc. :contentReference[oaicite:4]{index=4}  
✅ **Role-Based Access Control** – Secure restricted content and operations. :contentReference[oaicite:5]{index=5}  
✅ **Modular and Scalable Architecture** – Clean folder structure for features and pages. :contentReference[oaicite:6]{index=6}  
✅ **Secure Authentication & Sessions** – With NextAuth.js and session handling. :contentReference[oaicite:7]{index=7}  
✅ **Rich UI Components** – Built with Tailwind CSS and Material UI. :contentReference[oaicite:8]{index=8}  
✅ **Realtime Data Visualization** – Recharts used for academic metrics and insights. :contentReference[oaicite:9]{index=9}  

---

## 📁 Project Structure

```
university_system/
├─ data/                        # (Possibly seed or mock data files)
├─ models/                      # Database models (Mongoose schemas)
├─ public/                      # Static assets (icons, images, etc.)
├─ src/                         # Source code (frontend + backend)
│  ├─ app/                      # Next.js App Router pages
│  ├─ components/               # Reusable UI components
│  ├─ features/                 # Redux folder (slices , etc...)
│  ├─ hooks/                    # Custom React hooks
│  ├─ pages/                    # (If any legacy pages directory)
│  ├─ store/                    # Redux store setup
│  ├─ styles/                   # Global & component styles
│  └─ utils/                    # Utility helper functions
├─ validation/                  # Validation schemas (e.g., Zod/Yup)
├─ .gitignore                   # Git ignore rules
├─ README.md                    # Project documentation
├─ eslint.config.mjs            # ESlint config
├─ jsconfig.json                # Path aliases & JS config
├─ next.config.mjs              # Next.js configuration
├─ package.json                 # Dependencies & scripts
├─ postcss.config.mjs           # PostCSS config
└─ tailwind.config.js           # Tailwind CSS config

```
---

⭐ If you like this project, don’t forget to give it a star!
