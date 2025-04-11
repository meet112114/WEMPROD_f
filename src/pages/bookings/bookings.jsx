import React, { useEffect, useState, useContext } from "react";
import './bookings.css';

import { UserContext } from '../../App';


const UserBookings = () => {
  const  {state , dispatch} = useContext( UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
      const token = localStorage.getItem('jwtoken');
  

  useEffect(() => {
    if (state.user) {
      fetchBookings();
    }
  }, [state.user]);
  const fetchBookings = async () => {
    const token = localStorage.getItem('jwtoken');
    try {
      const [venueResponse, serviceResponse] = await Promise.all([
        fetch(`https://wemprod-b.onrender.com/bookings/user`, { method: "GET" , headers:{
          'Authorization': `Bearer ${token}` 
        }, }),
        fetch(`https://wemprod-b.onrender.com/bookingsSer/user`, { method: "GET", headers:{
          'Authorization': `Bearer ${token}` 
        },})
      ]);
  
      const venueBookings = await venueResponse.json();
      const serviceBookings = await serviceResponse.json();
  
      const allBookings = [...venueBookings, ...serviceBookings]; // Merge both bookings
  
      setBookings(allBookings);
      console.log(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };


  const checkout = async (booking) => {
    const token = localStorage.getItem('jwtoken');
    const baseUrl = window.location.origin; 

    // Define the correct object
    const bookingDetails = {
        bookingId: booking._id,
        productId: booking.venueId || booking.ServiceId,
        vendorId: booking.vendorId,   // Get from booking
        price: booking.payment.amount, // Get actual price from booking
        currency: "inr",
        bookingDate: booking.date // Use actual booking date
    };

    try {
        const res = await fetch("https://wemprod-b.onrender.com/checkout", { 
            method: "POST",
            headers: {
              'Authorization': `Bearer ${token}` ,
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                bookingDetails,
                baseUrl  
            })
        });

        const data = await res.json();
        if (data.url) {
            window.location = data.url; // Redirect to Stripe checkout
        } else {
            console.error("Error: No URL returned from backend", data);
        }
    } catch (error) {
        console.error("Checkout Error:", error);
    }
};



  return (
    <div className="bookings-container">
  <h2>Your Bookings</h2>
  {loading ? (
    <p>Loading bookings...</p>
  ) : bookings.length === 0 ? (
    <p>No bookings found {token}.</p>
  ) : (
    <div className="bookings-list">
      {/* Show Venue Bookings First */}
      {bookings
        .filter((booking) => booking.venueName) // Only venues
        .map((booking) => (
          <div key={booking._id} className="booking-card">
            <h3><strong>Venue Name :</strong> {booking.venueName}</h3>
            <div className="Type-date">
              <div><strong>Event Type:</strong> {booking.eventType}</div>
              <div><strong>Date:</strong> {new Date(booking.date).toDateString()}</div>
            </div>
            <div className="Type-date">
              <div><strong>Location :</strong> {booking.location}</div>
            </div>
            <div className={`status ${booking.adminStatus === "rejected" ? "rejected" : booking.bookingStatus}`}>
  <strong>Status:</strong> 
  {booking.adminStatus === "rejected" 
    ? "Rejected" 
    : booking.bookingStatus === "accepted" 
    ? "Confirmed" 
    : "Pending"}
</div>


{booking.bookingStatus === "accepted" ? (
  <div className="payment-sec">
    <div><strong>Amount :</strong> {booking.payment.amount}</div>
    {booking.payment.status ? <div>PAID</div> : <button onClick={() => checkout(booking)}>Pay</button>}
  </div>
) : ""}

          </div>
        ))
      }

      {/* Show Service Bookings After Venues */}
      {bookings
        .filter((booking) => booking.ServiceName) // Only services
        .map((booking) => (
          <div key={booking._id} className="booking-card">
            <h3><strong>Service Name :</strong> {booking.ServiceName}</h3>
            <div className="Type-date">
              <div><strong>Event Type:</strong> {booking.eventType}</div>
              <div><strong>Date:</strong> {new Date(booking.date).toDateString()}</div>
            </div>
            <div className="Type-date">
              <div><strong>Location :</strong> {booking.location}</div>
            </div>
            <div className={`status ${booking.adminStatus === "rejected" ? "rejected" : booking.bookingStatus}`}>
  <strong>Status:</strong> 
  {booking.adminStatus === "rejected" 
    ? "Rejected" 
    : booking.bookingStatus === "accepted" 
    ? "Confirmed" 
    : "Pending"}
</div>


{booking.bookingStatus === "accepted" && booking.payment && (
  <div className="payment-sec">
    <div> <strong>Amount :</strong> {booking.payment.amount}</div>
    {booking.payment.status ? <div>PAID</div> : <button onClick={() => checkout(booking)}>Pay</button>}
  </div>
)}

          </div>
        ))
      }
    </div>
  )}
</div>

  );
};

export default UserBookings;
