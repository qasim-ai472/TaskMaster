import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

const fetchUserProfile = async (userId) => {
  try {
    console.log("Fetching profile for user:", userId);
    
    // Add timeout to prevent hanging
    const profilePromise = supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", userId)
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Profile fetch timeout")), 3000)
    );

    const { data: profile, error } = await Promise.race([
      profilePromise,
      timeoutPromise,
    ]);

    console.log("Profile fetch result - error:", error?.message, "data:", profile);

    if (error) {
      if (error.code === "PGRST116") {
        // Row not found - create default profile
        console.log("Profile not found, creating default");
        return { role: "user", full_name: "" };
      }
      console.error("Profile fetch error:", error.message);
      return { role: "user", full_name: "" };
    }

    if (!profile) {
      console.log("No profile data, creating one");
      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        role: "user",
        full_name: "",
      });
      if (insertError) {
        console.error("Profile insert error:", insertError);
      }
      return { role: "user", full_name: "" };
    }

    console.log("Profile found:", profile);
    return profile;
  } catch (err) {
    console.error("Error in fetchUserProfile:", err.message);
    return { role: "user", full_name: "" };
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = null;

    const setupAuth = async () => {
      try {
        console.log("Setting up authentication...");

        // Set up listener first
        const { data } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            console.log("🔔 AUTH STATE CHANGE EVENT:", _event);
            console.log("Session user ID:", session?.user?.id);

            if (!isMounted) {
              console.log("Component unmounted, skipping state update");
              return;
            }

            try {
              if (session?.user) {
                console.log("✓ User session exists:", session.user.id);
                
                // Fetch profile FIRST before setting user
                console.log("Fetching profile to determine role...");
                const profile = await fetchUserProfile(session.user.id);
                console.log("✓ Profile fetched, role:", profile?.role);
                
                if (!isMounted) {
                  console.log("Component unmounted after profile fetch, skipping state update");
                  return;
                }
                
                // NOW set user with CORRECT role
                const userData = {
                  ...session.user,
                  role: (profile?.role || "user").toLowerCase(),
                  fullName: profile?.full_name || "",
                };
                
                console.log("✓ Setting user in context with role:", userData.role);
                setUser(userData);
                console.log("✓ User set in context successfully");
              } else {
                console.log("✗ No user session");
                setUser(null);
              }
            } catch (err) {
              console.error("❌ Error in auth state change:", err.message);
              console.error("Error stack:", err);
              setUser(null);
            }
          }
        );

        unsubscribe = data?.subscription?.unsubscribe;

        // Get current session with timeout
        console.log("Getting current session...");
        let sessionData = null;
        
        try {
          const result = await Promise.race([
            supabase.auth.getSession(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Session check timeout")), 3000)
            )
          ]);
          sessionData = result.data;
        } catch (err) {
          console.warn("Could not get session:", err.message);
          sessionData = null;
        }

        if (!isMounted) return;

        if (sessionData?.session?.user) {
          console.log("Existing session found");
          const profile = await fetchUserProfile(sessionData.session.user.id);
          const userData = {
            ...sessionData.session.user,
            role: (profile?.role || "user").toLowerCase(),
            fullName: profile?.full_name || "",
          };
          setUser(userData);
        } else {
          console.log("No session found");
          setUser(null);
        }

        // Always mark loading as complete
        if (isMounted) {
          console.log("Auth setup complete, marking as not loading");
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth setup failed:", error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    setupAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
