import React, { useState, useEffect , useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceTypeCard2 from '../../components/cards/serviceTypeCard2/stc';
import './serviceCat.css';
import { UserContext } from '../../App'; 
import CitySelector from "../../components/locationCard/locationCard";

const ServicesCat = () => {
      const { state, dispatch } = useContext(UserContext);
      const { location } = state;

  const navigate = useNavigate();
  const { serviceType } = useParams(); // Get serviceType from URL
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllService'); 
        const data = await res.json();
        const acceptedServices = data.filter(service => service.status === "accepted");
  
        // Filter services based on selected location
        const locationFilteredServices = location 
          ? acceptedServices.filter(service => service.location.toLowerCase() === location.toLowerCase())
          : acceptedServices;
  
        setServices(locationFilteredServices);
        console.log(acceptedServices)
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
  
    fetchServices();
  }, [location ,serviceType ]); // Re-fetch services when location changes
  

  // Filter services when `serviceType` changes
  useEffect(() => {
    if (serviceType) {
      setFilteredServices(services.filter(service => service.serviceType === serviceType));
    } else {
      setFilteredServices(services);
    }
  }, [serviceType, services]);

  return (
    <div className="servicesCpage">
        <div className='city-selector '>
        <CitySelector/>
        </div>
      
        <h1 className='Sc-title'> Best {serviceType} in {location || "This Region"}</h1>
      {/* Services List */}
      <div className="servicesCat-list">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service._id} onClick={() => navigate(`/servicePage/${service._id}`)}>
              <ServiceTypeCard2
                name={service.name}
                vendorName={service.vendorName}
                price={service.startPrice}
                image={service.images[0]}
                description={service.description}
              />
            </div>
          ))
        ) : (
          <p>No services found</p>
        )}
      </div>
    </div>
  );
};

export default ServicesCat;
