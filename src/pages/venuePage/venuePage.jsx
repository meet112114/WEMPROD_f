import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './venuePage.css';
import { useNavigate } from "react-router-dom";

const VenuePage = () => {
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

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        console.log(id);
        const response = await fetch(`https://wemprod-b.onrender.com/get/venueByID/${id}`, {
          method: "GET"
        });
        const data = await response.json();
        console.log(data);
        setVenue(data);
        setLoading(false);
        setSelectedImage(data.images[0]);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`https://wemprod-b.onrender.com/get/serviceById/${id}`, {
          method: "GET"
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
  }, [id]);

  const handleInputChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus("Submitting...");

    try {
      const response = await fetch("https://wemprod-b.onrender.com/add/venue/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              <img className="VP-service-image" src={"https://wemprod-b.onrender.com" + service.images[0]} alt={service.name} />
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
