import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const ChangePassword = () => {
  const navigate = useNavigate();

  // ✅ Add username state
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // You can either get username from localStorage or input
    // const username = localStorage.getItem("username");

    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/change-password/${username}/${oldPassword}/${newPassword}`
      );

      setMessage(response.data); // Backend response message
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setUsername("");
    } catch (err) {
      console.error(err);
      setMessage("Error updating password. Check old password or username.");
    }
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          width: '100%',
          maxWidth: '448px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Change Password
          </h2>

          {message && (
            <p
              style={{
                textAlign: 'center',
                marginBottom: '16px',
                fontWeight: '600',
                color: message.includes("Error") || message.includes("required")
                  ? '#dc2626'
                  : '#16a34a'
              }}
            >
              {message}
            </p>
          )}

          <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }} onSubmit={handleChangePassword}>
            {/* ✅ Username Input */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '8px 12px',
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
              }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: '#047857',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginTop: '8px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#065f46'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#047857'}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
