import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function AdminMessages() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [adminName, setAdminName] = useState("Admin");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load all users for the dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "user");

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, []);

  // Load admin profile name
  useEffect(() => {
    if (!user) return;

    const loadAdminProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .limit(1)
          .single();

        if (error) throw error;
        if (data?.full_name) {
          setAdminName(data.full_name);
        }
      } catch (error) {
        console.error("Error loading admin profile:", error);
      }
    };

    loadAdminProfile();
  }, [user]);

  // Load messages and set up real-time listener
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        setLoading(true);

        // Get all messages where admin is sender or recipient
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: true });

        if (error) throw error;

        setMessages(data || []);

        // Extract unique conversations
        const convMap = {};
        data?.forEach((msg) => {
          const otherId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
          const otherName = msg.sender_id === user.id ? msg.recipient_name : msg.sender_name;

          if (!convMap[otherId]) {
            convMap[otherId] = {
              user_id: otherId,
              user_name: otherName,
              last_message: msg.message,
              last_message_time: msg.created_at,
            };
          } else {
            // Update if this message is newer
            if (new Date(msg.created_at) > new Date(convMap[otherId].last_message_time)) {
              convMap[otherId].last_message = msg.message;
              convMap[otherId].last_message_time = msg.created_at;
            }
          }
        });

        setConversations(Object.values(convMap).sort((a, b) => 
          new Date(b.last_message_time) - new Date(a.last_message_time)
        ));

        setLoading(false);
      } catch (error) {
        console.error("Error loading messages:", error);
        showToast("Failed to load messages", "error");
        setLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`admin-messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Only add if message involves this admin
          if (
            payload.new.sender_id === user.id ||
            payload.new.recipient_id === user.id
          ) {
            console.log("New message received:", payload.new);
            // Add to full messages list
            setMessages((prev) => [...prev, payload.new]);
            
            // Update conversations list
            const otherId =
              payload.new.sender_id === user.id
                ? payload.new.recipient_id
                : payload.new.sender_id;
            const otherName =
              payload.new.sender_id === user.id
                ? payload.new.recipient_name
                : payload.new.sender_name;
            
            setConversations((prev) => {
              const exists = prev.find((c) => c.user_id === otherId);
              if (!exists) {
                return [
                  {
                    user_id: otherId,
                    user_name: otherName,
                    last_message: payload.new.message,
                    last_message_time: payload.new.created_at,
                  },
                  ...prev,
                ];
              }
              return prev.map((c) =>
                c.user_id === otherId
                  ? {
                      ...c,
                      last_message: payload.new.message,
                      last_message_time: payload.new.created_at,
                    }
                  : c
              );
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, showToast]);

  const handleSelectUser = async (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    
    // Filter messages for this specific user
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.sender_id === user.id && msg.recipient_id === userId) ||
        (msg.sender_id === userId && msg.recipient_id === user.id)
    );
    setMessages(filteredMessages);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      showToast("Please enter a message", "error");
      return;
    }

    if (!selectedUser) {
      showToast("Please select a user", "error");
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: selectedUser.id,
        sender_name: adminName,
        recipient_name: selectedUser.name,
        message: messageText,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error sending message:", error);
        showToast("Failed to send message", "error");
      } else {
        showToast("Message sent", "success");
        setMessageText("");
        // Reload messages for this user
        const updatedMessages = messages.filter(
          (msg) =>
            (msg.sender_id === user.id && msg.recipient_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id && msg.recipient_id === user.id)
        );
        updatedMessages.push({
          sender_id: user.id,
          recipient_id: selectedUser.id,
          sender_name: "Admin",
          recipient_name: selectedUser.name,
          message: messageText,
          created_at: new Date().toISOString(),
        });
        setMessages(updatedMessages);
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
      <AdminLayout>
        <div style={{ padding: "30px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading messages...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "0",
          maxHeight: "calc(100vh - 80px)",
          background: "var(--bg-main)",
        }}
      >
        {/* Conversations List */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRight: "1px solid var(--border)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 12px 0" }}>
              Users
            </h3>
            <select
              onChange={(e) => {
                const selected = users.find((u) => u.id === e.target.value);
                if (selected) {
                  handleSelectUser(selected.id, selected.full_name);
                }
              }}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "13px",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
              }}
            >
              <option value="">Select a user...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflow: "auto" }}>
            {conversations.length === 0 ? (
              <div style={{ padding: "16px", color: "var(--text-muted)", fontSize: "13px" }}>
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user_id}
                  onClick={() => handleSelectUser(conv.user_id, conv.user_name)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background:
                      selectedUser?.id === conv.user_id ? "var(--primary)" : "transparent",
                    color:
                      selectedUser?.id === conv.user_id ? "#ffffff" : "var(--text-main)",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?.id !== conv.user_id) {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.id !== conv.user_id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <p style={{ fontSize: "13px", fontWeight: "600", margin: "0 0 4px 0" }}>
                    {conv.user_name}
                  </p>
                  <p style={{ fontSize: "12px", margin: "0", opacity: 0.7 }}>
                    {conv.last_message.substring(0, 40)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-main)",
          }}
        >
          {selectedUser ? (
            <>
              {/* Messages Header */}
              <div
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--bg-card)",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "0" }}>
                  {selectedUser.name}
                </h2>
              </div>

              {/* Messages Container */}
              <div
                style={{
                  flex: 1,
                  overflow: "auto",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: msg.sender_id === user.id ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "60%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background:
                          msg.sender_id === user.id ? "var(--primary)" : "var(--bg-card)",
                        color: msg.sender_id === user.id ? "#ffffff" : "var(--text-main)",
                        fontSize: "14px",
                        wordWrap: "break-word",
                        border:
                          msg.sender_id === user.id
                            ? "none"
                            : "1px solid var(--border)",
                      }}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                  }}
                  disabled={sending}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: sending ? 0.6 : 1,
                  }}
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                fontSize: "16px",
              }}
            >
              Select a user to start messaging
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminMessages;
