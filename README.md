# TaskMaster - SaaS Dashboard

A comprehensive SaaS dashboard application with user authentication, task management, real-time messaging, and admin controls. Built with React and Supabase.

---

## 🛠️ Tech Stack

```
Frontend Framework     : React JS (v19.2.0)
Router                : React Router v6 (v7.12.0)
Backend & Database    : Supabase (PostgreSQL)
State Management      : React Context API
Build Tool            : Vite (v7.2.4)
Package Manager       : npm
Styling               : CSS3
Deployment            : GitHub Pages
```
---

## ✨ Features

### User Features
- 🔐 Secure authentication with email and password
- 👤 Can see and edit his profile
- 📝 Can view tasks given to them by admin and change its status
- 💬 Real-time messaging with admins

### Admin Features
- ✅ Task creation and user assignment
- 💬 Admin messaging system with user conversations
- 📈 Real-time task monitoring and status tracking
- 👥 User management capabilities

### Technical Features
- 🔒 Role-based access control (User/Admin)
- 🔄 Real-time data synchronization via Supabase subscriptions
- 🛡️ Row-level security (RLS) policies for data protection
- 🎨 Responsive UI design
- ⚡ Fast build and deployment with Vite

---

## 📐 Project Planning & Architecture

### Step 1: Planning the Application

Before writing any code, we planned the complete application structure:

**Questions We Asked Ourselves:**
1. What features do we want to build?
2. Who are the users? (Regular users vs Administrators)
3. How many different pages/routes do we need?
4. What data will we store and how?
5. How will users authenticate and get authorized?
6. How will real-time communication work?

**Result of Planning:**
- **Public Pages:** Landing, Login, Register, Not Found.
- **Admin Pages:** TaskMonitor, CreateTask, AdminMessages.
- **User Pages:** Messages, Profile, Tasks.
- **Data Models:** Profiles, Tasks, Messages.
- **Authentication:** Email/password via Supabase Auth and email confirmation
- **Authorization:** Role-based routing (User vs Admin)

---

### Step 2: Folder Structure

We organized the project with a clear, scalable folder structure:

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminTopbar.jsx
│   ├── common/
│   │   ├── DashboardLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   ├── Toast.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ProtectedAdminRoute.jsx
│   └── charts/
│       └── [Chart components]
│
├── pages/
│   ├── admin/
│   │   ├── CreateTask.jsx
│   │   ├── AdminMessages.jsx
│   │   ├── TaskMonitor.jsx
│   ├── public/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── user/
│   │   ├── Profile.jsx
│   │   ├── Tasks.jsx
│   │   ├── Messages.jsx
│   └── NotFound.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── ToastContext.jsx
│   └── AvatarContext.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── services/
│   └── supabaseClient.js
│
├── hooks/
│   └── UseAuth.js
│
├── utils/
│   ├── RoleCheck.js
│   └── [Utility functions]
│
├── styles/
│   ├── globals.css
│   └── [Component styles]
│
├── App.jsx
├── main.jsx
└── index.css
```

**Folder Explanation:**
- **components/:** Reusable UI components organized by feature area
- **pages/:** Full page components for different routes
- **context/:** Global state management using React Context API
- **routes/:** Centralized routing configuration
- **services/:** Backend integration (Supabase client)
- **hooks/:** Custom React hooks for logic reuse
- **utils/:** Helper functions and utilities
- **styles/:** Global and component-specific CSS

---

### Step 4: Implementation Strategy

The implementation followed this sequence:
1. Set up project with Vite and React
2. Install and configure dependencies
3. Create folder structure
4. Build page components (UI first)
5. Set up Supabase backend and database
6. Implement authentication & authorization
7. Add real-time features with Context API
8. Create Toast notification system
9. Integrate all features together
10. Deploy to GitHub Pages

---

## 🔐 Authentication & Authorization System

Authentication and authorization are the most critical parts of any SaaS application. Here's how it work at the backend:

    When a user register with his proper credentials, an email is sent to user's email address for confirmation that the user is valid. At the same time, the user information is also saved at supabase auth.user but it is not stored in profiles table. when the user visit his email address and confirm the email, then user's profile will add in the profiles table and user redirects to the landing page of TaskMaster. Then the user login with his email and password and then he successfully redirects to his user portal.

### Why Supabase Auth?

Supabase provides:
- Built-in email/password authentication
- Secure JWT token management
- Session persistence
- Easy integration with PostgreSQL
- Row-level security policies
- Free tier with generous limits

### Authentication Flow

```
User Register (Email/Password)
    ↓
