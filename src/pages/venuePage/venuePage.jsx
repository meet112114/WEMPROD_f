import React, { useEffect, useState , useContext } from "react";
import { useParams } from "react-router-dom";
import './venuePage.css';
import { UserContext } from '../../App';
import { useNavigate } from "react-router-dom";

const VenuePage = () => {

  const  {state , dispatch} = useContext( UserContext);
  const { user } = state;  // Extract user from state
  const navigate = useNavigate();
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Inquiry Form State
  const [inquiry, setInquiry] = useState({
    userName: "",
    contactNumber: "",
    contactEmail: "",
    message: ""
  });

  const [inquiryStatus, setInquiryStatus] = useState(null);

  const [bookingData, setBookingData] = useState({
    date: "",
    eventType: "",
    eventDesc: "",
    contactNo:"",
    name:""
  });
  

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        console.log(id);
        const response = await fetch(`https://wemprod-b.onrender.com/get/venueByID/${id}`, {
          method: "GET",
        });
  
        const data = await response.json();
        console.log(data);
        setVenue(data);
        setLoading(false);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };
  
    const fetchServices = async () => {
      try {
        const response = await fetch(`https://wemprod-b.onrender.com/get/serviceById/${id}`, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
  
    fetchVenue();
    fetchServices();
  }, [id]); // Ensures the effect runs when `id` changes
  
  
  const handleInputChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus("Submitting...");

    try {
      const response = await fetch("https://wemprod-b.onrender.com/add/venue/inquiry", {
        method: "POST",
        headers: { 
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: id, venueName:venue.name , vendorId:venue.vendorId , ...inquiry })
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

  const handleBookingInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };
  

  const handleBookNow = async () => {
    if (!user) {
      alert("Please log in first to book a venue.");
      navigate("/login");  // Redirect user to login page
      return;
    }

    if (!venue) return;
  
    if (!bookingData.date || !bookingData.eventType || !bookingData.eventDesc) {
      alert("Please fill in all booking details.");
      return;
    }
  
    try {
      const response = await fetch("https://wemprod-b.onrender.com/add/booking/venue", {
        method: "POST",
  headers: { 
           Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" },
        body: JSON.stringify({
          name : bookingData.name,
          venueId: id,
          contactNo:bookingData.contactNo,
          venueName: venue.name,
          vendorId: venue.vendorId,
          date: bookingData.date,
          amount: venue.basePrice ?? 0,
          location: venue.address,
          eventType: bookingData.eventType,
          eventDesc: bookingData.eventDesc
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Booking successful!");
        setBookingData({ date: "", eventType: "", eventDesc: "" }); // Reset form
      } else {
        alert(`Booking failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error booking venue:", error);
      alert("An error occurred while booking.");
    }
  };
  

  
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="VP-venue-container">
      {venue && (
        <>
          <div className="VP-venue-title-div">
            <h1 className="venue-title">{ venue.name}</h1>
          </div>

          <img src={"https://wemprod-b.onrender.com" + selectedImage} alt={venue.name} className="venue-image" />

          <div className="VP-image-list">
            {venue.images.map((img, index) => (
              <img
                key={index}
                src={"https://wemprod-b.onrender.com" + img}
                alt="Venue Thumbnail"
                className={`VP-thumbnail ${selectedImage === img ? "selected" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </>
      )}
      
      <div className="VP-basic-info">
        <h5>{"Base Price : " + (venue.basePrice ?? "Not Available")}</h5>
        <h5>{"VenueType : " + venue.venueType}</h5>
        <h5>{"Address : " + venue.address}</h5>
      </div>

      <h5>Tags</h5>
      <div className="VP-tags-container">
        {venue.tags.map((v, index) => (
          <div key={index} className="tags">
            <h6>{v}</h6>
          </div>
        ))}
      </div>

      <h5>Description</h5>
      <p className="VP-venue-description">{venue.venueDecs}</p>

      <div className="VP-booking-container">
  <h2>Book This Venue</h2>
  <input
    type="text"
    name="name"
    placeholder="Name "
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
      <div className="VP-inquiry-container">
        <h2>Send Inquiry</h2>
        <form className="VP-inquiry-form" onSubmit={handleInquirySubmit}>
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

      <div className="services-banner">
        <h1>Services in {venue.name}</h1>
      </div>

      <div className="VP-services-sec">
        {services
          .filter((s) => s.venueList.some((v) => v.venueId === id && v.status === "true"))
          .map((service) => (
            <div key={service._id} className="VP-service" onClick={() => navigate(`/servicePage/${service._id}`)}>
              <img className="VP-service-image" src={"http://localhost:5000" + service.images[0]} alt={service.name} />
              <p className="VP-service-name"><strong>Service Name : </strong>{service.name}</p>
              <p><strong>Vendor Name : </strong>{service.vendorName ? service.vendorName : "Not Available"}</p>
              <p><strong>No Of Plans : </strong>{service.plans.length}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VenuePage;
