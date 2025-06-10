// frontend/src/pages/AdminBookingManagementPage.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../styles/AdminBookingManagementPage.css";

const AdminBookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookings/all");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/get-all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUsers();
  }, []);

  const updateBookingStatus = async (id, status, booking) => {
    const isH2Go = booking?.serviceId?.category === "H2Go";
    const isPetConnect = booking?.serviceId?.category === "PetConnect";
    const isGoRide = booking?.serviceId?.category === "Go Ride Connect";
    const actionText = status.toLowerCase();

    let confirmText = `Are you sure you want to ${actionText} this booking?`;
    if (isH2Go || isPetConnect || isGoRide) {
      confirmText = `Are you sure you want to ${actionText} this order?`;
    }

    if (!window.confirm(confirmText)) return;

    try {
      await axios.put(`http://localhost:5000/api/bookings/update/${id}`, { status });
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/delete/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const getUserById = useCallback(
    (userId) => users.find((u) => u._id === (userId?._id || userId)) || {},
    [users]
  );

  const filterBookings = useCallback(() => {
    let results = [...bookings];

    if (categoryFilter !== "All") {
      results = results.filter((b) => b.serviceId?.category === categoryFilter);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      results = results.filter((b) => {
        const user = getUserById(b.userId);
        return (
          `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase().includes(q) ||
          (b.serviceId?.name || "").toLowerCase().includes(q)
        );
      });
    }

    setFilteredBookings(results);
  }, [bookings, categoryFilter, searchQuery, getUserById]);

  useEffect(() => {
    filterBookings();
  }, [categoryFilter, searchQuery, bookings, users, filterBookings]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
      case "Completed":
        return { color: "green", fontWeight: "bold" };
      case "Rejected":
        return { color: "red", fontWeight: "bold" };
      case "Pending":
        return { color: "orange", fontWeight: "bold" };
      default:
        return {};
    }
  };

  return (
    <div className="booking-management-page">
      <h2>Booking Management (Admin)</h2>

      {/* Search by user name */}
      <label>Input user:</label>
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category filter */}
      <div className="filters">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="FixUp">FixUp</option>
          <option value="H2Go">H2Go</option>
          <option value="PetConnect">PetConnect</option>
          <option value="Go Ride Connect">Go Ride Connect</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Service</th>
            <th>Shop</th>
            <th>Address</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Price</th>
            {/* Add columns for Go Ride Connect */}
            <th>Delivery Date</th>
            <th>Delivery Time</th>
            <th>Dropoff Date</th>
            <th>Dropoff Time</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const user = getUserById(booking.userId);
              const category = booking.serviceId?.category;
              const isH2Go = category === "H2Go";
              const isPetConnect = category === "PetConnect";
              const isGoRide = category === "Go Ride Connect";
              const isYukimura = booking.shopcategory === "YUKIMURA RENTAL CARS" || booking.serviceId?.shopcategory === "YUKIMURA RENTAL CARS";
              const unitPrice = booking.serviceId?.price || 0;
              const quantity = (isH2Go || isPetConnect) ? booking.quantity || 1 : 1;
              const deliveryFee = isH2Go ? 50 : isPetConnect ? (booking.deliveryFee || 0) : 0;
              const subtotal = unitPrice * quantity;
              const totalPrice = isPetConnect
                ? subtotal + deliveryFee
                : isH2Go
                ? subtotal + deliveryFee
                : unitPrice + deliveryFee;

              // Go Ride Connect (Yukimura): sum basePrice + price (destination)
              let goRideTotalPrice = 0;
              let basePrice = isYukimura ? (booking.basePrice || booking.serviceId?.price || 0) : 0;
              let destinationPrice = isYukimura ? (booking.price || 0) : 0;
              if (isGoRide) {
                if (isYukimura) {
                  goRideTotalPrice = basePrice + destinationPrice;
                } else {
                  goRideTotalPrice = booking.price || booking.serviceId?.price || 0;
                }
              }

              return (
                <tr key={booking._id}>
                  <td>
                    {user.firstname || ""} {user.lastname || ""}
                  </td>
                  <td>{booking.serviceId?.name || "N/A"}</td>
                  <td>{booking.shopcategory || booking.serviceId?.shopcategory || "N/A"}</td>
                  <td>{booking.address}</td>
                  <td style={getStatusStyle(booking.status)}>{booking.status}</td>
                  <td>{booking.paymentMethod}</td>
                  <td>
                    {isH2Go && (
                      <>
                        Subtotal: ₱{subtotal}
                        <br />
                        Delivery Fee: ₱{deliveryFee}
                        <br />
                        <strong>Total: ₱{totalPrice}</strong>
                      </>
                    )}
                    {isPetConnect && (
                      <>
                        Subtotal: ₱{subtotal}
                        <br />
                        Delivery Fee: ₱{deliveryFee}
                        <br />
                        <strong>Total: ₱{totalPrice}</strong>
                      </>
                    )}
                    {isGoRide && isYukimura && (
                      <>
                        Service Price: ₱{basePrice ? basePrice.toLocaleString() : "0"}
                        <br />
                        Destination Price: ₱{destinationPrice ? destinationPrice.toLocaleString() : "0"}
                        <br />
                        <strong>Total: ₱{goRideTotalPrice ? goRideTotalPrice.toLocaleString() : "0"}</strong>
                      </>
                    )}
                    {isGoRide && !isYukimura && (
                      <>
                        <strong>Total: ₱{goRideTotalPrice ? goRideTotalPrice.toLocaleString() : "0"}</strong>
                      </>
                    )}
                    {!isH2Go && !isPetConnect && !isGoRide && booking.serviceId?.price
                      ? `₱${booking.serviceId.price}`
                      : ""}
                  </td>
                  {/* Show delivery/pickup info for Go Ride Connect, else blank */}
                  <td>{isGoRide ? booking.deliveryDate : ""}</td>
                  <td>{isGoRide ? booking.deliveryTime : ""}</td>
                  <td>{isGoRide ? booking.dropoffDate : ""}</td>
                  <td>{isGoRide ? booking.dropoffTime : ""}</td>
                  <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  <td>
                    {booking.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "Accepted", booking)
                          }
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking._id, "Rejected", booking)
                          }
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {booking.status === "Accepted" && (
                      <button
                        onClick={() =>
                          updateBookingStatus(booking._id, "Completed", booking)
                        }
                      >
                        Done
                      </button>
                    )}
                    <button
                      onClick={() => deleteBooking(booking._id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="13" style={{ textAlign: "center" }}>
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookingManagementPage;
