const { useRouter } = require("next/router");
const {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} = require("react");
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
  const { data: user, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/auth/me").then((res) => res.json()),
    initialData: initialUser,
  });
 
  const router = useRouter();

  return (
    <AuthContext.Provider value={{ user:user?.user, refetch }}>
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
