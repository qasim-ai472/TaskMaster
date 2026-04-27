import { createContext, useContext, useState } from "react";

const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [avatars, setAvatars] = useState({}); // Store avatars by user ID

  const setUserAvatar = (userId, avatarData) => {
    setAvatars((prev) => ({
      ...prev,
      [userId]: avatarData,
    }));
  };

  const getUserAvatar = (userId) => {
    return avatars[userId] || null;
  };

  const clearUserAvatar = (userId) => {
    setAvatars((prev) => {
      const newAvatars = { ...prev };
      delete newAvatars[userId];
      return newAvatars;
    });
  };

  return (
    <AvatarContext.Provider value={{ setUserAvatar, getUserAvatar, clearUserAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within AvatarProvider");
  }
  return context;
}
