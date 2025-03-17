import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams, useNavigate } from "react-router-dom";
import "./servicePage.css";

const ServicePage = () => {
  const { state } = useContext(UserContext);
  const { user } = state;
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [loader, setLoader] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Inquiry Form State
  const [inquiry, setInquiry] = useState({
    userName: "",
    contactNumber: "",
    contactEmail: "",
    message: ""
  });
  const [inquiryStatus, setInquiryStatus] = useState(null);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    date: "",
    eventType: "",
    eventDesc: "",
    contactNo: "",
    name: "",
    location:""
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`https://wemprod-b.onrender.com/get/servicesByID/${serviceId}`, {
          method: "GET"
        });
        const data = await res.json();
        setService(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        setLoader(false);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [serviceId]);

  // Inquiry handlers
  const handleInputChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus("Submitting...");

    try {
      const response = await fetch("https://wemprod-b.onrender.com/add/service/inquiry", {
        method: "POST",
        headers: { 
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: serviceId,
          serviceName: service.name,
          vendorId: service.vendorId,
          ...inquiry
        })
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

  // Booking handlers
  const handleBookingInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookNow = async () => {
    if (!user) {
      alert("Please log in first to book a service.");
      navigate("/login");
      return;
    }
    if (!service) return;
    if (!selectedPlan) {
      alert("Please select a plan first.");
      return;
    }
    if (!bookingData.date || !bookingData.eventType || !bookingData.eventDesc) {
      alert("Please fill in all booking details.");
      return;
    }

    try {
      const response = await fetch("https://wemprod-b.onrender.com/add/booking/service", {
        method: "POST",
        headers: { 
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({
          name: bookingData.name,
          ServiceId: service._id,
          contactNo: bookingData.contactNo,
          ServiceName: service.name,
          vendorId: service.vendorId,
          date: bookingData.date,
          amount: selectedPlan.price.$numberInt || selectedPlan.price,
          location: bookingData.location,
          eventType: bookingData.eventType,
          eventDesc: bookingData.eventDesc,
          planId: selectedPlan._id,
          planName: selectedPlan.planName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Booking successful!");
        // Reset form and plan selection
        setBookingData({ date: "", eventType: "", eventDesc: "", contactNo: "", name: "" });
        setSelectedPlan(null);
      } else {
        alert(`Booking failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error booking service:", error);
      alert("An error occurred while booking.");
    }
  };

  if (loader) {
    return <p className="text-center text-gray-500">Loading service details...</p>;
  }

  return (
    <div className="SP-service-container">
      <div className="SP-service-title-div">
        <h2 className="SP-venue-title">{'Service Name: ' + service.name}</h2>
      </div>
      <img
        src={"https://wemprod-b.onrender.com" + selectedImage}
        alt={service.name}
        className="SP-service-image"
      />
      <div className="SP-image-list">
        {service.images.map((img, index) => (
          <img
            key={index}
            src={"https://wemprod-b.onrender.com" + img}
            alt="Service Thumbnail"
            className="thumbnail"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
      <p><strong>Vendor Name: </strong>{service.vendorName ? service.vendorName : "Not Available"}</p>
      <h5><strong>Description</strong></h5>
      <p className="SP-service-description">{service.description}</p>

      <h5><strong>Plans</strong></h5>
      <div className="SP-plans-container">
        {service.plans.map((plan, index) => (
          <div
            key={index}
            className={`SP-plan-card ${selectedPlan && selectedPlan._id === plan._id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan)}
            style={{ cursor: "pointer" }}
          >
            <h6 className="SP-plan-name">{plan.planName}</h6>
            <p className="SP-plan-description">{plan.description}</p>
            <p className="SP_plan-price">
              Price: {plan.price.$numberInt ? plan.price.$numberInt : plan.price}
            </p>
          </div>
        ))}
      </div>

      <p className="SP-service-location">
        <strong>Location: </strong>{service.location || "Not Available"}
      </p>

      {/* Booking Form */}
      <div className="VP-booking-container">
        <h2>Book This Service</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={bookingData.name}
          onChange={handleBookingInputChange}
          required
        />
        <input
          type="text"
          name="contactNo"
          placeholder="Contact No"
          value={bookingData.contactNo}
          onChange={handleBookingInputChange}
          required
        />
        <textarea
          name="location"
          placeholder="Event Address ..."
          value={bookingData.location}
          onChange={handleBookingInputChange}
          required
        ></textarea>
        <input
          type="date"
          name="date"
          value={bookingData.date}
          onChange={handleBookingInputChange}
          required
        />
        <select
          name="eventType"
          value={bookingData.eventType}
          onChange={handleBookingInputChange}
          required
        >
          <option value="">Select Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Corporate">Corporate Event</option>
          <option value="Birthday">Birthday Party</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          name="eventDesc"
          placeholder="Describe your event..."
          value={bookingData.eventDesc}
          onChange={handleBookingInputChange}
          required
        ></textarea>
        <button onClick={handleBookNow}> Book Now </button>
      </div>

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
