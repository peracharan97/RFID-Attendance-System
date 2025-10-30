import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState("");
  const [sem, setSem] = useState("");
  const [passOutYear, setPassOutYear] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [extraHours, setExtraHours] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

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

  // ✅ Check login + role before allowing dashboard access
  useEffect(() => {
    const loggedUser = localStorage.getItem("username");
    if (!loggedUser) {
      navigate("/admin-login");
      return;
    }

    // ✅ Allow only admin, redirect faculty to class-attendance
    if (loggedUser !== "admin") {
      navigate("/class-attendance");
      return;
    }

    // ✅ Restore previous attendance data if available
    const storedData = localStorage.getItem("attendanceRecords");
    if (storedData) {
      setRecords(JSON.parse(storedData));
    }
  }, [navigate]);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("attendanceRecords", JSON.stringify(records));
    }
  }, [records]);

  const fetchAttendanceData = async () => {
    if (!section || !sem || !passOutYear) {
      setError("Please enter Section, Semester, and Pass-Out Year.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8080/attendance/${section}/${sem}/${passOutYear}`
      );
      setRecords(response.data);
      setExtraHours({});
      localStorage.setItem("attendanceRecords", JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const dates = new Set();
  const attendance = {};

  records.forEach((item) => {
    dates.add(item.date);
    if (!attendance[item.rollNo]) attendance[item.rollNo] = 0;
    attendance[item.rollNo] +=
      (item.class1 || 0) +
      (item.class2 || 0) +
      (item.class3 || 0) +
      (item.class4 || 0) +
      (item.class5 || 0) +
      (item.class6 || 0);
  });

  const totalClasses = dates.size * 6;

  const handleAddExtraHour = (rollNo) => {
    const currentTotal = (attendance[rollNo] || 0) + (extraHours[rollNo] || 0);
    if (currentTotal < totalClasses) {
      setExtraHours((prev) => ({ ...prev, [rollNo]: (prev[rollNo] || 0) + 1 }));
    }
  };

  const handleRemoveExtraHour = (rollNo) => {
    setExtraHours((prev) => ({
      ...prev,
      [rollNo]: Math.max((prev[rollNo] || 0) - 1, 0),
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("attendanceRecords");
    navigate("/admin-login");
  };

  const getTotalWithExtras = (rollNo) =>
    (attendance[rollNo] || 0) + (extraHours[rollNo] || 0);

  const handleDownloadCSV = () => {
    if (Object.keys(attendance).length === 0) {
      alert("No data available to download!");
      return;
    }

    const userConfirmed = window.confirm(
      "⚠️ Please check added hours before downloading.\n\nClick OK to download, or Cancel to go back."
    );

    if (!userConfirmed) return;

    const csvHeader = [
      "ID",
      "Roll No",
      "Attended Classes",
      "Extra Hours",
      "Percentage",
    ];
    const csvRows = [];

    let id = 1;
    for (const [rollNo, attended] of Object.entries(attendance)) {
      const totalWithExtras = getTotalWithExtras(rollNo);
      const extra = extraHours[rollNo] || 0;
      const percentage = totalClasses
        ? ((totalWithExtras / totalClasses) * 100).toFixed(2) + "%"
        : "0%";

      csvRows.push([id++, rollNo, totalWithExtras, extra, percentage]);
    }

    const csvContent = [
      csvHeader.join(","),
      ...csvRows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${section || "data"}_sem${sem || ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navigateAndCloseMenu = (path) => {
    setMenuOpen(false);
    setTimeout(() => navigate(path), 50);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb'
    }}>
      <Header />

      {/* Hamburger Menu */}
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
                onClick={() => navigateAndCloseMenu("/")}
              >
                📊 Student Stats
              </li>
              <li
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1fae5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => navigateAndCloseMenu("/add-student")}
              >
                ➕ Add Student
              </li>
              <li
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1fae5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => navigateAndCloseMenu("/class-attendance")}
              >
                📚 Classes
              </li>
              <li
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1fae5'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setMenuOpen(false);
                  handleDownloadCSV();
                }}
              >
                📥 Download CSV
              </li>
              <li
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  color: '#dc2626'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#fee2e2'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                🚪 Logout
              </li>
            </ul>
          </div>
        )}
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
            type="text"
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
            type="text"
            placeholder="Pass-Out Year e.g., 2026"
            value={passOutYear}
            onChange={(e) => setPassOutYear(e.target.value)}
            style={{
              border: '1px solid #d1d5db',
              padding: '8px 12px',
              borderRadius: '4px',
              width: '144px',
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)'
            }}
          />
          <button
            onClick={fetchAttendanceData}
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
                }}>Roll No</th>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>Attended Classes</th>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>Percentage</th>
                <th style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb'
                }}>Extra Hours</th>
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
              ) : Object.keys(attendance).length > 0 ? (
                Object.entries(attendance).map(([rollNo, attended]) => {
                  const totalWithExtras = getTotalWithExtras(rollNo);
                  const extra = extraHours[rollNo] || 0;

                  return (
                    <tr key={rollNo} style={{
                      backgroundColor: 'transparent'
                    }}
                    onMouseOver={(e) => e.target.closest('tr').style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}
                    >
                      <td style={{
                        padding: '8px 16px',
                        border: '1px solid #e5e7eb'
                      }}>{rollNo}</td>
                      <td style={{
                        padding: '8px 16px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {totalWithExtras}/{totalClasses}
                      </td>
                      <td style={{
                        padding: '8px 16px',
                        border: '1px solid #e5e7eb',
                        fontWeight: '600'
                      }}>
                        {totalClasses
                          ? ((totalWithExtras / totalClasses) * 100).toFixed(2) + "%"
                          : "0%"}
                      </td>
                      <td style={{
                        padding: '8px 16px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <button
                            onClick={() => handleRemoveExtraHour(rollNo)}
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
                            −
                          </button>
                          <span>{extra}</span>
                          <button
                            onClick={() => handleAddExtraHour(rollNo)}
                            style={{
                              backgroundColor: '#2563eb',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

export default Dashboard;
