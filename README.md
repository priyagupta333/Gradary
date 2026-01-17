# Gradary - Academic Diary & Engineering Planner

**Gradary** is a web-based academic management tool designed specifically for engineering students to organize their workload, track assignments, and maintain focus. It combines task management with academic analytics to help students stay on top of their semester goals.

---

## 🚀 Key Features

### 1. 📊 Interactive Dashboard
The central hub of the application provides an at-a-glance view of your academic status:
*   **Real-time Statistics:** Instant counters for Total Tasks, Completed Tasks, and Pending Tasks.
*   **Visual Analytics:**
    *   **Task Distribution Chart:** A doughnut chart showing the breakdown of your work (Assignments, Labs, Projects, Exams).
    *   **Progress Chart:** A pie chart visualizing your completion rate.
*   **Priority Focus:** Automatically highlights the top 3 most urgent tasks sorted by due date so you know exactly what to work on next.
*   **Goal Tracker:** Displays your current semester CGPA target.

### 2. ✅ Smart Task Manager
A powerful system to manage all academic obligations:
*   **Categorized Tasks:** Add tasks with specific types:
    *   📖 *Assignment*
    *   🧪 *Lab Record*
    *   📝 *Exam Prep*
    *   💻 *Project*
*   **Urgency Detection:** The system automatically calculates urgency based on the due date:
    *   🔴 **High Priority:** 2 days or less remaining.
    *   🟠 **Medium Priority:** 5 days or less remaining.
    *   🟢 **Low Priority:** More than 5 days remaining.
*   **Task Lifecycle:** easily mark tasks as completed, undo completion, or delete them permanently.

### 3. 📚 Subject Workload Tracker
An intelligent view that reorganizes your task list into subject-specific performance cards:
*   **Automated Organization:** No manual setup required—cards are created automatically based on the subjects you enter in your tasks.
*   **Workload Indicators:** Badges indicating if a subject has a "High", "Medium", or "Low" pending workload.
*   **Progress Bars:** Visual percentage bars showing how much of the work for that specific subject is complete.

### 4. ⏱️ Focus Mode (Pomodoro Timer)
A built-in distraction-free environment to help you study effectively:
*   **Multiple Modes:**
    *   **Pomodoro:** Standard 25-minute focus session.
    *   **Deep Dive:** Extended 50-minute intense study session.
    *   **Short Break:** 5-minute recovery period.
*   **Features:** Play, Pause, and Reset controls with a dynamic browser tab title that updates the timer in real-time.

### 5. 🎯 Goal Setting
*   **Academic Targets:** Set and save your target CGPA for the semester.
*   **Motivation:** Includes a section with academic motivation to keep you inspired.

### 6. 🔐 Local Session Management
*   **Data Persistence:** All data (tasks, goals, user session) is saved locally in your browser's `LocalStorage`, meaning your data persists even if you refresh or close the browser.
*   **Simple Authentication:** Basic login simulation (User name retrieval) for a personalized experience.

---

## 🛠️ Technical Stack

*   **Frontend Structure:** HTML5 (Semantic)
*   **Styling:** CSS3 (Modern features including CSS Variables `var(--)`, Flexbox, and CSS Grid).
*   **Scripting:** Vanilla JavaScript (ES6+ Modules)
*   **Libraries:** 
    *   [Chart.js](https://www.chartjs.org/) - For dashboard analytics charts.
    *   [FontAwesome](https://fontawesome.com/) - For UI icons.
    *   [Google Fonts](https://fonts.google.com/) - Using the 'Inter' typeface.

---

## 📂 Project Structure

```text
Gradary/
├── index.html        # Landing & Login Page
├── dashboard.html    # Main Analytics Dashboard
├── tasks.html        # Task Management Interface
├── subjects.html     # Subject Workload Overview
├── focus.html        # Focus Timer Page
├── goals.html        # Goal Setting Page
├── about.html        # About Page
├── css/
│   ├── style.css     # Main Application Styles
│   └── variables.css # Global Color Themes & Variables
├── js/
│   ├── app.js        # Main Application Controller (Router & Logic)
│   ├── storage.js    # LocalStorage CRUD Wrapper
│   ├── ui.js         # Shared UI Components (Navbar, Empty States)
│   └── utils.js      # Utilities (Date formatting, ID generation)
└── images/           # Backgrounds and Assets


🎨 Design System
The application uses a clean, minimal "Cream & Black" aesthetic with color-coded alerts:

Backgrounds: Cream (#E9E6DD) and White (#FDFCFB)
Text: Primary Black (#18181b) and Dark Grey (#404040)
Status Colors:
Success/Low Urgency: Emerald Green
Warning/Medium Urgency: Amber Orange
Danger/High Urgency: Red
🚀 How to Run
Download the project folder.
Open the Gradary folder.
Run index.html in your web browser.
Tip: For the best experience, use a local server (like VS Code's "Live Server" extension) to ensure JavaScript modules load correctly without CORS errors.
🔮 Future Scope
Backend integration for cloud data storage.
Calendar view integration.
Notifications for upcoming deadlines.
CGPA Calculator based on credit points.
