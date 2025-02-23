import React , { useState , useContext} from 'react'
import GoogleIcon from "../../assets/images/google-icon.png"
import { UserContext } from '../../App';
import './vendorLogin.css';
import { useNavigate } from 'react-router-dom';

const VendorLogin = () => {

    
  const [LoginformData, setLoginformData] = useState({ email: '', password: '' , accType:"vendor"});
  const  {state , dispatch} = useContext( UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginformData({
      ...LoginformData,
      [name]: value,
    });
    }

   const LoginSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('https://wemprod-b.onrender.com/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(LoginformData)
        });

        const data = await res.json();
        console.log("Full response data:", data); // 🔍 Log full response

        if (!data || !data.token) {
            console.error("Error: Token not found in response.");
        }

        if (res.status === 400) {
            console.log("Invalid credentials");
        } else if (res.status === 401) {
            console.log("Account linked with Google");
        } else if (res.status === 403) {
            window.alert("Email is registered as a consumer account");
            console.log("Email is registered as a consumer account");
        } else if (res.status === 200 && data.token) {
            console.log("Extracted Token:", data.token); // 🔍 Log extracted token
            localStorage.setItem('jwtoken', data.token);
            console.log('Token stored in localStorage:', localStorage.getItem('jwtoken'));
            dispatch({ type: "VENDOR_LOGIN", payload: true });
            window.alert("Login successful");
            navigate('/vendorHome');
        } else {
            console.log('Error');
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
};


  return (
    <>
    <div className='Main-frame'>
    <div className='title'>Vendor Login </div>
            <div className='login'>
                <input className='inputs' type="text" name="email" id="email" placeholder="email" value={LoginformData.email} onChange={handleChange} />
                <input className='inputs' type="password" name="password" id="password" placeholder="Password" value={LoginformData.password} onChange={handleChange}  />
                <div className="log">
                    <input className='log-button' type="submit" name="signin" value="Log in" onClick={LoginSubmit} />
                </div>
            </div>

            <a className='a-link' href="/vendorRegister">I am not a member</a>
        </div>
    </>
    
  )
}


export default VendorLogin
