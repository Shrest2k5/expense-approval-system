Project Decisions & Technical Assumptions

This document outlines the architectural decisions, trade-offs, and assumptions made during the development of the Expense Approval System.

1. Tech Stack Selection & Project Architecture

Monorepo Structure:

Decision: The project is organized as a monorepo containing /client (React + Vite + TypeScript + Tailwind CSS) and /server (Express.js + TypeScript + Prisma ORM + SQLite).

Rationale: Keeping both layers in one repository simplifies local execution and evaluation while maintaining a clear separation of concerns between presentation and business logic.

Database Choice (SQLite via Prisma ORM):

Decision: SQLite (dev.db) was chosen as the local database driver.

Rationale: SQLite requires zero external service setup (unlike PostgreSQL or MongoDB), allowing evaluators to clone the repository and run the application out of the box without configuring environment variables or cloud database instances.

2. Technical Assumptions & Business Logic

Authentication & User Roles:

Assumption: The task specification did not explicitly require full user authentication (OAuth/JWT/Sessions).

Decision: Implemented a client-side role toggle between the Employee Portal and Manager Dashboard. Any user can submit an expense on behalf of an employee name, and any user switching to the Manager tab can approve or reject expenses.

Status Transition Rules:

Assumption: Once an expense is marked as APPROVED or REJECTED, can its status be changed again?

Decision: Actions are permitted on items in the PENDING state. Once resolved, the action buttons are hidden to prevent accidental status overrides, though the backend API supports updating statuses dynamically.

Total Approved Expense Calculation:

Assumption: Should total approved expenses be calculated client-side or server-side?

Decision: Calculated on the backend server during the GET /api/expenses request and returned as totalApprovedAmount. This guarantees data integrity and ensures business logic remains centralized in the API layer.

Currency & Date Formatting:

Decision: Amounts are restricted to positive floating-point numbers (Float) formatted to two decimal places ($XX.XX). Dates are normalized to ISO string formats (YYYY-MM-DD).

3. Local Execution Strategy

Concurrent Execution:

Decision: Integrated concurrently and tsx in the root package.json.

Rationale: Allows running both the frontend Vite dev server and backend Express server concurrently using a single npm start command.