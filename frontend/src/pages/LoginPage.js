import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const { login, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setInputError(true);
      return;
    }
    setInputError(false);
    login(email, password);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <p className="">to get Started</p>
      {error && <p className="error-text">{error}</p>}
      {inputError && (
        <p className="error-text">Please fill in all required fields.</p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">Email:</label>
        <input className="form-input"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ borderColor: inputError && !email ? "red" : "" }}
          aria-label="Email"
          required
        />
        <label htmlFor="password" className="form-label">Password:</label>
        <input className="form-input2"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ borderColor: inputError && !password ? "red" : "" }}
          aria-label="Password"
          required
        />
        <label htmlFor="remember">Forgot Password?</label>
        <button className="loginButton" type="submit">Login</button>
      </form>
      
      <p className="register-text">
        Don't have an account yet?{" "}
        <Link to="/register" className="register-link">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
