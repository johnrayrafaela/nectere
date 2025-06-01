// frontend/src/pages/AppointmentHistoryPage.jsx

import { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/AppointmentHistory.css";

const AppointmentHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      const fetchBookings = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/bookings/all");
          if (!response.ok) throw new Error("Failed to fetch bookings");
          const data = await response.json();

          console.log("Fetched bookings:", data);

          const userBookings = data.filter(
            (booking) => booking.userId && booking.userId._id === user.id
          );

          setBookings(userBookings);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch bookings");
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user]);

  return (
    <div className="appointment-history">
      <h2>Your Booking History</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && bookings.length === 0 && (
        <div className="no-booking">
          <p>No bookings found.</p>
        </div>
      )}

      {bookings.map((booking) => {
        const category = booking.serviceId?.category;
        const isH2Go = category === "H2Go";
        const isPetConnect = category === "PetConnect";

        const quantity = (isH2Go || isPetConnect) ? booking.quantity || 1 : 1;
        const unitPrice = booking.serviceId?.price || 0;
        const deliveryFee = isH2Go ? 50 : 0;
        const subtotal = unitPrice * quantity;
        const totalPrice = subtotal + deliveryFee;

        return (
          <div className="booking-card" key={booking._id}>
            <p>
              <strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Name:</strong> {booking.firstname} {booking.lastname}
            </p>
            <p>
              <strong>Email:</strong> {booking.email}
            </p>
            <p>
              <strong>Service:</strong> {booking.serviceId?.name || "N/A"}
            </p>
            <p>
              <strong>Website:</strong> {category || "N/A"}
            </p>
            <p>
              <strong>Shop:</strong>{" "}
              {booking.shopcategory || booking.serviceId?.shopcategory || "N/A"}
            </p>

            {(isH2Go || isPetConnect) && (
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
            )}

            {isH2Go && (
              <p>
                <strong>Delivery Fee:</strong> ₱{deliveryFee}
              </p>
            )}

            <p>
              <strong>{(isH2Go || isPetConnect) ? "Total Price" : "Price"}:</strong> ₱{totalPrice}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {booking.status === "Pending" ? (
                <span className="pending">Pending</span>
              ) : booking.status === "Accepted" ? (
                <span className="accepted">Accepted</span>
              ) : booking.status === "Completed" ? (
                <span className="completed">Completed</span>
              ) : (
                <span className="rejected">Rejected</span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentHistoryPage;
