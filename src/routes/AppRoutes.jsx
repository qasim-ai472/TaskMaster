import { Routes, Route } from "react-router-dom";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import Tasks from "../pages/user/Tasks";
import Profile from "../pages/user/Profile";
import Messages from "../pages/user/Messages";

import CreateTask from "../pages/admin/CreateTask";
import AdminMessages from "../pages/admin/AdminMessages";
import TaskMonitor from "../pages/admin/TaskMonitor";

import ProtectedRoute from "../components/common/ProtectedRoute";
import ProtectedAdminRoute from "../components/common/ProtectedAdminRoute";

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />


      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}

      <Route
        path="/admin/create-task"
        element={
          <ProtectedAdminRoute>
            <CreateTask />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedAdminRoute>
            <AdminMessages />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/task-monitor"
        element={
          <ProtectedAdminRoute>
            <TaskMonitor />
          </ProtectedAdminRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;


