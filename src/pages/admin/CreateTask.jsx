import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../services/supabaseClient";

function CreateTask() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_email: "",
  });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users from profiles table
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "user");

        if (error) throw error;

        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        showToast("Error loading users", "error");
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailSearch = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, assigned_email: value });

    if (value.trim()) {
      const filtered = users.filter((u) =>
        u.full_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUserDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowUserDropdown(false);
      setSelectedUser(null);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({ ...formData, assigned_email: user.full_name });
    setShowUserDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Task title is required", "error");
      return;
    }

    if (!selectedUser) {
      showToast("Please select a user to assign the task", "error");
      return;
    }

    if (!formData.due_date) {
      showToast("Due date is required", "error");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.from("tasks").insert({
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        assigned_to: selectedUser.id,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      showToast("Task created successfully ✅", "success");
      
      // Reset form to create another task
      setFormData({
        title: "",
        description: "",
        due_date: "",
        assigned_email: "",
      });
      setSelectedUser(null);
    } catch (error) {
      console.error("Error creating task:", error);
      showToast("Error creating task", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Create Task">
      <div style={{ padding: "30px", maxWidth: "600px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "24px" }}>
          Create New Task
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--bg-card)",
            padding: "24px",
            borderRadius: "14px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Task Title */}
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Task Title <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
              }}
            />
          </div>

          {/* Task Description */}
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows="4"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* Due Date */}
          <div>
            <label
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Due Date <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
              }}
            />
          </div>

          {/* Assign User */}
          <div style={{ position: "relative" }}>
            <label
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Assign To User <span style={{ color: "var(--primary)" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.assigned_email}
              onChange={handleEmailSearch}
              onFocus={() => formData.assigned_email && setShowUserDropdown(true)}
              placeholder="Search by user name..."
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
              }}
            />

            {/* User Dropdown */}
            {showUserDropdown && filteredUsers.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 100,
                  marginTop: "-8px",
                  paddingTop: "8px",
                }}
              >
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      background:
                        selectedUser?.id === user.id
                          ? "var(--primary)"
                          : "transparent",
                      color:
                        selectedUser?.id === user.id
                          ? "#ffffff"
                          : "var(--text-main)",
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedUser?.id !== user.id) {
                        e.currentTarget.style.background = "var(--bg-secondary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedUser?.id !== user.id) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {user.full_name}
                  </div>
                ))}
              </div>
            )}

            {/* Selected User Display */}
            {selectedUser && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px 12px",
                  background: "var(--primary)",
                  color: "#ffffff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>✓ {selectedUser.full_name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setFormData({ ...formData, assigned_email: "" });
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--text-main)",
                cursor: "pointer",
                fontWeight: "600",
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                background: "var(--primary)",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
                opacity: isLoading ? 0.6 : 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default CreateTask;
