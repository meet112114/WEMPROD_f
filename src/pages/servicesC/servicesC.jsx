import React, { useState, useEffect } from 'react';
import ServiceTypeCard from '../../components/cards/ServiceTypeCard';
import './servicesC.css';
import { useNavigate } from 'react-router-dom';
import CitySelector from "../../components/locationCard/locationCard";

const ServicesC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]); // All services
  const [filteredServices, setFilteredServices] = useState([]); // Filtered services
  const [filters, setFilters] = useState({
    location: '',
    serviceType: [],
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllService'); 
        const data = await res.json();
        const acceptedServices = data.filter(service => service.status === "accepted");
        setServices(acceptedServices);
        setFilteredServices(data); 
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prev) => {
      let updatedFilters = { ...prev };

      if (type === "checkbox") {
        if (name === "serviceType") {
          const updatedTypes = checked
            ? [...prev.serviceType, value]
            : prev.serviceType.filter((type) => type !== value);
          updatedFilters.serviceType = updatedTypes;
        }
      } else {
        updatedFilters[name] = value;
      }

      return updatedFilters;
    });
  };

  // Apply filters
  useEffect(() => {
    let updatedServices = [...services];

    if (filters.location) {
      updatedServices = updatedServices.filter((service) =>
        service.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.serviceType.length > 0) {
      updatedServices = updatedServices.filter((service) =>
        filters.serviceType.includes(service.serviceType)
      );
    }

    setFilteredServices(updatedServices);
  }, [filters, services]);

  return (
    <div className="ServicesCpage">

      {/* Filters Sidebar */}
      <div className="filters">
        <h4 className='filter-heading'>Filters</h4>

        <div className="filter-group">
          <h5>Location</h5>
          <input type="radio" id="all" name="location" value="" checked={filters.location === ""} onChange={handleFilterChange} />
          <label htmlFor="all" className="radio-label">All</label>

          <input type="radio" id="mumbai" name="location" value="mumbai" checked={filters.location === "mumbai"} onChange={handleFilterChange} />
          <label htmlFor="mumbai" className="radio-label">Mumbai</label>

          <input type="radio" id="pune" name="location" value="pune" checked={filters.location === "pune"} onChange={handleFilterChange} />
          <label htmlFor="pune" className="radio-label">Pune</label>

          <input type="radio" id="nashik" name="location" value="nashik" checked={filters.location === "nashik"} onChange={handleFilterChange} />
          <label htmlFor="nashik" className="radio-label">Nashik</label>
        </div>

        <div className="filter-group">
          <h5>Service Type</h5>

          <label className="checkbox-label">
            <input type="checkbox" name="serviceType" value="catering" checked={filters.serviceType.includes("catering")} onChange={handleFilterChange} />
            <span>Catering</span> 
          </label>

          <label className="checkbox-label">
            <input type="checkbox" name="serviceType" value="photography" checked={filters.serviceType.includes("photography")} onChange={handleFilterChange} />
            <span>Photography</span> 
          </label>

          <label className="checkbox-label">
            <input type="checkbox" name="serviceType" value="decoration" checked={filters.serviceType.includes("decoration")} onChange={handleFilterChange} />
            <span>Decor</span> 
          </label>

          <label className="checkbox-label">
            <input type="checkbox" name="serviceType" value="makeup" checked={filters.serviceType.includes("makeup")} onChange={handleFilterChange} />
            <span>Makeup</span> 
          </label>
        </div>
      </div>

      {/* Services List */}
      <div className="sss">
      <CitySelector/>
      <div className="servicesC-list">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service._id} onClick={() => navigate(`/servicePage/${service._id}`)}>
              <ServiceTypeCard
                name={service.name}
                vendorName={service.vendorName}
                price={service.price}
                image={service.images[0]}
              />
            </div>
          ))
        ) : (
          <p>No services found</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ServicesC;
