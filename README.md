# 🚀 Viw - Enterprise Multi-Tenant Agile Workspace

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

Viw is a high-performance, real-time Kanban and project management SaaS application inspired by Jira. Built with a focus on perceived performance and strict data isolation, it allows cross-functional teams to collaborate seamlessly within secure, isolated workspaces.

[Live Demo](https://viw-psi.vercel.app/login) 


[Report Bug](https://github.com/RIVINDUSANJULA/viw/issues) • [Request Feature](https://github.com/RIVINDUSANJULA/viw/issues)

---

## ✨ Core Features

* **Multi-Tenant Architecture:** Complete data isolation utilizing PostgreSQL Row-Level Security (RLS). Users can seamlessly switch between multiple shared workspaces without data bleed.
* **Optimistic UI Drag-and-Drop:** Achieves a 0ms perceived latency. State updates are applied instantly on the client side while asynchronously syncing with the backend, reverting automatically upon network failure.
* **Real-Time Synchronization:** Powered by Supabase WebSockets. Task movements, assignments, and updates are instantly broadcasted to all active team members in the workspace.
* **Isolated Cloud Storage:** Integrated task attachments using Supabase Storage (AWS S3). Includes automatic garbage collection—deleting a task instantly orchestrates the deletion of all associated cloud files to prevent orphaned data.
* **Secure Collaboration:** Backend RPC-powered email invitations allow users to securely invite existing members to their workspaces without exposing the global user directory.
* **Context-Driven Theming:** Seamless Dark/Light mode implemented via React Context API and CSS variables for instant, flash-free toggling.

## 🏗️ System Architecture & Engineering Decisions

### 1. The Multi-Tenant Engine
To support a SaaS model where one user belongs to multiple companies, the database utilizes a `tenant_users` junction table. **Row-Level Security (RLS)** is strictly enforced at the Postgres level. The API cannot physically query or mutate a task unless the authenticated user's ID exists in the junction table mapped to the requested `tenant_id`.

### 2. Task-Specific File Library Algorithm
File attachments are scoped to specific tasks using a highly efficient naming convention (`[taskId]___[filename.ext]`). 
* **Read:** The frontend uses Supabase's native `list()` API with a search parameter scoped to the `taskId`, ensuring the "File Library" modal only fetches relevant blobs.
* **Delete:** When a task is destroyed, an API interceptor queries the bucket, batches all matched files into an array, and issues a single `remove()` command before deleting the database row, ensuring zero cloud-storage leakage.

### 3. State Management
Prop-drilling is minimized by leveraging the **React Context API** for global states (`AuthContext`, `TenantContext`, `ThemeContext`). Highly localized states (like drag coordinates and loading spinners) are kept at the component level to prevent unnecessary app-wide re-renders.

---

## 💻 Tech Stack

**Frontend Framework:** React 18 (Vite)
**Language:** TypeScript
**Styling:** Tailwind CSS + Custom CSS Variables for Theming
**Backend / BaaS:** Supabase
**Database:** PostgreSQL (with heavily customized RLS policies & RPC Functions)
**Hosting:** Vercel

---

## 🚀 Getting Started for Development

To run this project locally, follow these steps:

### Prerequisites
* Node.js (v18+)
* npm or yarn
* A Supabase Project

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/RIVINDUSANJULA/viw.git](https://github.com/RIVINDUSANJULA/viw.git)
    cd viw
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

    CONTACT ME
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```

---

## 🗄️ Database Schema Summary

The application runs on a highly normalized PostgreSQL schema:
* `tenants`: Workspaces/Companies.
* `tenant_users`: Junction table managing RBAC (Roles) and Workspace assignments.
* `projects`: Boards within a workspace.
* `board_columns`: Status columns mapping to projects.
* `tasks`: The core ticket entity, holding foreign keys to `tenants`, `columns`, and an `assignee_id` referencing the `auth.users` table.

---

## 👤 Author

**Rivindu Sanjula**
* GitHub: [@RIVINDUSANJULA](https://github.com/RIVINDUSANJULA)
* GitHub: [@gagana-Perera](http://github.com/gagana-Perera/)
