import { useState, useEffect } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Topbar from "../../components/common/Topbar";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabaseClient";

function Tasks() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch tasks assigned to the current user
  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        setLoading(true);
        console.log("Fetching tasks for user:", user.id);

        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("assigned_to", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading tasks:", error);
          showToast("Failed to load tasks", "error");
          return;
        }

        console.log("Tasks loaded:", data);
        setTasks(data || []);
      } catch (err) {
        console.error("Error in loadTasks:", err);
        showToast("Error loading tasks", "error");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    // Set up real-time subscription for task updates
    const subscription = supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `assigned_to=eq.${user.id}`,
        },
        (payload) => {
          console.log("Task changed:", payload);
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new : t))
            );
            if (selectedTask && selectedTask.id === payload.new.id) {
              setSelectedTask(payload.new);
            }
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, showToast]);

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) {
        console.error("Error updating task:", error);
        showToast("Failed to update task status", "error");
        return;
      }

      showToast(`Task marked as ${newStatus} ✅`, "success");
    } catch (err) {
      console.error("Error in handleStatusChange:", err);
      showToast("Error updating task", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Get status options
  const getStatusOptions = (currentStatus) => {
    const allStatuses = ["Pending", "In Progress", "Completed"];
    return allStatuses.filter((s) => s !== currentStatus);
  };

  return (
    <DashboardLayout>
      <Topbar title="My Tasks" />

      <div style={{ padding: "24px", marginTop: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
            Tasks Assigned to You
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            View and manage tasks from your administrator
          </p>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {/* LOADING */}
          {loading && (
            <div style={cardStyle}>
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Loading tasks...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && tasks.length === 0 && (
            <div style={cardStyle}>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: "15px" }}>
                No tasks assigned yet 🚀
              </p>
            </div>
          )}

          {/* TASK CARDS */}
          {!loading &&
            tasks.map((task) => (
              <div key={task.id} style={taskCardStyle}>
                {/* HEADER - Title and Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>
                      {task.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                      📅 Deadline: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={statusBadge(task.status)}>
                    {task.status}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
                  {task.description}
                </p>

                {/* STATUS CHANGE BUTTONS */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {getStatusOptions(task.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(task.id, status)}
                      disabled={updatingStatus}
                      style={statusButtonStyle(status, updatingStatus)}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedTask(task)}
                    style={detailsButtonStyle}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* TASK DETAILS MODAL */}
      {selectedTask && (
        <div style={overlayStyle} onClick={() => setSelectedTask(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedTask(null)}
              style={closeBtnStyle}
            >
              ✕
            </button>

            {/* Title and Status */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700" }}>
                {selectedTask.title}
              </h2>
              <span style={statusBadge(selectedTask.status)}>
                {selectedTask.status}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", marginBottom: "16px" }}>
              {selectedTask.description}
            </p>

            {/* Deadline */}
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>
              📅 <strong>Deadline:</strong> {new Date(selectedTask.due_date).toLocaleDateString()}
            </p>

            <hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />

            {/* Status Change Options */}
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ fontWeight: "600", marginBottom: "10px", fontSize: "14px" }}>
                Change Status
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {getStatusOptions(selectedTask.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusChange(selectedTask.id, status);
                      setSelectedTask(null);
                    }}
                    disabled={updatingStatus}
                    style={statusButtonStyle(status, updatingStatus)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <hr style={{ margin: "16px 0", borderColor: "#e5e7eb" }} />

            {/* Footer Note */}
            <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
              💡 Update your task status as you progress. Check Messages page to communicate with admin.
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Tasks;

// ================= STYLES =================

const cardStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const taskCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  borderLeft: "4px solid #2563eb",
  transition: "box-shadow 0.2s",
};

const statusBadge = (status) => ({
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
  whiteSpace: "nowrap",
  background:
    status === "Completed"
      ? "#dcfce7"
      : status === "In Progress"
      ? "#e0e7ff"
      : "#fef3c7",
  color:
    status === "Completed"
      ? "#166534"
      : status === "In Progress"
      ? "#3730a3"
      : "#92400e",
});

const statusButtonStyle = (status, disabled) => ({
  background:
    status === "Completed"
      ? "#16a34a"
      : status === "In Progress"
      ? "#4f46e5"
      : "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "13px",
  opacity: disabled ? 0.6 : 1,
  transition: "0.2s",
});

const detailsButtonStyle = {
  background: "#0ea5e9",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "13px",
  transition: "0.2s",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  maxWidth: "600px",
  width: "90%",
  maxHeight: "80vh",
  overflowY: "auto",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "transparent",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#6b7280",
  padding: "4px 8px",
};

