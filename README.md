# Manitor AI

Manitor AI is an omnipotent Personal Life Operating System (OS). It combines real-time dashboards, an intelligent virtual assistant, automated task scheduling, expense tracking, and calendar synchronization into a single, beautifully designed interface.

## Features
- **Real-Time Dashboard**: Track your productivity, expenses, upcoming events, and tasks from a centralized command center.
- **Omniscient AI Assistant (MONI)**: Chat with MONI to dynamically create tasks, log expenses, save notes, and schedule reminders. The AI securely injects actions directly into your database.
- **Secure Authentication**: Robust JWT-based security layers protecting all REST APIs.
- **Automated Testing**: Fully integrated frontend and backend automated testing pipelines using Pytest and Jest.
- **Neon Glassmorphism UI**: A gorgeous Next.js and Tailwind CSS frontend built for speed and aesthetics.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Lucide Icons, Recharts, Jest
- **Backend**: FastAPI (Python), PostgreSQL, SQLAlchemy, Qdrant (Vector DB), Pytest
- **AI Integration**: Google Gemini Flash

## Quick Start

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment and install dependencies: `pip install -r requirements.txt`.
3. Create a `.env` file with your `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY`.
4. Run the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.

## License
MIT License
