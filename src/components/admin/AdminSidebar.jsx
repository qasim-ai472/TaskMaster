import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const links = [
    { name: "Create Task", path: "/admin/create-task" },
    { name: "Messages", path: "/admin/messages" },
    { name: "Task Monitor", path: "/admin/task-monitor" },
  ];

  return (
    <aside
      style={{
        width: "220px",
        backgroundColor: "#ffffff",
        color: "#111827",
        minHeight: "100vh",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top */}
      <div>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          Admin Panel
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingX: "12px" }}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                padding: "10px 20px",
                textDecoration: "none",
                color: isActive ? "#4f46e5" : "#111827",
                backgroundColor: isActive ? "#ffffff20" : "transparent",
                borderRadius: "8px",
                fontWeight: isActive ? "700" : "500",
                transition: "0.2s",
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

    </aside>
  );
}

export default AdminSidebar;
