import React, { useEffect, useState } from "react";
import "./adminvenue.css"; // Import external CSS

const AdminVenue = () => { 
    const [venues, setVenues] = useState([]);

    useEffect(() => {
        fetchData(); // Fetch venues on component mount
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('https://wemprod-b.onrender.com/admin/venues', { method: "GET" });

            if (!res.ok) {
                throw new Error("Failed to fetch venues");
            }

            const data = await res.json();
            setVenues(data);
        } catch (error) {
            console.error("Error fetching venues:", error);
        }
    };

    // Function to delete a venue
    const deleteVenue = async (venueId) => {
        if (!window.confirm("Are you sure you want to delete this venue?")) {
            return; // Exit if user cancels the delete action
        }

        try {
            const res = await fetch(`https://wemprod-b.onrender.com/admin/venue/${venueId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete venue");
            }

            // Update state to remove deleted venue from the list
            setVenues(venues.filter(venue => venue._id !== venueId));

            alert("Venue deleted successfully!");
        } catch (error) {
            console.error("Error deleting venue:", error);
            alert("Failed to delete venue.");
        }
    };

    // Function to accept a venue
    const acceptVenue = async (venueId) => {
        try {
            const res = await fetch(`https://wemprod-b.onrender.com/admin/venue/accept/${venueId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "accepted" }),
            });

            if (!res.ok) {
                throw new Error("Failed to accept venue");
            }

            // Update state to reflect accepted status
            setVenues(venues.map(venue => 
                venue._id === venueId ? { ...venue, status: "accepted" } : venue
            ));

            alert("Venue accepted successfully!");
        } catch (error) {
            console.error("Error accepting venue:", error);
            alert("Failed to accept venue.");
        }
    };

    return (
        <div>
            <section>
                <h3>Venues</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Owner</th>
                            <th>Venue Type</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Delete</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {venues.length > 0 ? venues.map(venue => (
                            <tr key={venue._id}>
                                <td>{venue.name}</td>
                                <td>{venue.location}</td>
                                <td>{venue.vendorName || "N/A"}</td>
                                <td>{venue.venueType || "Unknown"}</td>
                                <td>{venue.status || "Unknown"}</td>
                                <td>
                                    {venue.status === "accepted" ? (
                                        <button className="accepted-btn">✔ Accepted</button> 
                                    ) : (
                                        <button className="accept-btn" onClick={() => acceptVenue(venue._id)}>Accept</button>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => deleteVenue(venue._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="7">No venues available</td></tr>}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminVenue;
