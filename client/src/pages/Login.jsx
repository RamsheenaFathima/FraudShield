import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaShieldAlt } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("auth", "true");
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

       <div className="brand">
  <FaShieldAlt className="brand-icon" />
  <h1>FraudShield</h1>
  <p>Real-Time Fraud Risk Monitoring System</p>
</div>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD WITH EYE */}
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
  );
}