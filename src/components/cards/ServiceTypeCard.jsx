import React from 'react';
import './ServiceTypeCard.css';

const ServiceTypeCard = ({ name, vendorName, image }) => {
    console.log(name, vendorName)
  return (
    <div className="service-card">
      <img src={"http://192.168.0.107:5000"+image} alt={name} className="service-card-image" />
      <div className="service-card-info">
        <h3 className="service-card-title">{name}</h3>
        <p className="service-card-vendor"><strong>Vendor : </strong> {vendorName}</p>
      </div>
    </div>
  );
};

export default ServiceTypeCard;
