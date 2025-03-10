import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './vvv.css'
import { useNavigate } from "react-router-dom";

const VenueDetails = () => {
    const navigate = useNavigate();
  const { venueId } = useParams(); // Get venueId from URL
  const [venue, setVenue] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); 

  // Fetch Venue Data
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`https://wemprod-b.onrender.com/get/venueByID/${venueId}` , {
            method:"GET",
            credentials:"include"
        });
        const data = await response.json()
        console.log(data)
        setVenue(data);

        setLoading(false);
        setSelectedImage(data.images[0])
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`https://wemprod-b.onrender.com/get/serviceById/${venueId}`,{
            method:"GET",
            credentials:"include"
        });
        const data = await response.json()
        console.log(data)
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
      }
    };

    fetchVenue();
    fetchServices();
  }, [venueId]);

  // Accept Service
  const acceptService = async (serviceID) => {
    try {
      await fetch("https://wemprod-b.onrender.com/accept/service", {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({venueId , serviceID})
        });
      setServices((prev) =>
        prev.map((s) =>
          s._id === serviceID
            ? { ...s, venueList: s.venueList.map((v) => v.venueId === venueId ? { ...v, status: "true" } : v) }
            : s
        )
      );
    } catch (error) {
      console.error("Error accepting service:", error);
    }
  };

  // Reject Service
  const rejectService = async (serviceID) => {
    try {
      await fetch("https://wemprod-b.onrender.com/reject/service",
         {
            method:"POST",
            credentials:"include",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({venueId , serviceID})
             });
      setServices((prev) => prev.filter((s) => s._id !== serviceID));
    } catch (error) {
      console.error("Error rejecting service:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="venue-container">
      {venue && (
        <>
        <div className="venue-title-div">
        <h2 className="venue-title">{'Venue Name : ' +venue.name} </h2> 
        <button onClick={()=>{navigate(`/edit/venue/${venueId}`)}} className="edit-button">Edit</button>
         

        </div>
          

          {/* Main Image Display */}
          <img src={"https://wemprod-b.onrender.com" + selectedImage} alt={venue.name} className="venue-image" />

          {/* Image Thumbnail List */}
          <div className="image-list">
            {venue.images.map((img, index) => (
              <img
                key={index}
                src={"https://wemprod-b.onrender.com" + img}
                alt="Venue Thumbnail"
                className={`thumbnail ${selectedImage === img ? "selected" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </>
      )}
            <h5>{"Base Price: " + (venue.basePrice ?? "Not Available")}</h5>

          <h5>{"VenueType : " + venue.venueType}</h5>
            <h5>{"Address : " + venue.address}</h5>


            <h5>Tags</h5>

            <div className="tags-container">
            {venue.tags.map((v , index)=>(
                <div key={index}className="tags">
                    <h6>{v}</h6>
                </div>
            ))}
            </div>

            <h5>Description</h5>
          <p className="venue-description">{venue.venueDecs}</p>
          

      <div className="Service-acc-rej">
      {/* Accepted Services */}
      <div className="service-section">
        <h3 className="accepted-title">✅ Accepted Services</h3>
        <div className="service-grid">
          {services
            .filter((s) => s.venueList.some((v) => v.venueId === venueId && v.status === "true"))
            .map((service) => (
              <div key={service._id} className="accepted-service">
                <p className="service-name">{service.name}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Pending Services */}
      <div className="service-section">
        <h3 className="pending-title">❌ Pending Services</h3>
        <div className="service-grid">
          {services
            .filter((s) => s.venueList.some((v) => v.venueId === venueId && v.status === "false"))
            .map((service) => (
              <div key={service._id} className=" pending-service">
                <p className="service-name">{service.name}</p>
                <img src={"http://localhost:5000" + service.images[0]} alt={service.name} className="service-image" />
           
                <div className="button-group">
                  <button onClick={() => acceptService(service._id)} className="btn btn-accept">
                    Accept
                  </button>
                  <button onClick={() => rejectService(service._id)} className="btn btn-reject">
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      </div>

    </div>
  );
};

export default VenueDetails;
