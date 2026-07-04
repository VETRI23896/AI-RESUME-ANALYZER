# AI Resume Analyzer (CareerPilot)

A full-stack AI-powered Resume Analyzer web application. It processes PDF resumes, extracts text, and provides AI-driven analysis using Google Gemini.

This project is configured to run **locally without Docker**, utilizing a local **MongoDB** database.

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:
1. **Java 17 Development Kit (JDK)**
2. **Apache Maven** (for building the backend)
3. **Node.js** (v18 or higher) & **npm** (for the frontend)
4. **MongoDB Community Edition** (running locally on the default port `27017`)
5. A **Gemini API Key** from Google AI Studio

---

## Getting Started

### 1. Start MongoDB
Ensure MongoDB is running locally. By default, the backend expects MongoDB to be accessible at:
```
mongodb://localhost:27017/careerpilot
```
If you are running MongoDB on Windows, you can start the service from the Services panel (`services.msc`) or via the Command Prompt/PowerShell if added to your PATH:
```powershell
net start MongoDB
```

### 2. Set Up the Gemini API Key
The application integrates with Gemini AI and requires a valid API key. Set this as an environment variable in your terminal session before starting the backend.

**On Windows (Command Prompt):**
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
```

**On Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
```

**On Linux / macOS:**
```bash
export GEMINI_API_KEY="your_actual_api_key_here"
```

---

## Running the Application

### 1. Run the Backend (Spring Boot)
Open a new terminal/command prompt, navigate to the `backend` directory, and run the Spring Boot application using Maven:

```bash
cd backend
mvn spring-boot:run
```
The backend will compile and start on [http://localhost:8080](http://localhost:8080).

### 2. Run the Frontend (React + Vite)
Open another terminal/command prompt, navigate to the `frontend` directory, install the dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```
The frontend will start on [http://localhost:5173](http://localhost:5173).

---

## Configuration & Ports

- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
- **MongoDB Connection**: `mongodb://localhost:27017/careerpilot`
