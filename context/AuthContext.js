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

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
  const { data: user, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetch("/api/auth/me").then((res) => res.json()),
    initialData: initialUser,
  });

  const router = useRouter();
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
