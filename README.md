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
Charts & Visualization: Chart.js & React-ChartJS-2
Deployment            : GitHub Pages
```

---

## 📋 Project Overview

TaskMaster is a full-stack SaaS application that enables users to:
- Create and manage tasks with status tracking
- Communicate with administrators in real-time
- View and edit their profile information
- Track task submissions and progress

Administrators can:
- Create and assign tasks to specific users
- Monitor task status across the platform
- Communicate with users in real-time
- View analytics and system statistics

---

## ✨ Features

### User Features
- 🔐 Secure authentication with email and password
- 👤 User profile management with avatar upload
- 📝 Task management (create, update, delete, track status)
- 💬 Real-time messaging with administrators
- ⚙️ User settings and preferences

### Admin Features
- 📊 Dashboard with system analytics
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
- **Data Models:** Profiles, Tasks, Message.
- **Authentication:** Email/password via Supabase Auth
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

### Step 3: Page Design

Each page was designed with a specific purpose:

**Public Pages (No Authentication Required):**
- **Landing.jsx:** Hero section, call-to-action, features overview
- **Login.jsx:** Email/password login form with role-based redirect
- **Register.jsx:** User registration with profile setup

**User Dashboard Pages:**
- **Profile.jsx:** User profile display and avatar upload
- **Tasks.jsx:** List of assigned tasks with status management
- **Messages.jsx:** Incoming messages from administrators

**Admin Dashboard Pages:**
- **CreateTask.jsx:** Form to create and assign tasks to users
- **AdminMessages.jsx:** Conversation-based messaging with users
- **TaskMonitor.jsx:** Real-time monitoring of all system tasks
- **Analytics.jsx:** Detailed system statistics and reports

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

Authentication and authorization are the most critical parts of any SaaS application. Here's how we implemented it:

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
User Input (Email/Password)
    ↓
Supabase Auth.signUp() / Auth.signIn()
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

**Key AuthContext Features:**

```javascript
// 1. User Object
{
  id: "uuid",
  email: "user@example.com",
  user_metadata: {
    full_name: "User Name",
    avatar_url: "...",
    role: "user" // or "admin"
  }
}

// 2. Context Methods
- login(email, password) - Authenticate user
- logout() - Clear session
- checkAuth() - Verify session on app load
- updateProfile() - Update user information

// 3. State Variables
- user - Current authenticated user
- loading - Loading state for auth checks
- error - Authentication errors
```

**AuthContext Implementation Details:**

```jsx
import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../services/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

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

### Authentication Flow in Login Component

When a user logs in, here's what happens:

```jsx
// src/pages/public/Login.jsx
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    // 1. Call login from AuthContext
    const authenticatedUser = await login(email, password);
    
    // 2. Check user role from metadata
    const role = authenticatedUser?.user_metadata?.role;
    
    // 3. Redirect based on role
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
    
    // 4. Show success toast
    showToast("Login successful!", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
};
```

### Session Management

Supabase automatically handles session persistence:
- JWT token stored in browser localStorage
- Token automatically sent with every API request
- Session restored on page refresh
- Automatic logout on token expiration (optional)

---

## 🔔 Toast Context - User Notifications

Toast notifications provide immediate feedback to users about their actions.

**File:** `src/context/ToastContext.jsx`

The ToastContext manages:
- Toast message queue
- Toast type (success, error, info, warning)
- Auto-dismiss timers
- Toast display logic

**Toast Implementation:**

```jsx
export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add new toast
  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  };

  // Remove specific toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      <Toast /> {/* Toast display component */}
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
```

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

**profiles table:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**tasks table:**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**messages table:**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**task_submissions table:**
```sql
CREATE TABLE task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES profiles(id),
  submission_text TEXT,
  submission_file_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);
```

### Supabase Client Setup

**File:** `src/services/supabaseClient.js`

```javascript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Row-Level Security (RLS)

RLS policies ensure users can only access their own data:

```sql
-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can only see their own tasks
CREATE POLICY "Users can read own tasks"
ON tasks
FOR SELECT
USING (assigned_to = auth.uid() OR assigned_by = auth.uid());

-- Users can only read their own messages
CREATE POLICY "Users can read own messages"
ON messages
FOR SELECT
USING (sender_id = auth.uid() OR receiver_id = auth.uid());
```

### Real-time Subscriptions

```javascript
// Subscribe to task updates
supabase
  .channel("tasks")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "tasks",
      filter: `assigned_to=eq.${userId}`,
    },
    (payload) => {
      console.log("Task update:", payload);
      // Update UI with new data
    }
  )
  .subscribe();
```

---

## 🚀 Development Workflow

### 1. Project Setup

```bash
# Create Vite project
npm create vite@latest my-app -- --template react

# Navigate to project
cd my-app

# Install dependencies
npm install
```

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

### 4. Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI framework |
| react-router-dom | 7.12.0 | Client-side routing |
| @supabase/supabase-js | 2.91.1 | Backend & auth |
| chart.js | 4.5.1 | Chart visualizations |
| vite | 7.2.4 | Build tool |

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

## 📊 Project Statistics

- **Total Pages:** 11 (3 public + 5 user + 3 admin)
- **Components:** 20+
- **Context Providers:** 3
- **Database Tables:** 4
- **API Endpoints:** 20+
- **Real-time Features:** Task updates, messaging, status tracking
- **Lines of Code:** 5000+

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

## 🙏 Acknowledgments

- **Supabase** for the amazing backend service
- **React Team** for the powerful UI library
- **Vite** for the fast build tool
- **React Router** for seamless navigation

---

**Built with ❤️ by Qasim AI | 2026**
