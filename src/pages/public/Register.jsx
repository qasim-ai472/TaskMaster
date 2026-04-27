import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../services/supabaseClient";

function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      /* ================= SUPABASE AUTH REGISTER ================= */

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("Signup response:", { user: data?.user?.id, error: error?.message });

      if (error) {
        console.error("Supabase signup error:", error);
        showToast(`Registration failed: ${error.message}`, "error");
        return;
      }

      if (!data?.user) {
        console.error("No user data returned from signup");
        showToast("Registration failed: No user created", "error");
        return;
      }

      console.log("User created successfully:", data.user.id);
      showToast("Account created successfully! Please check your email for confirmation.", "success");
      /* ================= CREATE PROFILE ROW ================= */

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        role: "user", // default role for new users
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return;
      }

      console.log("Profile created successfully");

      // Wait a moment before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error("Unexpected registration error:", err);
      showToast(`Unexpected error: ${err.message}`, "error");
    }
  };

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
            Create Account
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              marginBottom: "22px",
              fontSize: "14px",
            }}
          >
            Join us to get started
          </p>

          <form
            onSubmit={handleRegister}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                padding: "11px",
                borderRadius: "7px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            />

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

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                backgroundColor: "#ffffff",
                color: "#2563eb",
                border: "2px solid #2563eb",
                borderRadius: "7px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Account
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
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#2563eb",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Login
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;

