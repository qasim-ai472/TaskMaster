import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          backgroundColor: "#f4f7ff",
          padding: "24px",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

