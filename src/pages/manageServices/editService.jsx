import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './editService.css';

const EditService = () => {
    const { id } = useParams();
    const [refresh , setRefresh ] = useState(false);
    const [service, setService] = useState({});
    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ planName: '', description: '', price: '' });
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtoken');
        console.log(token)
        if (!token) {
            throw new Error('No token found, please log in again.');
        }
        const fetchService = async () => {
            try {
                const res = await fetch(`https://wemprod-b.onrender.com/get/servicesByID/${id}`, {
                    method: "GET",
                    headers:{
                        'Authorization': `Bearer ${token}` 
                      }
                });
                const data = await res.json();
                setService(data);
                setPlans(data.plans || []);
                setLoader(false);
            } catch (error) {
                console.error('Error fetching service:', error);
            }
        };
        fetchService();
    }, [id , refresh]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setService(prevState => ({
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
        setRemovedImages([...removedImages, imageUrl]);
        setService(prev => ({
            ...prev,
            images: prev.images.filter(img => img !== imageUrl)
        }));
    };

    // Handle plan addition
    const addPlan = () => {
        if (newPlan.planName.trim() && newPlan.description.trim() && newPlan.price) {
            setPlans([...plans, { planName: newPlan.planName, description: newPlan.description, price: newPlan.price }]);
            setNewPlan({ planName: '', description: '', price: '' });
        }
    };
    // Handle plan removal
    const removePlan = (planId) => {
        setPlans(plans.filter(plan => plan._id !== planId));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append("id", id);
        formData.append("name", service.name);
        formData.append("vendorId", service.vendorId);
        formData.append("description", service.description);

        // Append plans as JSON string
        formData.append("plans", JSON.stringify(plans));

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
            const res = await fetch('https://wemprod-b.onrender.com/edit/service', {
                method: "PUT",
                headers:{
                    'Authorization': `Bearer ${token}` 
                  },
                body: formData,
            });

            if (res.ok) {
                alert('Service updated successfully!');
                setLoader(true);
                setRefresh(true)

            } else {
                alert('Error updating service');
            }
        } catch (error) {
            console.error('Error updating service:', error);
        }
    };

    return (
        <>
        {loader ? <div>Loading...</div> : 
        <div className='ES-main-div'>
            <h2 className='ES-H2'>Update Service</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                
                <div className="input-container">
                    <input type="text" name="name" value={service.name || ''} onChange={handleChange} placeholder=" " />
                    <label>Name</label>
                </div>

                <div className="input-container">
                    <input type="text" name="description" value={service.description || ''} onChange={handleChange} placeholder=" " />
                    <label>Description</label>
                </div>

                {/* Existing Images */}
                <h3>Existing Images</h3>
                <div className="image-container">
                    {service.images && service.images.map((imageUrl, index) => (
                        <div key={index} className="image-box">
                            <img src={"https://wemprod-b.onrender.com" + imageUrl} alt="service" className="image-preview" />
                            <button type="button" onClick={() => handleRemoveImage(imageUrl)}>Remove</button>
                        </div>
                    ))}
                </div>

                <h3>Upload New Images</h3>
                <input type="file" multiple onChange={handleNewImageChange} />

                {/* Plans Management */}
                <h3>Plans</h3>
                <div className="plans-container">
                    {plans.map((plan, index) => (
                        <div key={index} className="plan-item">
                            <strong>{plan.planName}</strong> Plan Price :  ${plan.price}
                            <button type="button" onClick={() => removePlan(plan._id)}>Remove</button>
                        </div>
                    ))}
                </div>

                <div className="input-container">
                    <input type="text" name="planName" value={newPlan.planName} onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })} placeholder="Plan Name" />
                   
                </div>

                <div className="input-container">
                    <input type="text" name="description" value={newPlan.description} onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })} placeholder="Plan Description" />
              
                </div>

                <div className="input-container">
                    <input type="number" name="price" value={newPlan.price} onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} placeholder="Plan Price" />
         
                </div>

                <button type="button" onClick={addPlan}>Add Plan</button>

                <div className='ES-submit-button'>
                    <button type="submit">Update Service</button>
                </div>
            </form>
        </div>}
        </>
    );
};

export default EditService;
