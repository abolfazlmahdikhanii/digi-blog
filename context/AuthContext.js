const { useRouter } = require("next/router");
const {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const router = useRouter();
  useEffect(() => {
    if (!initialUser) fetchUser();
  }, []);

  const fetchUser = useCallback(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
       
        if (data) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ fetchUser, user, setUser }}>
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
