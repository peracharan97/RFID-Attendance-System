import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";


const ProxyAttendance = () => {
  const navigate = useNavigate();
  // logout handler
  const handleLogout = () => {
    // Clear any stored auth/session info
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    // navigate to admin login
    navigate("/admin-login");
  };
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [section, setSection] = useState("");
  const [sem, setSem] = useState();
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Restore on refresh
  useEffect(() => {
    const loggedUser = localStorage.getItem("username");
    if (!loggedUser) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  // Fetch attendance data from backend
  const fetchAttendance = async () => {
    if (!section || !sem || !date) {
      setError("Please enter Section, Semester, and Date.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/class-attendance/${section}/${sem}/${date}`
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (section && sem && date) {
      fetchAttendance();
    }
  }, [section, sem, date]);

  // Remove proxy student
  const handleRemove = async (id) => {
    try {
      await axios.post(
        `http://localhost:8080/class-attendance/${id}/${selectedClass}`,
        { className: selectedClass }
      );
      fetchAttendance(); // Refresh table
    } catch (error) {
      console.error("Error removing proxy:", error);
    }
  };

  const totalAttended = attendanceData.filter(student => student[selectedClass]).length;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb'
    }}>
      <Header />

      {/* Logout button placed near top of page */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '16px'
      }}>
        <button
          onClick={handleLogout}
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

      <main style={{
        flex: '1',
        padding: '24px'
      }}>
        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Section e.g., IT-2"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              borderRadius: '4px',
              width: '128px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          />
          <input
            type="number"
            placeholder="Semester e.g., 7"
            value={sem}
            onChange={(e) => setSem(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              borderRadius: '4px',
              width: '128px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              borderRadius: '4px',
              width: '144px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              borderRadius: '4px',
              width: '128px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          >
            <option value="">Select Class</option>
            <option value="class1">Class 1</option>
            <option value="class2">Class 2</option>
            <option value="class3">Class 3</option>
            <option value="class4">Class 4</option>
            <option value="class5">Class 5</option>
            <option value="class6">Class 6</option>
          </select>
          <button
            onClick={fetchAttendance}
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
            Fetch Data
          </button>
        </div>

        {error && <p style={{
          color: '#dc2626',
          marginBottom: '16px'
        }}>{error}</p>}

        {selectedClass && (
          <p style={{
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Total Students Attended for {selectedClass.replace("class", "Class ")}: {totalAttended}
          </p>
        )}

        {/* Attendance Table */}
        <div style={{
          overflowX: 'auto',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <table style={{
            minWidth: '100%',
            textAlign: 'center'
          }}>
            <thead style={{
              backgroundColor: '#047857',
              color: 'white'
            }}>
              <tr>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>ID</th>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>Name</th>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>Roll No</th>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>Action</th>
              </tr>
            </thead>
            <tbody style={{
              color: '#1f2937'
            }}>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{
                    padding: '16px'
                  }}>
                    Loading...
                  </td>
                </tr>
              ) : attendanceData.length > 0 ? (
                attendanceData.map(
                  (student) =>
                    student[selectedClass] && (
                      <tr key={student.id} style={{
                        backgroundColor: 'transparent'
                      }}
                      onMouseOver={(e) => e.target.closest('tr').style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
                      >
                        <td style={{
                          padding: '8px 16px',
                          border: '1px solid #e5e7eb'
                        }}>{student.id}</td>
                        <td style={{
                          padding: '8px 16px',
                          border: '1px solid #e5e7eb'
                        }}>{student.student.name}</td>
                        <td style={{
                          padding: '8px 16px',
                          border: '1px solid #e5e7eb'
                        }}>{student.rollNo}</td>
                        <td style={{
                          padding: '8px 16px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <button
                            onClick={() => handleRemove(student.id)}
                            style={{
                              backgroundColor: '#dc2626',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                )
              ) : (
                <tr>
                  <td colSpan="4" style={{
                    padding: '16px'
                  }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ProxyAttendance;
