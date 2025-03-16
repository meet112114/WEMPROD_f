import React, { useState, useContext } from 'react';
import GoogleIcon from "../../assets/images/google-icon.png";
import { UserContext } from '../../App';
import './vendorLogin.css';
import { useNavigate } from 'react-router-dom';
import BGIMG from '../../assets/web-images/vendor-bg.jpg';

const VendorLogin = () => {
  const [LoginformData, setLoginformData] = useState({ email: '', password: '', accType: "vendor" });
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginformData({
      ...LoginformData,
      [name]: value,
    });
  };

  const LoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before making the request

    try {
      const res = await fetch('https://wemprod-b.onrender.com/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(LoginformData)
      });

      const data = await res.json();
      const token = data.token; // Extract token
        localStorage.setItem('jwtoken', token);

      if (res.status === 400) {
        setErrorMessage("⚠ All fields are required.");
      } else if (res.status === 401) {
        setErrorMessage("⚠ Invalid credentials. Please check your email or password.");
      } else if (res.status === 403) {
        setErrorMessage("⚠ Email is registered as a consumer account.");
      } else if (res.status === 404) {
        setErrorMessage("⚠ User not found. Please register first.");
      } else if (res.status === 200) {
        dispatch({ type: "VENDOR_LOGIN", payload: true });
        alert("Login successful");
        navigate('/vendorHome');
      } else {
        setErrorMessage("⚠ Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("⚠ Internal server error. Please try again.");
    }
  };

  return (
    <div className='VL_body' style={{
      backgroundImage: `url(${BGIMG})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
      <div className='vMain-frame'>
        <div className='vtitle'>Vendor Login</div>
        <div className='login'>
          <input
            className='vinputs'
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            value={LoginformData.email}
            onChange={handleChange}
          />
          <input
            className='vinputs'
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={LoginformData.password}
            onChange={handleChange}
          />
          {/* Show error message if there's an issue */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="vlog">
            <input className='vlog-button' type="submit" name="signin" value="Log in" onClick={LoginSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
