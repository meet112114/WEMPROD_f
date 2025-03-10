import React from 'react';
import './vct.css'; // Optional: Add styles for the card

const VenueCard2 = ({ name, price, vendorName, image ,description}) => {
    const desc = description.split(" ").slice(0, 20).join(" ");

    return (
      <div className="Venue-card">
        <div>
        <img src={"https://wemprod-b.onrender.com"+image} alt={name} className="Venue-card-image" />
        </div>
        <div>
        <div className="Venue-card-info">
          <h1 className="Venue-card-title">Venue : {name}</h1>
          <h2 className="Venue-card-price">Price : {price}</h2>
          <h3 className="Venue-card-vendor"><strong>Vendor : </strong> {vendorName}</h3>
          <h3 className="Venue-card-desc"><strong>Description : {desc} ...</strong></h3>
        </div>
  
        </div>
       
        
      </div>
    );
};

export default VenueCard2;
