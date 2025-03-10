import React, { useEffect, useState } from "react";
import "./adminbooking.css"; // Import external CSS

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("https://wemprod-b.onrender.com/admin/bookings", { method: "GET" });

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();

      // Merge venue and service bookings into a single array
      const mergedBookings = [
        ...(data.venueBookings || []),
        ...(data.serviceBookings || []),
      ];

      setBookings(mergedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Call the function inside useEffect
  useEffect(() => {
    fetchData();
  }, []);

  // Function to update booking status
  const updateBookingStatus = async (bookingId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this booking?`))
      return;

    try {
      const res = await fetch(`https://wemprod-b.onrender.com/admin/update/booking/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${status} booking`);
      }

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, adminStatus: status }
            : booking
        )
      );

      alert(`Booking ${status}!`);
    } catch (error) {
      console.error(`Error updating booking status:`, error);
      alert(`Failed to ${status} booking.`);
    }
  };

  // Approve Booking
  const approveBooking = (bookingId) =>
    updateBookingStatus(bookingId, "accepted");

  // Reject Booking
  const rejectBooking = (bookingId) =>
    updateBookingStatus(bookingId, "rejected");

  return (
    <div>
      <section>
        <h3>Bookings</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Name</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.name}</td>
                  <td>{booking.venueId ? "Venue" : "Service"}</td>
                  <td>{booking.venueName || booking.ServiceName}</td>
                  <td>{booking.vendorId || "N/A"}</td>
                  <td>{booking.date}</td>
                  <td>{booking.payment?.status ? "Paid" : "Unpaid"}</td>
                  <td>
                    <span
                      className={
                        booking.adminStatus === "accepted"
                          ? "status-accepted"
                          : booking.adminStatus === "rejected"
                          ? "status-rejected"
                          : "status-pending"
                      }
                    >
                      {booking.adminStatus}
                    </span>
                  </td>
                  <td>
  {booking.adminStatus === "accepted" ? (
    <button className="approved-btn" disabled>✔️ Approved</button>
  ) : booking.adminStatus === "rejected" ? (
    <button className="rejected-btn" disabled>❌ Rejected</button>
  ) : (
    <>
      <button className="accept-btn" onClick={() => approveBooking(booking._id)}>
        ✔ Accept
      </button>
      <button className="reject-btn" onClick={() => rejectBooking(booking._id)}>
        ✖ Reject
      </button>
    </>
  )}
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No bookings available</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminBookings;
