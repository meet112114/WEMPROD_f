import React, { useState, useContext } from 'react';
import GoogleIcon from "../../assets/images/google-icon.png";
import { UserContext } from '../../App';
import './login.css';
import { useNavigate } from 'react-router-dom';
import BGIMG from '../../assets/images/bg3.jpg';

const Login = () => {
  const [LoginformData, setLoginformData] = useState({ email: '', password: '', accType: "client" });
  const [errorMessage, setErrorMessage] = useState(""); // Error state
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
    setErrorMessage(""); // Reset error before request

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
        setErrorMessage("⚠ Email is registered as a vendor account.");
      } else if (res.status === 404) {
        setErrorMessage("⚠ User not found. Please register first.");
      } else if (res.status === 200) {
        dispatch({ type: "USER_LOGIN", payload: true });
        alert("Login successful");
        navigate('/');
      } else {
        setErrorMessage("⚠ Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("⚠ Internal server error. Please try again.");
    }
  };

  return (
    <div className="UL-body" style={{
      backgroundImage: `url(${BGIMG})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
      <div className='Main-frame'>
        <div className='title'>Login</div>
        <div className='login'>
          <input
            className='inputs'
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            value={LoginformData.email}
            onChange={handleChange}
          />
          <input
            className='inputs'
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={LoginformData.password}
            onChange={handleChange}
          />
          {/* Show error message if login fails */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="log">
            <input className='log-button' type="submit" name="signin" value="Log in" onClick={LoginSubmit} />
          </div>
        </div>

        {/* Google Login */}
        {/* <div className='google-login'>
          <a className='google-link' href="https://wemprod-b.onrender.com/auth/google">
            <div className='google-button'>
              <img className="google-img" src={GoogleIcon} alt="Google Icon" />
              <div className='google-text'>Sign In With Google</div>
            </div>
          </a>
        </div> */}

        <a className='a-link' href="/register">I am not a member</a>
      </div>
    </div>
  );
};

export default Login;
