import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './editVenue.css'
import { useNavigate } from 'react-router-dom';
const EditVenue = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [venue, setVenue] = useState({});
    const [newImages, setNewImages] = useState([]); 
    const [removedImages, setRemovedImages] = useState([]);
    const [tags, setTags] = useState([]); 
    const [newTag, setNewTag] = useState(""); 
    const [loader , setLoader] = useState(true)


  const tagOptions = ['ac', 'mandap', 'pool', 'lawn', 'resort' ,'outdoor'];

    useEffect(() => {
        const token = localStorage.getItem('jwtoken');
        console.log(token)
        if (!token) {
            throw new Error('No token found, please log in again.');
        }
        const fetchVenue = async () => {
            try {
                const res = await fetch(`https://wemprod-b.onrender.com/get/venueByID/${id}`, {
                    method: "GET",
                    headers:{
                        'Authorization': `Bearer ${token}` 
                      }
                });
                const data = await res.json();
                setVenue(data);
                setTags(data.tags || []); // Load tags
                setLoader(false);
            } catch (error) {
                console.error('Error fetching venue:', error);
            }
        };
        fetchVenue();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVenue(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle new image selection
    const handleNewImageChange = (e) => {
        setNewImages([...newImages, ...e.target.files]); 
    };

    // Handle image removal
    const handleRemoveImage = (imageUrl) => {
        setRemovedImages([...removedImages, imageUrl]); // Mark for removal
        setVenue(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl) // Remove from UI
        }));
    };

    // Handle tag addition
    const addTag = () => {
        if (newTag.trim()) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    // Handle tag removal
    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append("id", id);
        formData.append("name", venue.name);
        formData.append("vendorId", venue.vendorId);
        formData.append("venueType", venue.venueType);
        formData.append("venueDecs", venue.venueDecs);
        formData.append("address", venue.address);
        formData.append("locationUrl", venue.locationUrl);
        formData.append("location", venue.location);
        formData.append("basePrice", venue.basePrice);

        // Append tags
        formData.append("tags", JSON.stringify(tags));

        // Append removed images list
        formData.append("removedImages", JSON.stringify(removedImages));

        // Append new images
        newImages.forEach(file => formData.append("images", file));

        const token = localStorage.getItem('jwtoken');
        console.log(token)
        if (!token) {
            throw new Error('No token found, please log in again.');
        }

        try {
            const res = await fetch('https://wemprod-b.onrender.com/edit/venue', {
                method: "PUT",
                headers:{
                        'Authorization': `Bearer ${token}` 
                      },
                body: formData,
            });

            if (res.ok) {
                alert('Venue updated successfully!');
                navigate(`/venuePage/${id}`); 
            } else {
                alert('Error updating venue');
            }
        } catch (error) {
            console.error('Error updating venue:', error);
        }
    };

    return (
        <>
        {loader ? <div> loading ...</div> : <div className='EV-main-div'>
            <h2 className='EV-H2'>Update Venue</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            
            <div className="input-container">
            <input type="text" name="name" value={venue.name || ''} onChange={handleChange} placeholder=" " />
            <label>Name</label>
            </div>


            <div className='input-container'> 
            <input type="text" name="venueDecs" value={venue.venueDecs || ''} onChange={handleChange} placeholder="Venue Description" />
            <label>Venue Description</label>
            </div>


            <div className='input-container'> 
            <input type="text" name="address" value={venue.address || ''} onChange={handleChange} placeholder="Address" />
            <label>Address</label>
            </div>
            
            <div className='input-container'> 
            <input type="text" name="locationUrl" value={venue.locationUrl || ''} onChange={handleChange} placeholder="Location URL" />
            <label>Location Url</label>
            </div>
            
            
            <div className='input-container'> 
            <input type="text" name="basePrice" value={venue.basePrice || ''} onChange={handleChange} placeholder="Base Price" />
            <label>Base Price</label>
            </div>

            <select className="venue-input" name="venueType" value={venue.venueType || ''} onChange={handleChange} >
            <option value="" disabled>Select Venue Type</option>
            <option value="Budget">Budget</option>
            <option value="Comfort">Comfort</option>
            <option value="Luxury">Luxury</option>
            </select>

            {/* Existing Images */}
            <h3>Existing Images</h3>
            <div className="image-container">
                {venue.images && venue.images.map((imageUrl, index) => (
                    <div key={index} className="image-box">
                        <img src={"https://wemprod-b.onrender.com"+imageUrl} alt="venue" className="image-preview" />
                        <button type="button" onClick={() => handleRemoveImage(imageUrl)}>Remove</button>
                    </div>
                ))}
            </div>

            <h3>Upload New Images</h3>
            <input type="file" multiple onChange={handleNewImageChange} />

  

            <h3>Tags</h3>
<div className="tags-container">
    {tags.map((tag, index) => (
        <span key={index} className="tag">
            {tag} 
            <button type="button" onClick={() => removeTag(tag)}>x</button>
        </span>
    ))}
</div>

<div className="service-tags">
    {tagOptions.map(tag => (
        <label key={tag} className="venue-tag-label">
            <input 
                type="checkbox" 
                value={tag} 
                checked={tags.includes(tag)}
                onChange={(e) => {
                    if (e.target.checked) {
                        setTags([...tags, tag]); // Add tag if checked
                    } else {
                        setTags(tags.filter(t => t !== tag)); // Remove tag if unchecked
                    }
                }}
            />
            {tag}
        </label>
    ))}
</div>

   
           

            
<div>
            <button type="button" onClick={addTag}>Add Tag</button>
            </div>


            <div className='VH-submitVenue-button'>

            <button type="submit">Update Venue</button>
            </div>
        </form>
        </div>}
        </>
    );
};

export default EditVenue;
