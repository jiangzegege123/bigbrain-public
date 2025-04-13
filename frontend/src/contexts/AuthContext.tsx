import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (newToken: string, email: string) => void;
  logout: () => void;
  email: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );

  useEffect(() => {
    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
    }
  }, [token, email]);

  const login = (newToken: string, email: string) => {
    setToken(newToken);
    setEmail(email);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, email, isLoggedIn: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
