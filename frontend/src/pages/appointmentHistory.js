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
        const isGoRide = category === "Go Ride Connect";
        const isYukimura = booking.shopcategory === "YUKIMURA RENTAL CARS" || booking.serviceId?.shopcategory === "YUKIMURA RENTAL CARS";
        const isH2Go = category === "H2Go";
        const isPetConnect = category === "PetConnect";
        const unitPrice = booking.serviceId?.price || 0;
        const quantity = booking.quantity || 1;
        const deliveryFee = booking.deliveryFee || 0;
        const basePrice = isYukimura ? (booking.basePrice || booking.serviceId?.price || 0) : 0;
        const destinationPrice = isYukimura ? (booking.price || 0) : 0;
        let goRideTotalPrice = 0;
        if (isGoRide) {
          if (isYukimura) {
            goRideTotalPrice = basePrice + destinationPrice;
          } else {
            goRideTotalPrice = booking.price || booking.serviceId?.price || 0;
          }
        }

        const totalPrice = isPetConnect
          ? (unitPrice * quantity) + deliveryFee
          : isH2Go
            ? (unitPrice * quantity) + deliveryFee
            : unitPrice + deliveryFee;

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
              <>
                <p>
                  <strong>Delivery Fee:</strong> ₱{deliveryFee}
                </p>
                <p>
                  <strong>Total Price (with Delivery):</strong> ₱{totalPrice}
                </p>
              </>
            )}

            {isPetConnect && (
              <p>
                <strong>Delivery Fee:</strong> ₱{deliveryFee}
              </p>
            )}

            {/* Add Go Ride Connect delivery/pickup info */}
            {isGoRide && (
              <>
                <p>
                  <strong>Delivery Date:</strong> {booking.deliveryDate || "N/A"}
                </p>
                <p>
                  <strong>Delivery Time:</strong> {booking.deliveryTime || "N/A"}
                </p>
                <p>
                  <strong>Dropoff Date:</strong> {booking.dropoffDate || "N/A"}
                </p>
                <p>
                  <strong>Dropoff Time:</strong> {booking.dropoffTime || "N/A"}
                </p>
                {isYukimura && (
                  <>
                    <p>
                      <strong>Service Price:</strong> ₱{basePrice ? basePrice.toLocaleString() : "0"}
                    </p>
                    <p>
                      <strong>Destination Price:</strong> ₱{destinationPrice ? destinationPrice.toLocaleString() : "0"}
                    </p>
                  </>
                )}
                <p>
                  <strong>Total Price:</strong> ₱{goRideTotalPrice ? goRideTotalPrice.toLocaleString() : "0"}
                </p>
              </>
            )}

            {/* FixUp specific fields */}
            {(!isGoRide && booking.serviceId?.category === "FixUp") && (
              <>
                <p>
                  <strong>Ideal Date:</strong> {booking.idealDate || "N/A"}
                </p>
                <p>
                  <strong>Ideal Time:</strong> {booking.idealTime || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ₱{booking.price ? booking.price.toLocaleString() : "N/A"}
                </p>
              </>
            )}

            {isPetConnect && (
              <p>
                <strong>Total Price (with Delivery):</strong> ₱{totalPrice}
              </p>
            )}

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
