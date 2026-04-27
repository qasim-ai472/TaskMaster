import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const links = [
    { name: "Tasks", path: "/tasks" },
    { name: "Messages", path: "/messages" },
    { name: "Profile", path: "/profile" },

  ];

  return (
    <aside
      style={{
        width: "220px",
        background: "var(--sidebar-bg)",
        color: "var(--text-invert)",
        minHeight: "100vh",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
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
            color: "var(--text-invert)",
          }}
        >
          DashPro
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                padding: "10px 16px",
                textDecoration: "none",
                color: isActive ? "var(--primary)" : "var(--text-invert)",
                background: isActive ? "var(--sidebar-active)" : "transparent",
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

      {/* Bottom */}
      <div></div>
    </aside>
  );
}

export default Sidebar;

