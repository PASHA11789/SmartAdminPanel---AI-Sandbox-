# PromptBase Sandbox: AI-Augmented Student Database Playground

An interactive, full-stack MERN database sandbox designed to study **Natural Language Interfaces to Databases (NLIDB)**. The application allows users to query, create, update, and delete mock student records using natural language prompts processed via a Groq-hosted Llama-3 model. It is designed to expose the dynamic Mongoose execution queries and metrics directly to the user for research and sandboxing purposes.

---

## 🌟 Key Features

- **Dual Execution Sandbox**: 
  - Direct manual CRUD operations (Forms to Add, Edit, and Delete records).
  - Natural Language chatbot interface (e.g. *"Deduct $50 from everyone's balance"* or *"Who is present today?"*).
- **AI Query Conditional Rendering**: 
  - Highlight and isolate student records matching chatbot search queries (e.g. *"get all the students who are in class 10 and have balance less 100"*).
  - Displays an active filter banner to quickly review the query criteria and clear search query filters.
- **Mongoose Transaction Console**:
  - Live console-style log outputs detailing the compiled backend query filters, MongoDB update operators (such as `$inc`), targeted collections, and the exact Mongoose JS query code.
- **Isolated Sandbox State**:
  - A prominent one-click "Reset Sandbox Data" button that wipes all playground mutations and reseeds the MongoDB collection back to default dummy student records.
- **Fully Responsive Theme**:
  - A responsive design featuring sidebar navigation menu drawers, sliding chatbot panel overlays, a mobile header menu, and floating action button chat toggles for tablet/mobile viewports.

---

## 🛠️ Tech Stack Blueprint

- **MongoDB Atlas**: Isolated cloud database sandbox.
- **Express.js & Node.js**: REST API server layer hosting Mongoose configurations, routes, and Groq LLM integration.
- **React.js & Vite**: Frontend user client featuring Tailwind CSS, responsive overlay navigations, and live stats widgets.
- **Llama 3 (via Groq API)**: High-speed 70B model parsing user natural language requests into structured MongoDB query parameters.

---

## ⚙️ Translation Lifecycle

```
[ User Text Prompt ]
         │
         ▼
[ Groq JSON Parser ]  ──►  Compiles prompt to MongoDB Query & payload parameters
         │
         ▼
[ Mongoose Driver ]   ──►  Runs live database models (e.g. Student.updateMany)
         │
         ▼
[ Client UI & Log ]   ──►  Refreshes table data grid & renders equivalent Mongoose JS code
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB Database URI** (Atlas or local)
- **Groq API Key** (Get one at [console.groq.com](https://console.groq.com/))

### 2. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```bash
cd backend
npm install
```
Add the following credentials to your `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/SmartAdminDashboard?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_actual_groq_api_key_goes_here
```

Seed the initial sandbox student database:
```bash
npm run seed
```

Start the backend Express server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Configuration
Navigate to the `frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

Start the Vite React client dev server:
```bash
npm run dev
```
The application will open on `http://localhost:5173`.

---

## 👥 Authorship & Credentials
- **Lead Developer**: Shujaat Ali Hashim (Sandbox Admin)
- **Project Scope**: MERN + Groq LLM Interface Prototype
- **License**: MIT
