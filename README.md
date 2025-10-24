
# VEDA-MOTRIX AI — Predictive Intelligence Hub

<p align="center">
  <img width="409" height="179" alt="image" src="https://github.com/user-attachments/assets/3de68c1e-3528-481e-ba4f-66342798eebd" />

  https://app.netlify.com/projects/vedamotrix/deploys
>
</p>

<h3 align="center">Knowledge in Motion: Transforming Vehicle Maintenance with Predictive AI</h3>

<p align="center">
  VEDA-MOTRIX AI is a sophisticated, full-stack predictive maintenance and fleet management platform. It leverages a suite of specialized, interoperable AI agents to analyze vehicle data, predict failures, streamline service operations, and provide deep business intelligence. Built with a modern tech stack including Next.js, ShadCN UI, and generative AI, this project showcases a powerful end-to-end solution for the automotive industry.
</p>

---

## Core Features

VEDA-MOTRIX AI is a multi-faceted platform designed to revolutionize vehicle maintenance and operational management through the power of artificial intelligence.

- **🧠 Simulated Data Analysis**: An AI agent analyzes mock vehicle sensor data to detect anomalies, presenting findings on a master dashboard.
- **🔮 Failure Prediction**: The AI Diagnosis Agent predicts potential component failures, assigns priority levels, and drives downstream actions for other agents.
- **🤝 Customer Engagement Simulation**: An AI agent simulates conversations (text/voice) to engage vehicle owners about issues and recommended maintenance.
- **📅 Appointment Scheduling**: The scheduling agent suggests available service slots and confirms bookings through a user-friendly UI.
- **📊 Feedback Collection & Analysis**: Post-service feedback is collected and analyzed by an AI, providing sentiment analysis and actionable insights.
- **🏭 Manufacturing Insights**: An AI agent generates improvement suggestions for Root Cause Analysis (RCA) and Corrective/Preventive Actions (CAPA) based on service data to optimize manufacturing processes.
- **🛡️ UEBA Security Monitoring**: A dedicated security agent detects and flags anomalous or unauthorized behavior from other AI agents, ensuring system integrity.

---

## ✨Technology Stack

This project leverages a modern, robust, and scalable technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Generative AI**: [GitHub Models](https://github.blog/2024-04-29-github-copilot-workspace-technical-preview/) via OpenAI SDK
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Authentication**: Custom hook-based context provider simulating user roles.

---

## 🏁 Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your GitHub Models API token:
    ```
    GITHUB_TOKEN="your_github_pat_goes_here"
    ```

### Running the Development Server

Once the installation is complete, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🔑Roles & Credentials

The application supports multiple user roles, each with a dedicated dashboard and feature set. Use the following credentials on the login page after selecting the appropriate role:

| Role             | Email                  | Password      |
| ---------------- | ---------------------- | ------------- |
| **Manager**      | `manager@vedamotrix.ai`  | `VEDA@123`    |
| **Service Center**| `service@vedamotrix.ai` | `SERVICE@123` |
| **Vehicle Owner**  | `rohan.joshi@email.com`| `password123` |

---

## Dashboards Overview

### 1. Manager Dashboard
The highest-level view, providing strategic insights across the entire operation.
- **Fleet Health Overview**: Real-time status of all monitored vehicles.
- **AI ROI Snapshot**: KPIs demonstrating the financial and operational value of the AI system.
- **Orchestration View**: Visualization of AI agent collaboration and self-healing.
- **Executive & Service Analytics**: Deep dives into business intelligence, warranty costs, and more.

### 2. Service Center Dashboard
Focused on the day-to-day operations of a maintenance workshop.
- **Appointment Kanban Board**: Drag-and-drop interface for managing service appointments.
- **Live Vehicle Queue**: Real-time tracker for vehicles currently in the service bay.
- **Technician Performance**: Skill proficiency and efficiency metrics for individual technicians.
- **Inventory & Workload Forecasting**: Predictive insights for parts management and staffing.

### 3. User (Vehicle Owner) Dashboard
A personalized portal for vehicle owners to monitor their car's health.
- **Real-Time Health Radar**: A visual breakdown of key vehicle subsystems.
- **Predictive Maintenance Alerts**: AI-powered warnings for upcoming service needs.
- **Service Scheduler**: An easy-to-use interface to book maintenance appointments.
- **AI Chatbot**: An intelligent assistant to answer any vehicle-related questions.
- **Environmental Impact**: Analytics on fuel efficiency and carbon footprint.

---

## 🤖 Key AI Agents

The intelligence of VEDA-MOTRIX is driven by a suite of specialized AI agents working in concert:

- **Data Analysis Agent**: The first line of defense, scanning sensor data for anomalies.
- **Diagnosis & Prediction Agent**: Identifies potential failures and predicts their timeline.
- **Customer Engagement Agent**: Communicates with users in a natural, helpful way.
- **Manufacturing Insights Agent**: Closes the loop by feeding service data back into the production cycle.
- **UEBA Security Agent**: The system's internal affairs, ensuring all other agents behave as expected.

This orchestration allows the platform to move from simple data reporting to a proactive, intelligent, and self-improving operational tool.
