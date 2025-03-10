import React, { useEffect, useState } from "react";
import "./adminServices.css"; // Import external CSS

const AdminService = () => { 
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchData(); // Fetch services on component mount
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('https://wemprod-b.onrender.com/admin/services', { method: "GET" });

            if (!res.ok) {
                throw new Error("Failed to fetch services");
            }

            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    // Function to delete a service
    const deleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) {
            return; // Exit if user cancels the delete action
        }

        try {
            const res = await fetch(`https://wemprod-b.onrender.com/admin/service/${serviceId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete service");
            }

            // Update state to remove deleted service from the list
            setServices(services.filter(service => service._id !== serviceId));

            alert("Service deleted successfully!");
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service.");
        }
    };

    // Function to accept a service
    const acceptService = async (serviceId) => {
        try {
            const res = await fetch(`https://wemprod-b.onrender.com/admin/service/accept/${serviceId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "accepted" }),
            });

            if (!res.ok) {
                throw new Error("Failed to accept service");
            }

            // Update state to reflect the accepted service
            setServices(services.map(service => 
                service._id === serviceId ? { ...service, status: "accepted" } : service
            ));

            alert("Service accepted successfully!");
        } catch (error) {
            console.error("Error accepting service:", error);
            alert("Failed to accept service.");
        }
    };

    return (
        <div>
            <section>
                <h3>Services</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Vendor</th>
                            <th>Plans</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? services.map(service => (
                            <tr key={service._id}>
                                <td>{service.name}</td>
                                <td>{service.serviceType || "Unknown"}</td>
                                <td>{service.vendorName || "N/A"}</td>
                                <td>{service.plans ? service.plans.length : "Unknown"}</td>
                                <td>
                                    {service.status === "accepted" ? (
                                        <button className="accepted-btn">✔ Accepted</button>
                                    ) : (
                                        <button 
                                            className="accept-btn" 
                                            onClick={() => acceptService(service._id)}
                                        >
                                            Accept
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => deleteService(service._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="6">No services available</td></tr>}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminService;
