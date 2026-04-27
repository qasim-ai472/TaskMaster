import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import heroImage from "../../assets/images/landing-hero.png";

function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 80px",
          gap: "40px",
          background: "linear-gradient(to right, #eef2ff, #ffffff)",
        }}
      >
        {/* Left */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "20px",
              color: "#1f2937",
            }}
          >
            Manage Your Work Smarter <br /> with One Dashboard
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#6b7280",
              marginBottom: "30px",
              maxWidth: "480px",
            }}
          >
            A simple SaaS platform to organize tasks, track progress, and boost
            productivity.
          </p>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Get Started Free
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#ffffff",
                color: "#2563eb",
                border: "2px solid #2563eb",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src={heroImage}
            alt="Dashboard Preview"
            style={{
              width: "100%",
              maxWidth: "520px",
              borderRadius: "12px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section
        id="key-features"
        style={{
          padding: "80px 60px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "40px" }}>
          Key Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "30px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {[
            {
              title: "Task Management",
              desc: "Easily organize and track your tasks.",
              icon: "📋",
            },
            {
              title: "Secure Authentication",
              desc: "Safe and secure login system.",
              icon: "🔐",
            },
            {
              title: "Analytics & Insights",
              desc: "Gain insights with real-time data.",
              icon: "📊",
            },
            {
              title: "Admin Dashboard",
              desc: "Powerful admin controls.",
              icon: "⚙️",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: "24px",
                borderRadius: "14px",
                backgroundColor: "#f9fafb",
                boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        style={{
          padding: "80px 60px",
          backgroundColor: "#f9fafb",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "40px" }}>
          How It Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {[
            {
              step: "1",
              title: "Sign Up",
              desc: "Create your free account.",
            },
            {
              step: "2",
              title: "Create Tasks",
              desc: "Manage and organize your tasks.",
            },
            {
              step: "3",
              title: "Track Progress",
              desc: "Monitor your performance.",
            },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                backgroundColor: "#ffffff",
                padding: "30px",
                borderRadius: "14px",
                boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  margin: "0 auto 12px",
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section
        style={{
          padding: "80px 40px",
          background: "linear-gradient(to right, #1e3a8a, #2563eb)",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "16px" }}>
          Start organizing your work today — it’s free!
        </h2>

        <button
          onClick={() => navigate("/register")}
          style={{
            marginTop: "20px",
            padding: "14px 28px",
            backgroundColor: "#ffffff",
            color: "#2563eb",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Create Free Account
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          padding: "30px 60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "700" }}>DashPro</h3>

        <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#2563eb" }}
          >
            Login
          </span>
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#2563eb" }}
          >
            Register
          </span>
          <span style={{ color: "#6b7280" }}>© 2026 Qasim Ali</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;


