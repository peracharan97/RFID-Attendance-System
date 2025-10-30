import React from "react";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '20px',
      borderBottom: '2px solid #d1d5db',
      position: 'relative'
    }}>
      {/* Logo & Institute Details */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="Institute Logo" style={{ height: '112px', marginRight: '16px' }} />
        </a>
        <div style={{ lineHeight: '1.25' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#047857'
          }}>
            Prasad V. Potluri Siddhartha Institute of Technology
          </h1>
          <h2 style={{
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#1f2937',
            marginTop: '4px'
          }}>
            (Autonomous)
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#4b5563',
            marginTop: '4px'
          }}>
            Approved by AICTE and Affiliated to JNTU Kakinada
          </p>
          <p style={{
            fontSize: '14px',
            color: '#4b5563'
          }}>
            Sponsored by: Siddhartha Academy of General and Technical Education, Vijayawada
          </p>
        </div>
      </div>

      {/* EAMCET Code */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          color: '#047857',
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          EAMCET Code: PPSV
        </div>
      </div>

      {/* Optional Login Button */}
      {/* <a href="/login" style={{
        position: 'absolute',
        top: '20px',
        right: '32px',
        backgroundColor: '#d1d5db',
        color: 'black',
        padding: '8px 16px',
        borderRadius: '4px',
        fontWeight: 'bold'
      }}>
        Login
      </a> */}
    </header>
  );
};

export default Header;
