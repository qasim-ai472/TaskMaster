function Toast({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "12px 18px",
            borderRadius: "8px",
            backgroundColor:
              toast.type === "success"
                ? "#22c55e"
                : toast.type === "error"
                ? "#ef4444"
                : "#3b82f6",
            color: "#fff",
            fontWeight: "600",
            minWidth: "220px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default Toast;
