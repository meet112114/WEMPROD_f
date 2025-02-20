
import React, { useState } from 'react';
import './vendorRegister.css';
import { useNavigate } from 'react-router-dom';

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    accType: 'vendor',
    name: '',
    email: '',
    password: '',
    contactNo: '',
    contactEmail: '',
    location: '',
    GstNo: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://wemprod-b.onrender.com/register/vendor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.status === 201) {
      alert('Registration successful');
      navigate('/vendorLogin');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <>
      <div className='V-Main-frame'>
        <div className='title'>Vendor Registration</div>
        <form className='login' onSubmit={handleSubmit}>
          <input
            className='V-inputs'
            type='text'
            name='name'
            placeholder='Name*'
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className='V-inputs'
            type='email'
            name='email'
            placeholder='Email*'
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className='V-inputs'
            type='password'
            name='password'
            placeholder='Password*'
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className='V-inputs'
            type='text'
            name='contactNo'
            placeholder='Contact Number*'
            value={formData.contactNo}
            onChange={handleChange}
          />
          <input
            className='V-inputs'
            type='email'
            name='contactEmail'
            placeholder='Contact Email*'
            value={formData.contactEmail}
            onChange={handleChange}
          />
         <select
  className="V-inputs"
  name="location"
  value={formData.location}
  onChange={handleChange}
>
  <option value="" disabled>Select Location*</option>
  <option value="mumbai">Mumbai</option>
  <option value="pune">Pune</option>
</select>
          <input
            className='V-inputs'
            type='text'
            name='GstNo'
            placeholder='GST Number*'
            value={formData.GstNo}
            onChange={handleChange}
          />

          <div className='log'>
            <input
              className='log-button'
              type='submit'
              value='Register'
            />
          </div>
        </form>

        <a className='a-link' href='/vendorLogin'>Already a member? Log in</a>
      </div>
    </>
  );
};

export default VendorRegister;
