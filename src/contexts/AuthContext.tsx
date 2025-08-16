import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  Profile,
  getCurrentUser,
  getCurrentProfile,
  signOut as authSignOut,
} from "../lib/auth";

interface AuthContextType {
  user: User | null;
  profile: Profile | (Profile & { user_type?: "athlete" | "club" }) | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// força o user_type pelos e-mails especiais
const patchProfileTypeByEmail = (
  u: User | null,
  p: Profile | null
): (Profile & { user_type?: "athlete" | "club" }) | null => {
  if (!u) return null;
  const email = (u.email || "").toLowerCase().trim();
  const patch =
    email === "clube@teste.com"
      ? "club"
      : email === "atleta@teste.com"
      ? "athlete"
      : undefined;

  if (!p) return patch ? ({ user_type: patch } as any) : null;
  if (!patch) return p;
  return { ...p, user_type: patch };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<
    Profile | (Profile & { user_type?: "athlete" | "club" }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = () => {
    const currentUser = getCurrentUser();
    const currentProfile = getCurrentProfile();
    setUser(currentUser);
    setProfile(patchProfileTypeByEmail(currentUser, currentProfile));
  };

  useEffect(() => {
    refreshProfile();
    setLoading(false);

    const handleStorageChange = () => refreshProfile();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
