import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import VenueCard2 from '../../components/cards/venueCard2/vct';
import './venueCat.css';
import { UserContext } from '../../App'; 
import CitySelector from "../../components/locationCard/locationCard";

const VenuesCat = () => {
  const { state } = useContext(UserContext);
  const { location } = state;
  const navigate = useNavigate();
  const { venueType } = useParams(); 
  const [venues, setVenues] = useState([]); 
  const [filteredVenues, setFilteredVenues] = useState([]); 

  console.log(venueType , location)

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllVenue');
        const data = await res.json();
        let acceptedVenues = data.filter(venue => venue.status === "accepted");

        // Filter by venueType (venue.tags should contain venueType)
        acceptedVenues = acceptedVenues.filter(venue => venue.tags.includes(venueType));

        // Further filter by location if selected
        if (location) {
          acceptedVenues = acceptedVenues.filter(venue => 
            venue.location?.toLowerCase() === location.toLowerCase()
          );
        }

        setVenues(acceptedVenues);
        setFilteredVenues(acceptedVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, [venueType, location]); // Re-fetch when venueType or location changes

  return (
    <div className="venueCatpage">
      <div className='city-selector-containe'>
      <CitySelector />
      </div>


      <div className="venueCat-list">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <div key={venue._id} onClick={() => navigate(`/venuePage/${venue._id}`)}>
              <VenueCard2
                name={venue.name}
                price={venue.basePrice}
                vendorName={venue.vendorName}
                image={venue.images[0]} 
                description={venue.venueDecs}
              />
            </div>
          ))
        ) : (
          <p>No venues found</p>
        )}
      </div>
    </div>
  );
};

export default VenuesCat;
