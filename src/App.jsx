import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading } = useAuth();
  const [forceRender, setForceRender] = useState(false);

  // Safety timeout - if loading takes more than 5 seconds, show the page anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn("Loading took too long, forcing render...");
      setForceRender(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading && !forceRender) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f4f7ff",
          fontSize: "18px",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;

