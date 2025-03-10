import React, { useState, useEffect } from 'react';
import VenueCard from '../../components/cards/venueCard';
import './venuesC.css';
import { useNavigate } from 'react-router-dom';

const VenuesC = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]); // All venues
  const [filteredVenues, setFilteredVenues] = useState([]); // Filtered venues
  // const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility
  const [filters, setFilters] = useState({
    priceRange: '',
    types: [],
    tags: []
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllVenue');
        const data = await res.json();
        const acceptedVenues = data.filter(venue => venue.status === "accepted");
        setVenues(acceptedVenues);
        setFilteredVenues(acceptedVenues); // Initialize with accepted venues
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => {
      let updatedFilters = { ...prev };
      if (type === "checkbox") {
        if (name === "tags") {
          updatedFilters.tags = checked
            ? [...prev.tags, value]
            : prev.tags.filter((tag) => tag !== value);
        } else if (name === "types") {
          updatedFilters.types = checked
            ? [...prev.types, value]
            : prev.types.filter((type) => type !== value);
        }
      } else {
        updatedFilters[name] = value;
      }

      return updatedFilters;
    });
  };

  useEffect(() => {
    let updatedVenues = [...venues];

    if (filters.priceRange && filters.priceRange.includes("-")) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      updatedVenues = updatedVenues.filter(
        (venue) => venue.basePrice >= min && venue.basePrice <= max
      );
    }

    if (filters.tags.length > 0) {
      updatedVenues = updatedVenues.filter((venue) =>
        filters.tags.every(tag => venue.tags.includes(tag))
      );
    }
    if (filters.types.length > 0) {
      updatedVenues = updatedVenues.filter((venue) =>
        filters.types.includes(venue.venueType)
      );
    }

  

    setFilteredVenues(updatedVenues);
  }, [filters, venues]);

  return (
    <div className="venueCpage">
      
      {/* Button to toggle filters */}
      {/* <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button> */}

      {/* Filter section (conditionally rendered) */}
     
        <div className="filters">
          <h4 className='filter-heading'>Filters</h4>

          <div className="filter-group">
            <h5>Pricing</h5>
            <input type="radio" id="allp" name="priceRange" value="" checked={filters.priceRange === ""} onChange={handleFilterChange} />
            <label htmlFor="allp">All</label>

            <input type="radio" id="0-100000" name="priceRange" value="0-100000" checked={filters.priceRange === "0-100000"} onChange={handleFilterChange} />
            <label htmlFor="0-100000">0-100000</label>

            <input type="radio" id="100001-500000" name="priceRange" value="100001-500000" checked={filters.priceRange === "100001-500000"} onChange={handleFilterChange} />
            <label htmlFor="100001-500000">100001-500000</label>

            <input type="radio" id="500001-100000000" name="priceRange" value="500001-100000000" checked={filters.priceRange === "500001-100000000"} onChange={handleFilterChange} />
            <label htmlFor="500001-100000000">500001-1000000</label>
          </div>

          <div className="filter-group">
            <h5>Tags</h5>
            {["ac", "lawn", "pool", "mandap", "outdoor", "resort"].map(tag => (
              <label key={tag}>
                <input type="checkbox" name="tags" value={tag} checked={filters.tags.includes(tag)} onChange={handleFilterChange} />
                <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
              </label>
            ))}
          </div>

         

          <div className="filter-group">
            <h5>Venue Type</h5>
            {["Luxury", "Comfort", "Budget"].map(type => (
              <label key={type}>
                <input type="checkbox" name="types" value={type} checked={filters.types.includes(type)} onChange={handleFilterChange} />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
    

      {/* Venue List */}
      <div className="venueC-list">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <div key={venue._id} onClick={() => navigate(`/venuePage/${venue._id}`)}>
              <VenueCard
                name={venue.name}
                price={venue.basePrice}
                venueType={venue.venueType}
                image={venue.images[0]} 
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

export default VenuesC;
