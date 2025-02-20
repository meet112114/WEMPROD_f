import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import './servicePage.css'
import { useNavigate } from "react-router-dom";

const ServicePage = () => {

        const navigate = useNavigate();
      const { serviceId } = useParams(); // Get venueId from URL
      const [service , setService] = useState(null)
      const [loader , setLoader] = useState(true)
  const [selectedImage, setSelectedImage] = useState(service ? service?.images[0] : "");


    const [inquiry, setInquiry] = useState({
      userName: "",
      contactNumber: "",
      contactEmail: "",
      message: ""
    });
    const [inquiryStatus, setInquiryStatus] = useState(null);

  useEffect(()=>{

    const fetchService = async () => {
        try {
            const res = await fetch(`https://wemprod-b.onrender.com/get/servicesByID/${serviceId}`, {
                method: "GET",
            });
            const data = await res.json();
            setSelectedImage(data.images[0])
            setService(data);
            setLoader(false);
        } catch (error) {
            console.error('Error fetching service:', error);
        }
    };
    fetchService();

  },[])

  const handleInputChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus("Submitting...");

    try {
      const response = await fetch("https://wemprod-b.onrender.com/add/service/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: serviceId, serviceName: service.name ,   vendorId:service.vendorId , ...inquiry })
      });

      const data = await response.json();
      if (response.ok) {
        setInquiryStatus("Inquiry submitted successfully!");
        setInquiry({ userName: "", contactNumber: "", contactEmail: "", message: "" });
      } else {
        setInquiryStatus(data.error || "Failed to submit inquiry.");
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setInquiryStatus("An error occurred. Please try again.");
    }
  };


  if (!service) {
    return <p className="text-center text-gray-500">Loading service details...</p>;
  }

  return (
    <div className="SP-service-container">

      <div className="SP-service-title-div">
        <h2 className="SP-venue-title">{'Service Name : ' +service.name} </h2> 

        </div>
      <img
        src={"http://192.168.0.107:5000" + selectedImage}
        alt={service.name}
        className="SP-service-image"
      />

      <div className="SP-image-list">
        {service.images.map((img, index) => (
          <img
            key={index}
            src={"https://wemprod-b.onrender.com" + img}
            alt="SP-Service Thumbnail"
            className="thumbnail"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

    <p><strong>Vendor Name : </strong>{service.vendorName ?service.vendorName : "Not Available"}</p>

      <h5><strong>Description</strong></h5>
      <p className="SP-service-description">{service.description}</p>

    
      <h5><strong>Plans</strong></h5>
      <div className="SP-plans-container">
        {service.plans.map((plan, index) => (
          <div key={index} className="SP-plan-card">
            <h6 className="SP-plan-name">{plan.planName}</h6>
            <p className="SP-plan-description">{plan.description}</p>
            <p className="SP_plan-price">Price: {plan.price}</p>
          </div>
        ))}
      </div>

      {/* Location */}
     
      <p className="SP-service-location"><strong>Location : </strong>{service.location || "Not Available"}</p>

       {/* Inquiry Form */}
       <div className="SP-inquiry-container">
        <h2>Send Inquiry</h2>
        <form className="SP-inquiry-form" onSubmit={handleInquirySubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Your Name"
            value={inquiry.userName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={inquiry.contactNumber}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Email (Optional)"
            value={inquiry.contactEmail}
            onChange={handleInputChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={inquiry.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit">Send Inquiry</button>
          {inquiryStatus && <p className="inquiry-status">{inquiryStatus}</p>}
        </form>
      </div>

    </div>

    
  );
};

export default ServicePage;
