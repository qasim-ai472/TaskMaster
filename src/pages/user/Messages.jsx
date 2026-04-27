import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Topbar from "../../components/common/Topbar";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function Messages() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages on mount and set up real-time listener
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error loading messages:", error);
          showToast("Failed to load messages", "error");
          return;
        }

        setMessages(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error in loadMessages:", err);
        showToast("Error loading messages", "error");
        setLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel(`messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Only add if message involves this user
          if (
            payload.new.sender_id === user.id ||
            payload.new.recipient_id === user.id
          ) {
            console.log("New message received:", payload.new);
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, showToast]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      showToast("Please enter a message", "error");
      return;
    }

    setSending(true);

    try {
      // Try to get admin user by querying the messages table history first
      // This bypasses profile read restrictions
      let { data: existingMessages } = await supabase
        .from("messages")
        .select("sender_id, recipient_id")
        .limit(1);

      let adminId = null;

      // If messages exist, get the admin from them
      if (existingMessages && existingMessages.length > 0) {
        const msg = existingMessages[0];
        // Check if either sender or recipient might be admin by checking their role
        const potentialAdminId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        
        // Verify this is actually an admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", potentialAdminId)
          .single();
        
        if (profile?.role === "admin") {
          adminId = potentialAdminId;
        }
      }

      // If no admin found in messages, try direct query with no RLS restrictions
      if (!adminId) {
        const { data: adminUsers } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("role", "admin");

        if (adminUsers && adminUsers.length > 0) {
          adminId = adminUsers[0].id;
        }
      }

      // If still no admin, show helpful error
      if (!adminId) {
        console.warn("No admin found in system");
        showToast(
          "Admin account not found. Please ensure an admin user exists in the system.",
          "error"
        );
        setSending(false);
        return;
      }

      // Get admin's full name for recipient_name field
      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", adminId)
        .single();

      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: adminId,
        sender_name: user.email || "User",
        recipient_name: adminProfile?.full_name || "Admin",
        message: messageText,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error sending message:", error);
        showToast("Failed to send message", "error");
      } else {
        showToast("Message sent successfully", "success");
        setMessageText("");
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      showToast("Error sending message", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Topbar title="Messages" />
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading messages...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Topbar title="Messages" />

      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Messages with Admin</h1>
          <p style={subtitleStyle}>
            Send and receive messages from your administrator
          </p>
        </div>

        {/* Messages Container */}
        <div style={messagesContainerStyle}>
          {messages.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={emptyTextStyle}>No messages yet</p>
              <p style={emptySubtextStyle}>
                Start a conversation by sending a message below
              </p>
            </div>
          ) : (
            <div style={messageListStyle}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={
                    msg.sender_id === user.id
                      ? messageBoxOutgoingStyle
                      : messageBoxIncomingStyle
                  }
                >
                  <p style={messageTextStyle}>{msg.message}</p>
                  <span style={messageTimeStyle}>
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} style={formStyle}>
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={sending}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={sending}
            style={buttonStyle(sending)}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

/* ================= STYLES ================= */

const containerStyle = {
  padding: "24px",
  maxWidth: "800px",
  margin: "0 auto",
};

const headerStyle = {
  marginBottom: "24px",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "8px",
  color: "#1f2937",
};

const subtitleStyle = {
  fontSize: "14px",
  color: "#6b7280",
};

const messagesContainerStyle = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  minHeight: "400px",
  maxHeight: "500px",
  overflow: "auto",
  padding: "20px",
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
};

const messageListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const emptyStateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  textAlign: "center",
};

const emptyTextStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#6b7280",
  marginBottom: "8px",
};

const emptySubtextStyle = {
  fontSize: "14px",
  color: "#9ca3af",
};

const messageBoxOutgoingStyle = {
  background: "#2563eb",
  color: "#fff",
  borderRadius: "12px",
  padding: "12px 16px",
  marginLeft: "auto",
  maxWidth: "70%",
  wordWrap: "break-word",
};

const messageBoxIncomingStyle = {
  background: "#f3f4f6",
  color: "#1f2937",
  borderRadius: "12px",
  padding: "12px 16px",
  marginRight: "auto",
  maxWidth: "70%",
  wordWrap: "break-word",
};

const messageTextStyle = {
  fontSize: "14px",
  margin: "0 0 4px 0",
  lineHeight: "1.5",
};

const messageTimeStyle = {
  fontSize: "11px",
  opacity: "0.7",
};

const formStyle = {
  display: "flex",
  gap: "10px",
  background: "#fff",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
};

const inputStyle = {
  flex: 1,
  padding: "12px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.2s",
};

const buttonStyle = (disabled) => ({
  padding: "12px 24px",
  backgroundColor: disabled ? "#d1d5db" : "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: disabled ? "not-allowed" : "pointer",
  transition: "0.2s",
});

export default Messages;
