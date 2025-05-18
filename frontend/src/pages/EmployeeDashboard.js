import { useEffect, useState, useContext, useCallback } from "react"; // Add useCallback
import AuthContext from "../context/AuthContext";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee bookings
  const fetchEmployeeBookings = useCallback(async () => {
    try {
      console.log("Fetching bookings for user ID:", user?.id);
      const res = await fetch(`http://localhost:5000/api/bookings/employee/${user.id}`);
      const data = await res.json();
      console.log("Bookings data:", data);
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch employee bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Memoize with useCallback

  // Fetch on component load or user change
  useEffect(() => {
    if (user?.id) {
      fetchEmployeeBookings();
    }
  }, [user?.id, fetchEmployeeBookings]); // Add fetchEmployeeBookings to dependencies

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/update/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      await fetchEmployeeBookings();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Employee Dashboard</h2>
      <h3>Your Bookings</h3>
      {loading ? <p>Loading...</p> : (
        bookings.length === 0 ? (
          <p>No bookings assigned.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <p><strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
              <p><strong>Customer:</strong> {booking.firstname} {booking.lastname}</p>
              <p><strong>Service:</strong> {booking.serviceId?.name}</p>
              <p><strong>phone:</strong> {booking.phonenumber}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {booking.status === "Pending" && (
                <>
                  <button onClick={() => updateBookingStatus(booking._id, "Accepted")}>Accept</button>
                  <button onClick={() => updateBookingStatus(booking._id, "Rejected")}>Reject</button>
                </>
              )}
            </div>
          ))
        )
      )}
    </div>
  );
};

export default EmployeeDashboard;