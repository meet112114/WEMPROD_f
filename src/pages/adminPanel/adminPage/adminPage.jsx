import React, { useEffect, useState } from "react";
import "./adminPage.css"; // Import external CSS

const AdminPanel = () => {
    const [vendors, setVendors] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch helper function
    const fetchData = async (endpoint, setter, transform = (data) => data) => {
        try {
            const response = await fetch(`${endpoint}`);
            const data = await response.json();
            setter(transform(data));
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            setter([]);
        }
    };

    // Fetch all data
    useEffect(() => {
        fetchData("https://wemprod-b.onrender.com/admin/vendors", setVendors);
        fetchData("https://wemprod-b.onrender.com/admin/users", setUsers);
    }, []);

   
    return (
        <div className="admin-container">


        {/* Vendors Section */}
        <section>
            <h3>Vendors</h3>
            <table className="admin-table">
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>location</th></tr>
                </thead>
                <tbody>
                    {vendors.length > 0 ? vendors.map(vendor => (
                        <tr key={vendor._id}>
                            <td>{vendor.name}</td>
                            <td>{vendor.contactEmail}</td>
                            <td>{vendor.contactNo || "N/A"}</td>
                            <td>{vendor.location}</td>
                        </tr>
                    )) : <tr><td colSpan="4">No vendors available</td></tr>}
                </tbody>
            </table>
        </section>

        {/* Users Section */}
        <section>
            <h3>Users</h3>
            <table className="admin-table">
                <thead>
                    <tr><th>Name</th><th>Email</th><th>Joined On</th></tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    )) : <tr><td colSpan="3">No users found</td></tr>}
                </tbody>
            </table>
        </section>


       

        
    </div>
);
};

export default AdminPanel;
