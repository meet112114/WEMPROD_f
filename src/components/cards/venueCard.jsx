import React from 'react';
import './venueCard.css'; // Optional: Add styles for the card

const VenueCard = ({ name, price, venueType, image }) => {
  return (
    <div className="venue-card">
      <img src={"https://ecomprodb.onrender.com" + image} alt={name} className="venue-card-image" />
      <div className="venue-card-details">
        <h3 className="venue-card-name">{name}</h3>
        <p className="venue-card-price">Price: ₹{price}</p>
        <p className="venue-card-type">Type: {venueType}</p>
      </div>
    </div>
  );
};

export default VenueCard;
