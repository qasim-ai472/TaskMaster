import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../services/supabaseClient";

function Login() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== LOGIN FORM SUBMITTED ===");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth failed:", error.message);
        showToast(`Login failed: ${error.message}`, "error");
        return;
      }

      if (!data?.user) {
        console.error("No user data returned");
        showToast("Login failed: No user data", "error");
        return;
      }

      console.log("✓ Auth succeeded, user ID:", data.user.id);
      showToast("Logged In Successfully", "success");
      console.log("Auth state listener should trigger and update context...");
      
    } catch (err) {
      console.error("Exception during login:", err);
      showToast(`Error: ${err.message}`, "error");
    }
  };

  useEffect(() => {
    console.log("📍 LOGIN PAGE EFFECT TRIGGERED");
    console.log("User state in context:", { 
      userId: user?.id, 
      userRole: user?.role,
      hasUser: !!user 
    });
    
    // If user exists and we have an ID, redirect
    if (user && user.id) {
      console.log("✓ User detected in context, preparing redirect...");
      const role = (user.role || "user").toLowerCase();
      console.log("User role:", role);
      
      if (role === "admin") {
        console.log("→ Redirecting ADMIN to /admin/create-task");
        navigate("/admin/create-task", { replace: true });
      } else {
        console.log("→ Redirecting USER to /tasks");
        navigate("/tasks", { replace: true });
      }
    } else {
      console.log("⏳ No user in context yet, waiting...");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      <section
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7ff",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            backgroundColor: "#ffffff",
            padding: "28px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "700",
              marginBottom: "6px",
              color: "#1f2937",
              textAlign: "center",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginBottom: "22px",
              fontSize: "14px",
            }}
          >
            Login to continue to your dashboard
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "11px",
                borderRadius: "7px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "11px",
                borderRadius: "7px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
              style={{
                marginTop: "8px",
                padding: "11px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "7px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>

          <p
            style={{
              marginTop: "18px",
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#2563eb",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Register
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
