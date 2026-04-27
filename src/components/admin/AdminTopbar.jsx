import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminTopbar({ title }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        height: "70px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: "600" }}>{title}</h1>

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          border: "2px solid #ef4444",
          borderRadius: "6px",
          backgroundColor: "#ef4444",
          color: "#ffffff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminTopbar;
