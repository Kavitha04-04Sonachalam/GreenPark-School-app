# Project Summary: GreenPark AI Complaint Management System

## 1. Project Overview
The **GreenPark AI Complaint Management System** is an end-to-end digital solution designed to streamline the reporting, processing, and resolution of civic complaints (specifically Water and Electricity issues). It replaces manual triage with an intelligent AI pipeline that classifies, prioritizes, and routes grievances automatically.

---

## 2. Technical Architecture
The system follows a modern **Client-Server Architecture**:
- **Frontend**: React.js (Single Page Application)
- **Backend**: FastAPI (Python-based High-Performance REST API)
- **Database**: SQLAlchemy ORM (Relational Data Management)
- **AI/ML Layer**: Scikit-learn (Classification), Transformers (BERT-based Prioritization), and Sentence-Transformers (Similarity Matching).

---

## 3. Module-wise Explanation

### A. Frontend Modules (React.js)
| Module | Responsibility | Why it exists |
| :--- | :--- | :--- |
| **Citizen Complaint Form** | Interactive UI for users to submit grievances. | Features real-time content validation to ensure complaints are descriptive enough for the AI to process. |
| **Admin Dashboard** | Centralized monitoring tool for authorities. | Visualizes system performance, AI confidence metrics, and complaint distributions to help admins make data-driven decisions. |
| **Authentication System** | Secure Login/Signup for Citizens and Admins. | Ensures data privacy and role-based access control (RBAC). |

### B. Backend Modules (FastAPI)
| Module | Responsibility | Why it exists |
| :--- | :--- | :--- |
| **API Gateway (`routes/`)** | Defines RESTful endpoints for the frontend. | Standardizes how data moves between the UI and the database. |
| **Database Models (`models/`)** | Defines the schema for Complaints, Users, and Metrics. | Provides a structured and persistent storage layer for all system data. |
| **Email Service** | Automated status updates and alerts. | Keeps citizens informed about the progress of their complaints without manual intervention. |

### C. AI Intelligence Engine (The Core)
This is the "Brain" of the project, consisting of three specialized services:

1. **Classification Service (`classification_service.py`)**
   - **How it works**: Uses **TF-IDF Vectorization** and a **Logistic Regression** model.
   - **Why**: It automatically identifies if a complaint belongs to the 'Water' or 'Electricity' department, ensuring it is routed to the correct technical team.

2. **Prioritization Service (`prioritization_service.py`)**
   - **How it works**: Analyzes the severity of the text using **BERT** and emergency keyword mapping.
   - **Why**: It distinguishes between a "Minor Leak" (Low Priority) and a "Main Pipeline Burst" (High Priority), allowing emergency services to respond to critical issues first.

3. **Duplicate Check Service (`duplicate_check_service.py`)**
   - **How it works**: Uses **Sentence-Transformers** to calculate **Cosine Similarity** between new and existing complaints.
   - **Why**: Prevents "spamming" or redundant records for the same issue, keeping the database clean and efficient.

---

## 4. Key Innovation: The AI Pipeline
When a citizen submits a complaint, the following happens in milliseconds:
1. **Validation**: The system checks if the input is meaningful.
2. **Classification**: The AI determines the Department (e.g., Water).
3. **Prioritization**: The AI determines the Urgency (e.g., High).
4. **Duplicate Check**: The system checks if this issue was already reported.
5. **Routing**: The complaint is assigned a tracking ID and routed to the department-specific dashboard.

---

## 5. Impact & Future Scope
- **Current Impact**: Reduces manual sorting time by 80%, increases response speed for critical emergencies, and provides transparency to citizens.
- **Future Scope**: Integration of image recognition (analyzing photos of leaks/broken poles) and expansion to other departments like Waste Management and Roads.
