markdown_content = """# Software Requirements Specification (SRS)

**Project Name:** TaskFlow (Placeholder)
**Tech Stack:** React/Next.js (Frontend), Firebase (Auth & Database), Node.js (Optional Backend/Cloud Functions)

## 1. Purpose & Scope
The application is a web-based collaborative task management platform designed to allow users to create, assign, monitor, and follow up on tasks. It provides real-time updates and advanced visualization tools (Kanban, Gantt charts) so teams or individuals can track project progress seamlessly and export data for reporting.

## 2. User Roles
* **Manager (Assigner / Admin):** Can create tasks, assign them to others, edit all task details, view full dashboards, export reports, and monitor overall progress.
* **Assignee (Worker):** Can view their specifically assigned tasks, update task statuses, and add follow-up comments or notes.

## 3. Functional Requirements

### 3.1. Authentication (Firebase Auth)
* **Sign Up/Log In:** Users must be able to register and authenticate using an Email and Password.
* **Session Management:** Secure login and logout functionality.
* **Password Management:** Password reset via email link must be available.

### 3.2. Task Creation & Assignment (Firestore)
Managers can create a new task containing the following data points:
* **Task Title**
* **Description**
* **Assignee:** Selected from a list of registered users via their email.
* **Start Date:** To indicate when work should begin (essential for timeline tracking).
* **Due Date:** Deadline for the task.
* **Priority Level:** Low, Medium, High.
* **Status:** To-Do, In Progress, Blocked, Completed.

### 3.3. Task List & Kanban Board
* **Personal List View:** Assignees see a tabular list of their assigned tasks, sortable by due date, priority, or status.
* **Manager Dashboard:** Managers see all tasks they have created or assigned, with advanced filtering options.
* **Kanban Board:** * An interactive board displaying columns for each status.
    * **Drag-and-Drop:** Users can drag a task card between columns, automatically triggering a database update to change the task's status.

### 3.4. Updating & Managing Tasks
* **Full CRUD Capabilities:** Users with correct permissions can update any aspect of a task post-creation (e.g., change assignee, adjust dates, update descriptions, alter priority).
* **Audit/History Log:** The system logs major updates (e.g., "Manager changed due date to Oct 15") to maintain a history of changes.

### 3.5. Monitoring & Follow-Up
* **Commenting System:** Users can add text-based comments or notes to a specific task to provide context, updates, or ask questions.
* **Real-time Synchronization:** UI must update instantaneously when a status is changed or a comment is added, leveraging Firestore's real-time listeners.

### 3.6. Gantt Chart Reporting
* **Timeline Visualization:** A dedicated view rendering tasks on a horizontal timeline based on their `startDate` and `dueDate`.
* **Filtering:** The chart can be filtered by Assignee, Status, or Priority.

### 3.7. Excel Export
* **Data Extraction:** Authorized users can click an "Export to Excel" button.
* **Format:** Generates and downloads a `.xlsx` or `.csv` file containing structured task data (Title, Assignee, Status, Start Date, Due Date, Priority).

## 4. Proposed Database Schema (Firestore NoSQL)

### Collection: `users`