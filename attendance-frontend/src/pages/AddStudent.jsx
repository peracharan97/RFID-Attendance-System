import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const AddStudent = () => {
  const navigate = useNavigate();

  // Guard: only allow access to admin
  useEffect(() => {
    const loggedUser = localStorage.getItem("username");
    if (!loggedUser) {
      navigate("/admin-login");
      return;
    }
    if (loggedUser.toLowerCase() !== "admin") {
      navigate("/class-attendance");
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    rollNo: "",
    name: "",
    passOutYear: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/student", formData);
      setSuccess("Student added: " + formData.name);
      setFormData({ rollNo: "", name: "", passOutYear: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to send data");
    }
  };

  return (
    <>
      <Header />

      {/* Logout button for this page as well (top-right) */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '16px'
      }}>
        <button
          onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            navigate("/admin-login");
          }}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
        >
          Logout
        </button>
      </div>
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
          }}>Add Student</h2>

          {error && <p style={{
            color: '#dc2626',
            textAlign: 'center',
            marginBottom: '16px'
          }}>{error}</p>}
          {success && <p style={{
            color: '#16a34a',
            textAlign: 'center',
            marginBottom: '16px'
          }}>{success}</p>}

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <input
              type="text"
              name="rollNo"
              placeholder="Roll No"
              value={formData.rollNo}
              onChange={handleChange}
              required
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '8px 12px',
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
              }}
            />

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '8px 12px',
                outline: 'none',
                boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
              }}
            />

            <input
              type="text"
              name="passOutYear"
              placeholder="Pass Out Year e.g., 2026"
              value={formData.passOutYear}
              onChange={handleChange}
              required
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
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#065f46'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#047857'}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudent;
