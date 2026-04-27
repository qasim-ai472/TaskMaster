import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useAvatar } from "../../context/AvatarContext";
import { supabase } from "../../services/supabaseClient";

function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { getUserAvatar, setUserAvatar } = useAvatar();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [isProfileCardEditOpen, setIsProfileCardEditOpen] = useState(false);
  const [isPersonalInfoEditOpen, setIsPersonalInfoEditOpen] = useState(false);
  const [profileCardEditData, setProfileCardEditData] = useState({ full_name: "" });
  const [personalInfoEditData, setPersonalInfoEditData] = useState({ full_name: "" });

  // Fetch user profile data
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        // Get avatar from context (persists across page navigation)
        const contextAvatar = getUserAvatar(user.id);
        setAvatar(contextAvatar || null);
        setProfileCardEditData({ full_name: data?.full_name || "" });
        setPersonalInfoEditData({ full_name: data?.full_name || "" });
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        showToast("Error loading profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Convert file to base64 string
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        // Save avatar to context (persists across page navigation until refresh)
        setUserAvatar(user.id, base64String);
        showToast("Profile picture updated ✅", "success");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing avatar:", error.message);
      showToast("Error processing picture", "error");
    }
  };

  // Save profile data to Supabase
  const saveProfileToSupabase = async (updates) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
      showToast("Changes saved ✅", "success");
    } catch (error) {
      console.error("Error saving profile:", error.message);
      showToast("Error saving changes", "error");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Topbar title="Profile" />
        <div style={{ padding: "30px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleOpenProfileCardEdit = () => {
    setProfileCardEditData({ full_name: profile?.full_name || "" });
    setIsProfileCardEditOpen(true);
  };

  const handleCloseProfileCardEdit = () => {
    // Update profile with edited name
    const updatedProfile = { ...profile, full_name: profileCardEditData.full_name };
    setProfile(updatedProfile);
    
    // Save to Supabase
    saveProfileToSupabase({ full_name: profileCardEditData.full_name });
    setIsProfileCardEditOpen(false);
  };

  const handleOpenPersonalInfoEdit = () => {
    setPersonalInfoEditData({ full_name: profile?.full_name || "" });
    setIsPersonalInfoEditOpen(true);
  };

  const handleClosePersonalInfoEdit = () => {
    // Update profile with edited information
    const updatedProfile = { ...profile, full_name: personalInfoEditData.full_name };
    setProfile(updatedProfile);
    
    // Save to Supabase
    saveProfileToSupabase({ full_name: personalInfoEditData.full_name });
    setIsPersonalInfoEditOpen(false);
  };

  return (
    <DashboardLayout>
      <Topbar title="Profile" />

      <div style={{ padding: "30px", maxWidth: "600px" }}>
        {/* ========== MY PROFILE SECTION ========== */}
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>
          My Profile
        </h2>

        {/* Profile Card */}
        <div
          style={{
            background: "var(--bg-card)",
            padding: "24px",
            borderRadius: "14px",
            border: "1px solid var(--border)",
            marginBottom: "24px",
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flex: 1 }}>
            {/* Avatar */}
            <div style={{ flex: "0 0 auto" }}>
              <button
                onClick={handleAvatarClick}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "3px solid var(--border)",
                  backgroundImage: avatar ? `url(${avatar})` : "none",
                  backgroundColor: avatar ? "transparent" : "var(--bg-secondary)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  padding: 0,
                }}
              >
                {!avatar && "📷"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                {profile?.full_name || "User"}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "User"}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleOpenProfileCardEdit}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--text-main)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
              whiteSpace: "nowrap",
            }}
          >
            ✏️ Edit
          </button>
        </div>

        {/* ========== PERSONAL INFORMATION SECTION ========== */}
        <div
          style={{
            background: "var(--bg-card)",
            padding: "24px",
            borderRadius: "14px",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>
              Personal Information
            </h3>
            <button
              onClick={handleOpenPersonalInfoEdit}
              style={{
                padding: "8px 14px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--text-main)",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              ✏️ Edit
            </button>
          </div>

          {/* Two Column Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {/* First Name */}
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                First Name
              </label>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>
                {profile?.full_name?.split(" ")[0] || "—"}
              </p>
            </div>

            {/* Last Name */}
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Last Name
              </label>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>
                {profile?.full_name?.split(" ").slice(1).join(" ") || "—"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Email Address
              </label>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>
                {user?.email || "—"}
              </p>
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Role
              </label>
              <p style={{ fontSize: "14px", fontWeight: "600" }}>
                {profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PROFILE CARD EDIT MODAL ========== */}
      {isProfileCardEditOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={handleCloseProfileCardEdit}
        >
          <div
            style={{
              background: "var(--bg-card)",
              padding: "30px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
              Edit Name
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: "600" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileCardEditData.full_name}
                  onChange={(e) => setProfileCardEditData({ full_name: e.target.value })}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={handleCloseProfileCardEdit}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "transparent",
                    color: "var(--text-main)",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCloseProfileCardEdit}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== PERSONAL INFO EDIT MODAL ========== */}
      {isPersonalInfoEditOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={handleClosePersonalInfoEdit}
        >
          <div
            style={{
              background: "var(--bg-card)",
              padding: "30px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}>
              Edit Personal Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: "600" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={personalInfoEditData.full_name}
                  onChange={(e) => setPersonalInfoEditData({ ...personalInfoEditData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={handleClosePersonalInfoEdit}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    background: "transparent",
                    color: "var(--text-main)",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClosePersonalInfoEdit}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "var(--primary)",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;

