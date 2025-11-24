const { useRouter } = require("next/router");
const {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} = require("react");
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { _null } from "zod/v4/core";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
  const router = useRouter();

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) {
        return null;
      }
      return res.json();
    } catch (err) {
      return null;
    }
  };
  const { data: user, refetch } = useQuery({
    queryKey: ["user"],
    initialData: initialUser,
    queryFn: async () => {
      const res = await fetch("/api/auth/me");

      if (res.status === 401) {
        const refreshed = await refresh();
        if (refreshed) {
          return fetch("/api/auth/me").then((r) => r.json());
        }
    
        return null;
      }

      return res.json();
    },
  });

  const logoutHandler = () => {
    fetch("/api/auth/signout").then((res) => {
      if (res.ok) {
        toast.success("SuccessFully Signout");
        refetch();
        router.replace("/");
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user: user?.user, refetch, logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
