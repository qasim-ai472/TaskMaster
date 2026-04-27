import { useNavigate } from "react-router-dom";
import homeIcon from "../../assets/icons/home-icon.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 80px",
        backgroundColor: "#4f46e5",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left Section - Home Icon + Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
      {/* Home Icon */}
      <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "35px",
          height: "33px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "25px",
          transition: "all 0.3s",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f0f0f0";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ffffff";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
        }}
        title="Back to Home"
      >
        <img src={homeIcon} alt="Home" style={{ width: "25px", height: "25px", filter: "brightness(0.8)" }} />
      </div>

      {/* Logo */}
      <h2 style={{ fontSize: "25px", fontWeight: "700", color: "#ffffff" }}>
        DashPro
      </h2>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <a
          href="#key-features"
          style={{
            textDecoration: "none",
            color: "#ffffff",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "18px",
            letterSpacing: "0.2px",
            background: "transparent",
            transition: "all 0.18s ease",
            transform: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById("key-features");
            if (element) element.scrollIntoView({ behavior: "smooth" });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Features
        </a>

        <a
          href="#how-it-works"
          style={{
            textDecoration: "none",
            color: "#ffffff",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "8px",
            fontWeight: 600,
            letterSpacing: "0.2px",
            background: "transparent",
            transition: "all 0.18s ease",
            transform: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById("how-it-works");
            if (element) element.scrollIntoView({ behavior: "smooth" });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          How It Works
        </a>

        <button
          onClick={handleLoginClick}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ffffff",
            color: "#4f46e5",
            border: "1px solid #4f46e5",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.18s ease",
            transform: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#eef2ff";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.12)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "none";
          }}
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

