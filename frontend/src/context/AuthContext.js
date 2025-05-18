import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
  
      if (res?.data?.user) {
        setUser(res.data.user);  // ✅ Update the user state
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
  
        // Check if the user is an admin and navigate accordingly
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  const register = async (firstname, lastname, phonenumber, email, password) => {
    try {
      setError(null);
      await axios.post("http://localhost:5000/api/users/register", {
        firstname,
        lastname,
        phonenumber,
        email,
        password,
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const loginEmployee = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post("http://localhost:5000/api/employees/login", { email, password });
  
      if (res?.data?.employee) {
        setUser(res.data.employee);  // ✅ Update the user state
        localStorage.setItem("user", JSON.stringify(res.data.employee));
        localStorage.setItem("token", res.data.token);
        return true; // ✅ Let component handle navigation
      } else {
        setError("Invalid credentials");
        return false;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loginEmployee, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
