import React from 'react';
import './stx.css';

const ServiceTypeCard2 = ({ name, vendorName, image  , price ,description}) => {
  const desc = description.split(" ").slice(0, 20).join(" ");

  return (
    <div className="Service-card">
      <div>
      <img src={"https://wemprod-b.onrender.com"+image} alt={name} className="Service-card-image" />
      </div>
      <div>
      <div className="Service-card-info">
        <h1 className="Service-card-title">Service : {name}</h1>
        <h2 className="Service-card-price">Price : {price}</h2>
        <h3 className="Service-card-vendor"><strong>Vendor : </strong> {vendorName}</h3>
        <h3 className="Service-card-desc"><strong>Description : {desc} ...</strong></h3>
      </div>

      </div>
     
      
    </div>
  );
};

export default ServiceTypeCard2;
