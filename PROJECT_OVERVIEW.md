# Smart Tax BD Client - Project Overview

## 📌 Project Description
The main user-facing web application for Smart Tax BD. This platform allows users to manage their tax filings, upload documents, and track their tax status.

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **State Management**: Redux Toolkit (RTK Query for API calls)
- **UI Components**: Radix UI (Primitives), Lucide React (Icons)
- **Forms**: React Hook Form with Zod validation
- **Data Tables**: @tanstack/react-table
- **Real-time**: Socket.io Client

## 📂 Key Directory Structure
- `app/`: Next.js App Router routes.
  - `(public)/`: Publicly accessible routes (Login, Register, etc.).
  - `(private)/`: Routes requiring authentication (Dashboard, Profile, etc.).
- `components/`: UI components.
  - `ui/`: Base UI components (Buttons, Inputs, etc., likely from Shadcn UI).
  - `layouts/`: Shared layout components.
- `redux/`: Redux store configuration.
  - `api/`: RTK Query service definitions.
  - `features/`: Redux slices for global state.
- `hooks/`: Custom React hooks.
  - `useAuth.ts`: Auth state management.
- `lib/`: Third-party library configurations and utility functions.
- `types/`: Global TypeScript interfaces and types.
- `helpers/`: Formatting and helper functions.

## 🚀 Key Features
- **User Authentication**: Secure login and registration.
- **Tax Filing Workflow**: Multi-step forms for tax data submission.
- **Document Management**: Uploading and viewing tax-related documents.
- **Dashboard**: Overview of tax status and updates.
- **Real-time Updates**: Live notifications via WebSockets.

## 📜 Available Commands
- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint for code quality checks.

## 📝 Important Notes for AI Agents
- The project uses Next.js App Router. Be mindful of Server vs. Client components.
- State management and API interactions are handled via Redux and RTK Query.
- Styling is predominantly done via Tailwind CSS classes.
- Form validation is enforced using Zod schemas.
