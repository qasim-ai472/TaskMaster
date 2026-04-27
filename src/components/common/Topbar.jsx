import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar({ title }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "70px",
        width: "100%",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Left */}
      <h1
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "var(--text-main)",
        }}
      >
        {title}
      </h1>

      {/* Right */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "var(--primary)",
            color: "#ffffff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
