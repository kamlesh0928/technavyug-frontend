<div align="center">

  <img src="./technavyug_banner_1775885527650.png" alt="Tech Navyug Banner" width="100%">

  # 🎓 Tech Navyug - The Ultimate LMS & E-commerce Ecosystem
  
  **A full-scale, production-ready platform for digital learning, technical content, and high-performance e-commerce.**

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.0--beta-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Redux](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.0-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)

</div>

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Portals & Roles](#-key-portals--roles)
- [Advanced Features](#-advanced-features)
- [Tech Stack Architecture](#️-tech-stack-architecture)
- [Folder Structure](#-folder-structure)
- [Installation & Environment](#-installation--environment)
- [API Integration](#-api-integration)
- [Performance & Security](#-performance--security)

---

## 🌟 Project Overview

**Tech Navyug** is more than just a website; it is a comprehensive ecosystem designed for modern educational and retail needs. Built using **React 19** and **Vite 8**, the frontend is optimized for extreme performance (Core Web Vitals) and provides a highly interactive experience for students, instructors, and administrators.

---

## 🎭 Key Portals & Roles

The application is architected around **Role-Based Access Control (RBAC)**, providing four unique experiences:

### 🏠 1. Public Experience
A high-converting homepage and catalog for guest users.
- **Dynamic Course Discovery**: Advanced filtering and slugs for SEO.
- **Seamless Shopping**: integrated product marketplace with a sliding cart system.
- **Knowledge Base**: Optimized blog listing and technical articles.

### 🛡️ 2. Admin Command Center
A powerful dashboard for complete system orchestration.
- **User Management**: Monitor and manage all users (Students, Instructors, Admins).
- **Commerce Tracking**: Full visibility into orders and transactions.
- **CMS Engine**: A custom-built blog editor with real-time preview.
- **Global Settings**: Configure site-wide parameters and SEO metadata.

### 👨‍🏫 3. Instructor Portal
Dedicated space for content creators to scale their impact.
- **Course Studio**: Intuitive tools to create, edit, and organize learning modules.
- **Analytics & Earnings**: Visual tracking of revenue and student engagement.
- **Student Management**: Direct insights into course enrollment metrics.

### 🎓 4. Student Sanctuary
A personalized learning environment focused on progress.
- **My Courses**: A centralized hub for all active and completed learning paths.
- **Integrated Learning**: An optimized interface for video lessons and resources.
- **Order History**: Track purchases and download invoices.

---

## ✨ Advanced Features

| Feature | Description |
| :--- | :--- |
| **🚀 Hybrid State** | Combines **Redux Toolkit** (Global UI/Cart) with **TanStack Query** (Server State/Caching). |
| **🎨 Design System** | Powered by **Tailwind 4** and **Shadcn/UI**, featuring custom gradients and micro-animations. |
| **📝 Tiptap CMS** | A headless rich-text editor for writing high-fidelity technical blogs. |
| **🛒 Cart Drawer** | A globally accessible, persistence-ready sliding cart for instant checkout across all pages. |
| **🛡️ Guarded Routes** | Multi-layer security using higher-order components (HOCs) to prevent unauthorized access. |
| **⚡ SEO Optimized** | Proper semantic HTML, dynamic title tags, and optimized asset loading via Vite. |

---

## 🛠️ Tech Stack Architecture

### **Core Engine**
- **Framework**: `React 19.x`
- **Build Pipeline**: `Vite 8.x` (ESM focus)
- **Language**: `Modern JavaScript (ESNext)`

### **Data & Logic**
- **Server Sync**: `@tanstack/react-query` (Auto-refetching, caching, and optimistic updates)
- **Global State**: `@reduxjs/toolkit` (UI states, Cart, Theme)
- **Forms**: `React Hook Form` + `Yup` (Schema-based validation)
- **HTTP**: `Axios` with interceptor layers for JWT token management.

### **UI & Styling**
- **Framework**: `Tailwind CSS 4.0` (Native CSS variables & ultra-lightweight)
- **Components**: `Radix UI` Primitive based components via `Shadcn/UI`.
- **Icons**: `Lucide-React` & `React-Icons`.
- **Feedback**: `React-Toastify` with customized themes.

---

## 📂 Folder Structure

```bash
technavyug-frontend/
├── src/                
│   ├── api/           # Base API & Axios interceptors
│   ├── components/    # Atomic UI (ui/, layout/, common/)
│   ├── guards/        # Protected Route Logic (Admin, Instructor, Student)
│   ├── layout/        # Wrapper layouts for different portals
│   ├── lib/           # Third-party config (Utils, Shadcn, Tiptap)
│   ├── pages/         # Page components grouped by role
│   ├── routes/        # Route definitions separate from App logic
│   ├── services/      # Business logic (Auth, Products, Courses)
│   ├── store/         # Redux slices and middleware
│   └── styles/        # Tailwind themes & global CSS
├── public/            # Static assets
└── .env               # Secrets & configurations
```

---

## 🚀 Installation & Environment

### Prerequisites
- Node.js `^20.x.x` (LTS recommended)
- npm `^10.x.x`

### Setup Instructions
1. **Clone & Enter**:
   ```bash
   git clone https://github.com/your-username/technavyug-frontend.git
   cd technavyug-frontend
   ```

2. **Install**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment**:
   Create a `.env` in the root and add:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   VITE_APP_NAME=TechNavyug
   VITE_STRIPE_KEY=your_stripe_public_key
   ```

4. **Dev Run**:
   ```bash
   npm run dev
   ```

---

## 🔐 Performance & Security

- **Route Splitting**: All major portals are lazy-loaded to reduce initial bundle size.
- **JWT Persistence**: Securely stored and handled via HTTP-only cookies and Redux sync.
- **Tree-Shaking**: Optimized Lucide icons and Tailwind 4 minimize CSS and JS overhead.
- **Error Boundaries**: Granular error handling for components to prevent site-wide crashes.

---

## 🤝 Contributing

We value code quality and consistency. Please follow these steps:
1. **Check Linting**: `npm run lint`
2. **Branching**: `feature/your-feature` or `fix/your-fix`
3. **Pull Request**: Detail your changes and include screenshots of UI modifications.

---

<div align="center">
  <p>Engineered for excellence by <b>Tech Navyug Team</b></p>
  <p>
    <a href="https://github.com/your-username"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Github" /></a>
    <a href="https://linkedin.com/in/technavyug"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  </p>
  <p>© 2026 Tech Navyug. All rights reserved.</p>
</div>
