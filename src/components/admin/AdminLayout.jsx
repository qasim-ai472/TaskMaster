import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout({ children, title }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        <AdminTopbar title={title} />

        <main style={{ padding: "24px" }}>{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
