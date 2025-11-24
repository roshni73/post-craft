# Post Craft

A modern, feature-rich blog post management dashboard built with React, TypeScript, and Redux Toolkit.

## 🚀 Features

- **Post Management**: Create, read, update, and delete posts with a rich text editor.
- **Optimistic UI**: Instant feedback for edit and delete operations for a snappy user experience.
- **Authentication**: Secure login and registration flow (mocked for demo).
- **Dark Mode**: Fully supported dark/light theme with persistence.
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile.
- **State Management**: Centralized state using Redux Toolkit with persistence.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Validation**: [Yup](https://github.com/jquense/yup)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/roshni73/post-craft.git
   cd post-craft
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── Components/         # Reusable UI components
├── hooks/              # Custom React hooks (usePosts, useAuth, useTheme)
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices (posts, auth, theme)
│   ├── hooks.ts        # Typed Redux hooks
│   └── store.ts        # Store setup
├── view/               # Page components (Dashboard, PostView, etc.)
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```

## 🔐 State Management

The application uses **Redux Toolkit** for efficient and scalable state management:

- **Posts Slice**: Handles fetching, creating, updating, and deleting posts. Implements optimistic updates for immediate UI feedback.
- **Auth Slice**: Manages user authentication state (user, token) and persists it to local storage.
- **Theme Slice**: Controls the application theme (light/dark) and persists user preference.

## 🎨 UI/UX Highlights

- **Custom Alert Dialogs**: Beautiful, accessible modals for destructive actions.
- **Toast Notifications**: Non-intrusive feedback for success and error states.
- **Skeleton Loading**: Polished loading states for better perceived performance.
- **Glassmorphism**: Modern design elements with backdrop blur effects.

## 📝 License

This project is licensed under the MIT License.