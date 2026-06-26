# PromptBase Sandbox: Frontend UI Client

This directory contains the Vite React frontend client for **PromptBase Sandbox**, an interactive database data playground where natural language prompts compile to live MongoDB/Mongoose operations.

For setup instructions and system architecture designs of the complete monorepo, please refer to the primary repository documentation:
👉 **[Main Project README](../README.md)**

---

## 🛠️ Frontend Features
- **Responsive Navigation**: Left sidebar page tabs ("About Project", "Sandbox") that slide open as responsive drawers on mobile viewports.
- **AI Chatbot Drawer**: Overlay assistant drawer triggered by a bottom-right glowing Floating Action Button (FAB) on small screens.
- **Active Query Banners**: Custom filter status rows allowing users to view, search, and clear AI query filters.
- **Dual CRUD Operations**: Modals to perform inline direct mutations on student documents.
- **Real-Time Metrics Grid**: Header statistics tracking total student counts, present/absent today ratios, and attendance rate bars.

## 🚀 Running the Client
Install node modules:
```bash
npm install
```

Launch the Vite React client local development server:
```bash
npm run dev
```
The client will run on `http://localhost:5173`.
