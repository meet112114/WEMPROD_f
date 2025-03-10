import React, { useState } from 'react';
import './addVenue.css'

const AddVenue = () => {
  const [venueData, setVenueData] = useState({
    name: '',
    venueType: '',
    venueDecs: '',
    address: '',
    locationUrl: '',
    basePrice: '',
    tags: [],
    images: []
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  
  const tagOptions = ['ac', 'mandap', 'pool', 'lawn', 'resort' ,'outdoor'];

  const handleChange = (e) => {
    setVenueData({ ...venueData, [e.target.name]: e.target.value });
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setVenueData(prev => ({
      ...prev,
      tags: checked ? [...prev.tags, value] : prev.tags.filter(tag => tag !== value)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files.map(file => URL.createObjectURL(file)));
    setVenueData(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(venueData).forEach(key => {
      if (key === 'images') {
        venueData.images.forEach(image => formData.append('images', image));
      } else if (key === 'tags') {
        venueData.tags.forEach(tag => formData.append('tags', tag));
      } else {
        formData.append(key, venueData[key]);
      }
    });

    try {
      const response = await fetch('https://wemprod-b.onrender.com/add/venue', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Venue added successfully');
        setVenueData({
          name: '' , venueType: '', venueDecs: '', address: '',
          locationUrl: '', basePrice: '', tags: [], images: []
        });
        setSelectedImages([]);
      } else {
        alert('Error adding venue');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="venue-container">
      <h2 className="venue-title">Add Venue</h2>
      <form className="venue-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input className="venue-input" type="text" name="name" placeholder="Venue Name" value={venueData.name} onChange={handleChange} required />
        
        <select className="venue-input" name="venueType" value={venueData.venueType} onChange={handleChange} required>
          <option value="" disabled>Select Venue Type</option>
          <option value="Budget">Budget</option>
          <option value="Comfort">Comfort</option>
          <option value="Luxury">Luxury</option>
        </select>

        <textarea className="venue-input venue-textarea" name="venueDecs" placeholder="Description" value={venueData.venueDecs} onChange={handleChange} required />
        <input className="venue-input" type="text" name="address" placeholder="Address" value={venueData.address} onChange={handleChange} required />
        <input className="venue-input" type="text" name="locationUrl" placeholder="Google Maps URL" value={venueData.locationUrl} onChange={handleChange} required />
        <input className="venue-input" type="number" name="basePrice" placeholder="Base Price" value={venueData.basePrice} onChange={handleChange} required />
        
        <div className="venue-tags">
          <h4>Tags</h4>
          {tagOptions.map(tag => (
            <label key={tag} className="venue-tag-label">
              <input type="checkbox" value={tag} checked={venueData.tags.includes(tag)} onChange={handleTagChange} />
              {tag}
            </label>
          ))}
        </div>

        <input className="venue-file" type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div className="venue-preview">
          {selectedImages.map((image, index) => (
            <img key={index} src={image} alt="Preview" className="venue-image-preview" />
          ))}
        </div>
        
        <button className="venue-button" type="submit">Add Venue</button>
      </form>
    </div>
  );
};

export default AddVenue;
