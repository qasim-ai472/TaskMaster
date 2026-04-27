import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function TaskMonitor() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Load all tasks created by this admin
  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      try {
        setLoading(true);

        // Get all tasks from the system
        const { data, error } = await supabase
          .from("tasks")
          .select(
            `
            id,
            title,
            description,
            status,
            due_date,
            created_at,
            assigned_to,
            profiles!tasks_assigned_to_fkey(id, full_name, role)
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading tasks:", error);
          showToast("Failed to load tasks", "error");
          return;
        }

        // Flatten the data to get user info easily
        const tasksWithUserInfo = (data || []).map((task) => ({
          ...task,
          assignedUser: task.profiles || {},
        }));

        setTasks(tasksWithUserInfo);
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
      .channel(`admin-tasks-all`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        async (payload) => {
          console.log("Task changed:", payload);

          if (payload.eventType === "INSERT") {
            // Fetch full task data with user info
            const { data: newTask } = await supabase
              .from("tasks")
              .select(
                `
                id,
                title,
                description,
                status,
                due_date,
                created_at,
                assigned_to,
                profiles!tasks_assigned_to_fkey(id, full_name, role)
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (newTask) {
              setTasks((prev) => [
                {
                  ...newTask,
                  assignedUser: newTask.profiles || {},
                },
                ...prev,
              ]);
            }
          } else if (payload.eventType === "UPDATE") {
            // Fetch updated task data with user info
            const { data: updatedTask } = await supabase
              .from("tasks")
              .select(
                `
                id,
                title,
                description,
                status,
                due_date,
                created_at,
                assigned_to,
                profiles!tasks_assigned_to_fkey(id, full_name, role)
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (updatedTask) {
              setTasks((prev) =>
                prev.map((t) =>
                  t.id === updatedTask.id
                    ? {
                        ...updatedTask,
                        assignedUser: updatedTask.profiles || {},
                      }
                    : t
                )
              );
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
  }, []);

  // Filter tasks based on status
  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  // Get status counts
  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { bg: "var(--success)", text: "#ffffff" };
      case "in_progress":
        return { bg: "var(--primary)", text: "#ffffff" };
      case "pending":
        return { bg: "#f59e0b", text: "#ffffff" };
      default:
        return { bg: "var(--border)", text: "var(--text-main)" };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "30px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading tasks...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: "30px" }}>
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>
            Task Monitor
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0" }}>
            Monitor all tasks and their status in real-time
          </p>
        </div>

        {/* Status Filter Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
            marginBottom: "30px",
          }}
        >
          {[
            { key: "all", label: "All Tasks", icon: "📋" },
            { key: "pending", label: "Pending", icon: "⏳" },
            { key: "in_progress", label: "In Progress", icon: "⚙️" },
            { key: "completed", label: "Completed", icon: "✅" },
          ].map((filter) => (
            <div
              key={filter.key}
              onClick={() => setFilterStatus(filter.key)}
              style={{
                padding: "16px",
                background:
                  filterStatus === filter.key
                    ? "var(--primary)"
                    : "var(--bg-card)",
                border: `2px solid ${
                  filterStatus === filter.key ? "var(--primary)" : "var(--border)"
                }`,
                borderRadius: "12px",
                cursor: "pointer",
                transition: "0.2s",
                color:
                  filterStatus === filter.key ? "#ffffff" : "var(--text-main)",
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== filter.key) {
                  e.currentTarget.style.borderColor = "var(--primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== filter.key) {
                  e.currentTarget.style.borderColor = "var(--border)";
                }
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                {filter.icon}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600" }}>
                {filter.label}
              </div>
              <div style={{ fontSize: "20px", fontWeight: "700", marginTop: "4px" }}>
                {statusCounts[filter.key]}
              </div>
            </div>
          ))}
        </div>

        {/* Tasks List */}
        <div>
          {filteredTasks.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                background: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-muted)",
                  margin: "0",
                }}
              >
                No tasks found
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "20px",
                    transition: "0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr 1fr",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    {/* Task Title */}
                    <div>
                      <h3
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          margin: "0 0 4px 0",
                          color: "var(--text-main)",
                        }}
                      >
                        {task.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          margin: "0",
                        }}
                      >
                        {task.description?.substring(0, 50)}
                        {task.description?.length > 50 ? "..." : ""}
                      </p>
                    </div>

                    {/* Assigned To */}
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          margin: "0 0 4px 0",
                        }}
                      >
                        Assigned To
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          margin: "0",
                          color: "var(--text-main)",
                        }}
                      >
                        {task.assignedUser?.full_name || "Unknown"}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          margin: "0 0 4px 0",
                        }}
                      >
                        Status
                      </p>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: getStatusColor(task.status).bg,
                          color: getStatusColor(task.status).text,
                          textTransform: "capitalize",
                        }}
                      >
                        {task.status?.replace("_", " ")}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          margin: "0 0 4px 0",
                        }}
                      >
                        Due Date
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          margin: "0",
                          color: "var(--text-main)",
                        }}
                      >
                        {formatDate(task.due_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default TaskMonitor;
