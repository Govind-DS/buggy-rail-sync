# Product Requirements Document (PRD): RailSync

**Project Name:** RailSync  
**Status:** MVP (Bug-Enhanced Version)  
**Objective:** A high-fidelity, premium train booking simulator designed with intentional, rule-based bugs to test the robustness of automated testing agents and AI systems (like SENTRA).

---

## 1. Executive Summary
RailSync is a modern web application that mimics a professional railway booking platform. Unlike standard applications, RailSync is engineered to be "reliably unreliable." It visually appears as a premium, state-of-the-art service but contains deterministic and erratic bugs designed to challenge automated testers.

## 2. Target Audience
*   **AI Researchers:** Testing agentic coding and debugging models.
*   **QA Engineers:** Evaluating test suite coverage for non-standard UI behaviors.
*   **Systems Architects:** Stress-testing error handling and latency resilience.

---

## 3. Product Features

### 3.1 Authentication
*   **Minimalist Login:** Side-independent login system.
*   **Pass-Through Logic:** Accepts any valid input to facilitate quick entry into the testing flow.

### 3.2 Train Discovery (Search)
*   **Regional Selection:** Support for major Indian Rail hubs (NDLS, BCT, SBC, HWH).
*   **Interactive Calendar:** Date-based search system.

### 3.3 Ticket Configuration
*   **Multi-Tier Seating:** Options for Sleeper (SL), 3AC, and 2AC with dynamic pricing.
*   **Passenger Management:** Integrated counter system with real-time UI updates for passenger names.

### 3.4 Booking Preview
*   **Digital E-Ticket:** A visual representation of the final ticket.
*   **Fare Breakdown:** Total cost calculation inclusive of seat rates and surcharges.

---

## 4. The "Bug" Ecosystem (Intentional Failures)

The core value of RailSync is its specific failure modes. These are divided into **Deterministic** (predictable) and **Erratic** (truly random).

| Feature | Bug Type | Description |
| :--- | :--- | :--- |
| **System Latency** | Deterministic | A fixed **6000ms (6s)** delay is applied to every navigation and "server" response to test timeout handling. |
| **Search Availability** | Deterministic | Searching for **"Today's"** date always returns zero results, regardless of actual availability in other segments. |
| **Passenger Count** | **Erratic** | The UI counter display is tied to `Math.random()`. Every interaction with the +/- buttons results in a random count between 1-10. |
| **Pricing Engine** | Deterministic Error | The final fare calculation includes a hidden **12.37% surcharge** and a **₹50 fee**, ensuring total sums are mathematically "wrong." |
| **Checkout** | Fatal Error | The "Confirm Booking" action always returns a **Checksum Mismatch** alert, preventing transaction completion. |

---

## 5. Technical Specifications
*   **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
*   **Build Tool:** Vite (Optimized for fast HMR and lightweight production bundles).
*   **Styling:** Modern UI kit using CSS variables, Flexbox/Grid, and Backdrop-filter (Glassmorphism).
*   **Version Control:** Hosted on GitHub with master-branch deployment.

## 6. Design Principles
1.  **Look Premium:** If it looks like a "broken" app, the user/system will expect errors. RailSync must look 10/10 to make the internal bugs deceptive and effective for testing.
2.  **Deterministic Foundations:** Except where explicitly erratic (Passenger Count), bugs should follow rules so that a testing system can eventually learn the failure patterns.
3.  **Low Dependency:** Minimize external NPM packages to ensure the project remains portable and easy to run in any environment.

---

## 7. Future Roadmap
*   **Chaos Dashboard:** A hidden admin panel to toggle specific bugs on/off.
*   **Mobile App Variant:** Responsive layout parity for mobile-testing agents.
*   **API Layer:** Exposure of the "Bug Engine" via a REST API to test backend-handling logic.
