import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import './vsv.css'
import { useNavigate } from "react-router-dom";

const ServiceDetails = () => {

        const navigate = useNavigate();
      const { serviceId } = useParams(); // Get venueId from URL
      const [service , setService] = useState(null)
      const [loader , setLoader] = useState(true)
  const [selectedImage, setSelectedImage] = useState(service ? service?.images[0] : "");

  useEffect(()=>{

    const fetchService = async () => {
      const token = localStorage.getItem('jwtoken');
    console.log(token)
    if (!token) {
        throw new Error('No token found, please log in again.');
    }

        try {
            const res = await fetch(`https://wemprod-b.onrender.com/get/servicesByID/${serviceId}`, {
                method: "GET",
                headers:{
                  'Authorization': `Bearer ${token}` 
                }
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
  if (!service) {
    return <p className="text-center text-gray-500">Loading service details...</p>;
  }

  return (
    <div className="service-container">
      {/* Service Name */}

      <div className="service-title-div">
        <h2 className="venue-title">{'Service Name : ' +service.name} </h2> 
        <button onClick={()=>{navigate(`/edit/service/${serviceId}`)}} className="edit-button">Edit</button>
         

        </div>

      {/* Main Image Display */}
      <img
        src={"https://wemprod-b.onrender.com" + selectedImage}
        alt={service.name}
        className="service-image-s"
      />

      {/* Image Thumbnail List */}
      <div className="image-list">
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

    <p><strong>Vendor Name : </strong>{service.vendorName ?service.vendorName : "Not Available"}</p>
      {/* Description */}
      <h5><strong>Description</strong></h5>
      <p className="service-description">{service.description}</p>

      {/* Plans */}
      <h5><strong>Plans</strong></h5>
      <div className="plans-container-s">
        {service.plans.map((plan, index) => (
          <div key={index} className="plan-card-s">
            <h6 className="plan-name">{plan.planName}</h6>
            <p className="plan-description">{plan.description}</p>
            <p className="plan-price">Price: {plan.price}</p>
          </div>
        ))}
      </div>

      {/* Location */}
     
      <p className="service-location"><strong>Location : </strong>{service.location || "Not Available"}</p>
    </div>
  );
};

export default ServiceDetails;
