import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const StudentStats = () => {
  const [rollNo, setRollNo] = useState("");
  const [sem, setSem] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Navigation helper for smooth transition
  const navigateAndCloseMenu = (path) => {
    setMenuOpen(false);
    setTimeout(() => navigate(path), 50);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("attendanceRecords");
    navigate("/");
  };

  // ✅ Fetch attendance data
  const handleFetch = async () => {
    if (!rollNo || !sem) {
      setError("Please enter Roll Number and Semester");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/attendance/${rollNo}/${sem}`
      );
      setAttendanceData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch data. Please check Roll Number and Semester.");
    }
  };

  return (
    <>
      <Header />

      {/* ✅ Hamburger Menu */}
      <div style={{ position: 'relative' }}>
        <button
          style={{
            margin: '-16px 8px',
            padding: '8px',
            backgroundColor: '#047857',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#065f46'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#047857'}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          ☰
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: '56px',
              left: '0',
              backgroundColor: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
              width: '192px',
              borderRadius: '8px',
              zIndex: '50'
            }}
          >
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#1f2937'
            }}>
              
              <li
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1fae5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => navigateAndCloseMenu("/admin-login")}
              >
                📚 Daily Classes
              </li>
              
            </ul>
          </div>
        )}
      </div>

      {/* ✅ Main Content */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>Student Attendance Stats</h2>

        {/* Input Section */}
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '24px',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '448px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '8px 12px'
              }}
            />
            <input
              type="number"
              placeholder="Enter Semester"
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '8px 12px'
              }}
            />
            <button
              onClick={handleFetch}
              style={{
                backgroundColor: '#047857',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#065f46'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#047857'}
            >
              Get Attendance
            </button>
            {error && <p style={{
              color: '#dc2626',
              textAlign: 'center'
            }}>{error}</p>}
          </div>
        </div>

        {/* Table Display */}
        {attendanceData.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            padding: '24px',
            width: '100%',
            maxWidth: '1280px',
            overflowX: 'auto'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Roll No:{" "}
              <span style={{
                color: '#2563eb'
              }}>
                {attendanceData[0].rollNo}
              </span>
            </h3>

            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #d1d5db',
              textAlign: 'center'
            }}>
              <thead style={{
                backgroundColor: '#047857',
                color: 'white'
              }}>
                <tr>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Date</th>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Class 1</th>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Class 2</th>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Class 3</th>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Class 4</th>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Class 5</th>
                  <th style={{
                    border: '1px solid #d1d5db',
                    padding: '8px 16px'
                  }}>Class 6</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((item, index) => (
                  <tr key={index}>
                    <td style={{
                      border: '1px solid #d1d5db',
                      padding: '8px 16px',
                      fontWeight: '500'
                    }}>
                      {item.date}
                    </td>
                    {Array.from({ length: 6 }).map((_, i) => {
                      const key = `class${i + 1}`;
                      const status = item[key];
                      return (
                        <td
                          key={key}
                          style={{
                            border: '1px solid #d1d5db',
                            padding: '8px 16px',
                            fontWeight: '600',
                            color: status ? '#2563eb' : '#dc2626',
                            backgroundColor: status ? '#dbeafe' : '#fee2e2'
                          }}
                        >
                          {status ? "Present" : "Absent"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentStats;
