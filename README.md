# 🔧 DragSense — Build Anything. Without Code.

Welcome to **DragSense**, a powerful and dynamic platform to build structured applications, dashboards, CRMs, websites, and apps — without writing a single line of backend code.

Designed to be **modular, extensible, and blueprint-driven**, DragSense empowers users to define data, logic, roles, UI, and behavior dynamically.

---

## 🌟 Key Features

- ✨ **WSBlueprint Engine** — Define entities, relationships, permissions, and behaviors as reusable templates.
- 🧱 **Dynamic UI System** — Build forms, tables, dashboards, and even websites from blueprints.
- 🧑‍💼 **Role-Based Access Control** — Fine-grained permissions at every level.
- 🧠 **Custom Workspaces** — Organizations can manage their own resources, users, and flows.
- 🔄 **Realtime Collaboration (coming soon)** — Work with your team on tasks, projects, and layouts.
- 🧩 **Composable Architecture** — Add projects, operations, tasks, and more — dynamically.
- 🎨 **Theming & Branding** — Each project can have its own theme, logo, posts, ads, and web presence.

---

## 🚀 Quick Overview

### 1. Super Admin Signup
- First user becomes a **super admin**.
- Can manage global settings, users, permissions, and system-wide logs.

### 2. Workspaces (Companies / Organizations)
- Each workspace is fully isolated.
- Can invite users, manage assets, assign roles, and create blueprints.

### 3. Resources
- Each workspace can have:
  - Users
  - Images
  - Videos
  - Documents
  - Custom data via blueprints

### 4. Projects
- Workspaces can create **projects** which can contain:
  - Tasks, logs, events
  - Project-specific users and permissions
  - WSBlueprint-based data structures
  - Websites and apps

### 5. WSBlueprint System
- Define your own:
  - Entities (e.g. Gallery, Team, Product)
  - Relationships (e.g. one-to-one, many-to-many)
  - Fields (text, file, date, reference, etc.)
  - Validations and custom queries

### 6. Permissions
- Permissions are **system-managed**.
- Roles are blueprint-driven (e.g. "Project Manager", "Designer").
- Assign granular access to fields, actions, or resources.

---

## 🏗️ Tech Stack

| Layer     | Technology                 |
|-----------|----------------------------|
| Frontend  | React, Vite, TailwindCSS, ShadCN UI, Zustand |
| Backend   | NestJS, TypeORM, PostgreSQL + MongoDB (hybrid) |
| Realtime  | Socket.IO        |
| Auth      | JWT + Role/Scope Based     |
| Forms     | React Hook Form + Zod      |
| Drag/Drop | DND Kit |

---
# crm
