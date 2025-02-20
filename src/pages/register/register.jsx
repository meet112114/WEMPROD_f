import React , { useState} from 'react'
import "./register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [RegisterformData, setRegisterformData] = useState({
    name: "",
    email: "",
    password: "",
    accType: "client",
  });
  const navigate = useNavigate();

  const handleChangeReg = (e) => {
    const { name, value } = e.target;
    setRegisterformData({
      ...RegisterformData,
      [name]: value,
    });
  };

  const RegisterSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://wemprod-b.onrender.com/register/client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(RegisterformData),
    });

    const data = res.json();
    console.log(data);

    if (res.status === 402 || !data) {
      console.log("invalid credenials");
    } else if (res.status === 400) {
      console.log("account linked with google");
    } else if (res.status === 401) {
      console.log("user is already registered with this email");
    } else {
      window.alert("registered successfully");
      console.log("registered successfully");
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="mainFrame">
        <div className="title">Registration </div>
        <div className="register">
          <input
            className="inputs"
            type="text"
            name="name"
            id="name"
            placeholder="name"
            value={RegisterformData.name}
            onChange={handleChangeReg}
          />
          <input
            className="inputs"
            type="text"
            name="email"
            id="email"
            placeholder="email"
            value={RegisterformData.email}
            onChange={handleChangeReg}
          />
          <input
            className="inputs"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={RegisterformData.password}
            onChange={handleChangeReg}
          />
          <div className="reg">
            <button
              className="reg-button"
              type="submit"
              name="signin"
              value="Log in"
              onClick={RegisterSubmit}
            >
              Register
            </button>
          </div>
          <a className="a-link" href="/login">
            I am a member
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
