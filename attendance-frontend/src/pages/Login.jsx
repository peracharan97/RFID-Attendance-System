import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/admin-login/${username}/${password}`
      );

      const result = response.data.trim().toUpperCase();

      if (result === "SUCCESS") {
        // ✅ Save username in browser
        localStorage.setItem("username", username);

        // ✅ Navigate based on username
        if (username.toLowerCase() === "admin") {
          navigate("/dashboard");
        } else if (username.toLowerCase() === "faculty") {
          navigate("/class-attendance");
        } else {
          setError("Unknown user role");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to the server");
    }
  };

  return (
    <>
    <Header/>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        padding: '32px',
        width: '100%',
        maxWidth: '448px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: 'center',
          color: '#047857'
        }}>
          Login
        </h2>

        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 12px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 12px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          />

          {error && <p style={{
            color: '#dc2626',
            textAlign: 'center'
          }}>{error}</p>}

          <button
            type="submit"
            style={{
              backgroundColor: '#047857',
              color: 'white',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#065f46'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#047857'}
          >
            Login
          </button>

          {/* Change password link */}
          <p
            onClick={() => navigate('/change-password')}
            style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#2563eb',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Change Password
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
