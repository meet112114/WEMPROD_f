import React, { useState, useEffect } from 'react';
import VenueCard from '../../components/cards/venueCard';
import './venuesC.css'
import BGIMG from '../../assets/web-images/bg1.jpg'
import { useNavigate } from 'react-router-dom';

const VenuesC = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]); // All venues
  const [filteredVenues, setFilteredVenues] = useState([]); // Filtered venues
  const [filters, setFilters] = useState({
    priceRange: '',
    types: [],
    location: '',
    tags:[]
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllVenue');
        const data = await res.json();
        setVenues(data);
        setFilteredVenues(data); // Initialize with all venues
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
          const updatedTags = checked
            ? [...prev.tags, value]
            : prev.tags.filter((tag) => tag !== value);
          updatedFilters.tags = updatedTags;
        } else if (name === "types") {
          const updatedTypes = checked
            ? [...prev.types, value]
            : prev.types.filter((type) => type !== value);
          updatedFilters.types = updatedTypes;
        }
      } else {
        updatedFilters[name] = value;
      }
  
      console.log("Updated Filters:", updatedFilters); 
      return updatedFilters;
    });
  };
  
  
  useEffect(() => {
    let updatedVenues = [...venues];
  
    // Filter by price range
    if (filters.priceRange && filters.priceRange.includes("-")) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      updatedVenues = updatedVenues.filter(
        (venue) => venue.basePrice >= min && venue.basePrice <= max
      );
    }
  
    if (filters.tags.length > 0) {
      updatedVenues = updatedVenues.filter((venue) =>
        filters.tags.every(tag => venue.tags.includes(tag)) // Check if venue contains all selected tags
      );
    }
    if (filters.types.length > 0) {
      updatedVenues = updatedVenues.filter((venue) => {
        console.log('Checking type:', venue.venueType); 
         return filters.types.includes(venue.venueType); // Return the check to filter the venues
      });
    }

    // Filter by location (Ignore empty "" for 'All')
    if (filters.location) {
      updatedVenues = updatedVenues.filter((venue) =>
        venue.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
  
    setFilteredVenues(updatedVenues);
  }, [filters, venues]);
  

  return (
    <div className="venueCpage"  style={{  
        backgroundImage: `url(${BGIMG})`,
        backgroundSize: "cover", 
        backgroundRepeat: "no-repeat", 
        height:'90h',
        margin: 0, 
        padding: 0,
        }}>
        
      <div className="filters">
      <h4 className='filter-heading'>Filters</h4>
        
      <div className="filter-group">
  <h5>Pricing</h5>

  <input type="radio" id="allp" name="priceRange" value="" checked={filters.priceRange === ""} onChange={handleFilterChange} />
  <label htmlFor="allp" className="radio-label">All</label>

  <input type="radio" id="0-100000" name="priceRange" value="0-100000" checked={filters.priceRange === "0-100000"} onChange={handleFilterChange} />
  <label htmlFor="0-100000" className="radio-label">0-100000</label>

  <input type="radio" id="100001-500000" name="priceRange" value="100001-500000" checked={filters.priceRange === "100001-500000"} onChange={handleFilterChange} />
  <label htmlFor="100001-500000" className="radio-label">100001-500000</label>

  <input type="radio" id="500001-100000000" name="priceRange" value="500001-100000000" checked={filters.priceRange === "500001-100000000"} onChange={handleFilterChange} />
  <label htmlFor="500001-100000000" className="radio-label">500001-1000000</label>
</div>

        <div className="filter-group">
  <h5>Tags</h5>

  <label className="checkbox-label">
  <input type="checkbox" name="tags" value="ac" checked={filters.tags.includes("ac")} onChange={handleFilterChange} />
  <span>AC</span> 
</label>

<label className="checkbox-label">
  <input type="checkbox" name="tags" value="lawn" checked={filters.tags.includes("lawn")} onChange={handleFilterChange} />
  <span>Lawn</span> 
</label>

<label className="checkbox-label">
  <input type="checkbox" name="tags" value="pool" checked={filters.tags.includes("pool")} onChange={handleFilterChange} />
  <span>Pool</span> 
</label>


<label className="checkbox-label">
  <input type="checkbox" name="tags" value="mandap" checked={filters.tags.includes("mandap")} onChange={handleFilterChange} />
  <span>Mandap</span> 
</label>


<label className="checkbox-label">
  <input type="checkbox" name="tags" value="outdoor" checked={filters.tags.includes("outdoor")} onChange={handleFilterChange} />
  <span>Outdoor</span> 
</label>


<label className="checkbox-label">
  <input type="checkbox" name="tags" value="resort" checked={filters.tags.includes("resort")} onChange={handleFilterChange} />
  <span>Resort</span> 
</label>

</div>


        <div className="filter-group">
  <h5>Location</h5>

  <input type="radio" id="all" name="location" value="" checked={filters.location === ""} onChange={handleFilterChange} />
  <label htmlFor="all" className="radio-label">All</label>

  <input type="radio" id="mumbai" name="location" value="mumbai" checked={filters.location === "mumbai"} onChange={handleFilterChange} />
  <label htmlFor="mumbai" className="radio-label">Mumbai</label>

  <input type="radio" id="pune" name="location" value="pune" checked={filters.location === "pune"} onChange={handleFilterChange} />
  <label htmlFor="pune" className="radio-label">Pune</label>

</div>

<div className="filter-group">
  <h5>Venue Type</h5>

  <label className="checkbox-label">
  <input type="checkbox" name="types" value="Luxury" checked={filters.types.includes("Luxury")} onChange={handleFilterChange} />
  <span>Luxury</span> 
</label>

<label className="checkbox-label">
  <input type="checkbox" name="types" value="Comfort" checked={filters.types.includes("Comfort")} onChange={handleFilterChange} />
  <span>Comfort</span> 
</label>

<label className="checkbox-label">
  <input type="checkbox" name="types" value="Budget" checked={filters.types.includes("Budget")} onChange={handleFilterChange} />
  <span>Budget</span>
  </label>
</div>

      </div>

      <div className="venueC-list">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <div 
            onClick={() => navigate(`/venuePage/${venue._id}`)}>
            <VenueCard
              key={venue._id}
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