Supabase store data in Auth.signUp() and Sent Email to User
    ↓
User Confirm Email (Then redirect to Landing Page)
    ↓
User Login (Email/Password)
    ↓
Supabase validates credentials
    ↓
Returns JWT token & session
    ↓
AuthContext stores token & user data
    ↓
User redirected to dashboard (role-based)
```

### AuthContext - The Heart of Authentication

**File:** `src/context/AuthContext.jsx`

The AuthContext manages:
- Current authenticated user
- User role (User/Admin)
- Loading states
- Login/logout functions
- Session persistence



### Authorization - Role-Based Access Control

**File:** `src/utils/RoleCheck.js`

Authorization ensures users can only access pages meant for their role:

```javascript
// Get user's role from metadata
export const getUserRole = (user) => {
  return user?.user_metadata?.role || "user";
};

// Check if user has specific role
export const hasRole = (user, role) => {
  return getUserRole(user) === role;
};

// Check if user is admin
export const isAdmin = (user) => {
  return hasRole(user, "admin");
};
```

### Protected Routes

**File:** `src/components/common/ProtectedRoute.jsx`

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  
  // If not authenticated, redirect to login
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}
```
### ProtectedAdmin Routes

**File:** `src/components/common/ProtectedAdminRoute.jsx`

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAdmin } from "../../utils/RoleCheck";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  
  // If not authenticated, redirect to login
  if (!user) return <Navigate to="/login" replace />;
  
  // If not admin, redirect to user dashboard
  if (!isAdmin(user)) return <Navigate to="/dashboard" replace />;
  
  return children;
}
```
---

## 🔔 Toast Context - User Notifications

Toast notifications provide immediate feedback to users about their actions.

**File:** `src/context/ToastContext.jsx`

The ToastContext manages:
- Toast message queue
- Toast type (success, error, info, warning)
- Auto-dismiss timers
- Toast display logic


**Using Toast in Components:**

```jsx
const { showToast } = useToast();

// Success notification
showToast("Task created successfully!", "success");

// Error notification
showToast("Failed to create task", "error");

// Info notification
showToast("Loading data...", "info");

// Custom duration
showToast("Quick notification", "warning", 2000);
```

---

## 🗄️ Supabase Backend & Database

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Real-time subscriptions
- Authentication
- Row-level security
- REST & GraphQL APIs

### Why Supabase?

1. **Free Tier:** Generous free plan with 500MB storage
2. **Easy Setup:** No complex backend coding needed
3. **Real-time:** Built-in WebSocket subscriptions
4. **Security:** Row-level security (RLS) policies
5. **PostgreSQL:** Powerful relational database
6. **Community:** Great documentation and support

### Database Schema

**profiles table**
**Messages table**
**Tasks table**


### Row-Level Security (RLS)

RLS policies ensure users can only access their own data:
1- Users can only read their own profile
2- Users can only see their own tasks
3- Users can only read their own messages
4- admin have full access

---

### 2. Install Required Packages

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install React Router
npm install react-router-dom

# Install Chart.js for analytics
npm install chart.js react-chartjs-2
```

### 3. Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/qasim-ai472/TaskMaster.git
cd TaskMaster

# 2. Install dependencies
npm install

# 3. Create .env file with Supabase credentials
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env

# 4. Start development server
npm run dev

# 5. Open in browser
# Navigate to http://localhost:5173
```

### Test Accounts

Create test accounts by registering through the app interface.

---

## 🌐 Deployment to GitHub Pages

### Step 1: Build the Project

```bash
npm run build
```

This creates a `docs` folder with the optimized production build.

### Step 2: Push to GitHub

```bash
git add docs
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository settings: `https://github.com/qasim-ai472/TaskMaster/settings/pages`
2. Select "Deploy from a branch"
3. Choose branch: `main`
4. Choose folder: `/docs`
5. Click Save

### Step 4: Access Your App

Your app will be live at: `https://qasim-ai472.github.io/TaskMaster/`

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📧 Contact & Support

For questions or support, contact: qasi65283@gmail.com

---

**Built with ❤️ by Qasim AI | 2026**
