import React, { useEffect, useState } from "react";
import './vendorHome.css';
import BGIMG from '../../assets/web-images/bg1.jpg';
import { useNavigate } from 'react-router-dom';

const VendorHome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('jwtoken');
    console.log(token)
    if (!token) {
        throw new Error('No token found, please log in again.');
    }
      try {
        const res = await fetch("https://wemprod-b.onrender.com/get/vendor/profile", {
          method: "GET",
                headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },

          credentials:"include"
        });
        if (res.status === 200) {
          const data = await res.json();
          setProfile(data);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {

    const token = localStorage.getItem('jwtoken');
    console.log(token)
    if (!token) {
        throw new Error('No token found, please log in again.');
    }

      try {
        const res = await fetch('https://wemprod-b.onrender.com/get/vendors/venues', {
          method: "GET",
          headers:{
            'Authorization': `Bearer ${token}` 
          }
        });
        const data = await res.json();
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
        const token = localStorage.getItem('jwtoken');
    console.log(token)
      try {
        const res = await fetch('https://wemprod-b.onrender.com/get/vendors/services', {
          method: "GET",
          headers:{
            'Authorization': `Bearer ${token}` 
          }
        });
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleVenueClick = (id) => {
    navigate(`/vendor/venueDetail/${id}`);
  };

  const handleServiceClick = (id) => {
    navigate(`/vendor/serviceDetail/${id}`);
  };

  const handleDeleteVenue = async (inquiryId) => {
      const token = localStorage.getItem('jwtoken');
    console.log(token)
    if (!token) {
        throw new Error('No token found, please log in again.');
    }
    try {
      const response = await fetch(
        `https://wemprod-b.onrender.com/deleteVenueInquiry/${profile._id}/${inquiryId}`,
        { method: "DELETE",
        headers:{
            'Authorization': `Bearer ${token}` 
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete inquiry");
      }

      // Update UI after successful deletion
      setProfile(prevProfile => ({
        ...prevProfile,
        venueInquiry: prevProfile.venueInquiry.filter(inquiry => inquiry._id !== inquiryId),
      }));

      alert("Venue inquiry deleted successfully!");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Error deleting inquiry");
    }
  };
    

  const handleDeleteService = async (inquiryId) => {
    try {
      const response = await fetch(
        `https://wemprod-b.onrender.com/deleteServiceInquiry/${profile._id}/${inquiryId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete inquiry");
      }

      // Update UI after successful deletion
      setProfile(prevProfile => ({
        ...prevProfile,
        serviceInquiry: prevProfile.serviceInquiry.filter(inquiry => inquiry._id !== inquiryId),
      }));

      alert("Service inquiry deleted successfully!");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Error deleting inquiry");
    }
  };
    
  return (
    <div className="VH-main-div" style={{ backgroundImage: `url(${BGIMG})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
      <div className="VH-div-1">
        <div className="VH-div-1-banner">
          <h2>Welcome {profile.name}, nice to meet you!</h2>
          <p><strong>Contact No:</strong> {profile.contactNo}</p>
          <p><strong>Email:</strong> {profile.contactEmail}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>GST No:</strong> {profile.GstNo}</p>
        </div>

        <div className="VH-div-1-main">
          <div className="VH-div-1-venue">
            <h3>Venues</h3>
            {venues.length > 0 ? (
              <>
                <h6>Total Venues: {venues.length}</h6>
                <div className="VH-div-2-l">
                  {venues.map((venue) => (
                    <div key={venue._id} onClick={() => handleVenueClick(venue._id)} style={{ cursor: 'pointer' }}>
                      {venue.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No venues added yet.</p>
            )}
          </div>

          <div className="VH-div-1-service">
            <h3>Services</h3>
            {services.length > 0 ? (
              <>
                <h6>Total Services: {services.length}</h6>
                <div className="VH-div-2-r">
                  {services.map((service) => (
                    <div key={service._id} onClick={() => handleServiceClick(service._id)} style={{ cursor: 'pointer' }}>
                      {service.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No services added yet.</p>
            )}
          </div>
        </div>


        <h3>Inquiries</h3>

        <div className="VH-inquiries">
          <div className="VH-inquiries-list">
            {profile.venueInquiry.map((inquiry) => (
              <div key={inquiry._id} className="VH-inquiry-card ">
                <h5>Venue Inquiry</h5>
                <p><strong>Name:</strong> {inquiry.userName}</p>
                <p><strong>For Venue : </strong>{inquiry.venueName}</p>
                <p><strong>Contact:</strong> {inquiry.contactNumber}</p>
                <p><strong>Email:</strong> {inquiry.contactEmail}</p>
                <p><strong>Message:</strong> {inquiry.message}</p>
                <button onClick={() => handleDeleteVenue(inquiry._id)}>Delete</button>
              </div>
            ))}
            {profile.serviceInquiry.map((inquiry) => (
              <div key={inquiry._id} className="VH-inquiry-card ">
                <h5>Service Inquiry</h5>
                <p><strong>Name:</strong> {inquiry.userName}</p>
                <p><strong>Contact:</strong> {inquiry.contactNumber}</p>
                <p><strong>Email:</strong> {inquiry.contactEmail}</p>
                <p><strong>Message:</strong> {inquiry.message}</p>
                <button onClick={() => handleDeleteService(inquiry._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHome;
