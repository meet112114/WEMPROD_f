import React, { useEffect, useState } from 'react';
import './home.css';
import VenueCard from '../../components/cards/venueCard';
import ServiceTypeCard from '../../components/cards/ServiceTypeCard';
import { useNavigate } from 'react-router-dom';

import Img from '../../assets/web-images/ind-wed-bg.jpg';
import Img2 from '../../assets/web-images/111.png';
import Img3 from '../../assets/web-images/ven-txt.png';
import Img4 from '../../assets/web-images/ven-img.png';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllVenue', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.status === 200) {
          const data = await res.json();
          setVenues(data.slice(0, 5));
        } else {
          console.error('Failed to fetch venues');
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch('https://wemprod-b.onrender.com/getAllService', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.status === 200) {
          const data = await res.json();
          setServices(data);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchVenues();
    fetchServices();
  }, []);

  const otherServices = services.filter(service => service.serviceType === "others").slice(0, 5);


  return (
    <div>
      <div className='home-top-img-div'>
        <img src={Img2} className='home-top-img-image' />
      </div>

      <div className='home-C-venue'>
        <div className='home-C-venue-top'>
          <div className='home-C-venue-top-text'>
            <div className='top-venue-text-1'>Top Venues</div>
            <div className='top-venue-text-2'>Near You </div>
          </div>
          <div className='home-C-venue-top-img'>
            <img src={Img4} className='home-C-venue-top-image-image' />
          </div>
        </div>
        <div className='home-C-venue-bottom'>
          {venues.length > 0 ? (
            venues.map((venue) => (
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
        <button className='home-C-venue-bottom-button' onClick={() => { navigate('/venueClient') }}> View All .. </button>
      </div>

      {/* Services Section */}
      <div className='home-services-section'>


    
    

        <h1 className='h1-service'> Other Services</h1>
        <div className='home-services-row'>
          {otherServices.length > 0 ? (
            otherServices.map((service) => (
              <div key={service._id} onClick={() => navigate(`/servicePage/${service._id}`)}>
                <ServiceTypeCard
                  name={service.name}
                  vendorName={service.vendorName}
                  image={service.images[0]}
                />
              </div>
            ))
          ) : (
            <p>No decoration services found</p>
          )}
        </div>
        <button className='home-C-venue-bottom-button' onClick={() => { navigate('/ServiceClient') }}> View All .. </button>

      </div>
    </div>
  );
};

export default Home;
