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

  const updateBookingStatus = async (id, status) => {
  const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} this booking?`);
  if (!confirm) return;

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

  // Find user by ID helper (memoized to avoid useCallback warning)
  const getUserById = useCallback(
    (userId) => users.find((u) => u._id === (userId?._id || userId)) || {},
    [users]
  );

  // useCallback to avoid eslint warning about filterBookings dependency
  const filterBookings = useCallback(() => {
    let results = [...bookings];

    if (categoryFilter !== "All") {
      results = results.filter(
        (b) => b.serviceId?.category === categoryFilter
      );
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (b) => {
          const user = getUserById(b.userId);
          return (
            `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase().includes(q) ||
            (b.serviceId?.name || "").toLowerCase().includes(q)
          );
        }
      );
    }

    setFilteredBookings(results);
  }, [bookings, categoryFilter, searchQuery, getUserById]);

  useEffect(() => {
    filterBookings();
  }, [categoryFilter, searchQuery, bookings, users, filterBookings]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return { color: "green", fontWeight: "bold" };
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

      {/* Filter & Search Controls */}
      <label>Input user:</label>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      <div className="filters">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="FixUp">FixUp</option>
          <option value="H2Go">H2Go</option>
          <option value="WallFix">WallFix</option>
          <option value="PetConnect">PetConnect</option>
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
            <th>Price</th> {/* Added Price column */}
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredBookings.length > 0 ? (
    filteredBookings.map((booking) => {
      const user = getUserById(booking.userId);
      return (
        <tr key={booking._id}>
          <td>
            {user.firstname || ""} {user.lastname || ""}
          </td>
          <td>{booking.serviceId?.name || "N/A"}</td>
          <td>{booking.serviceId?.category || "N/A"}</td>
          <td>{booking.address}</td>
          <td style={getStatusStyle(booking.status)}>{booking.status}</td>
          <td>{booking.paymentMethod}</td>
          <td>{booking.serviceId?.price ? `₱${booking.serviceId.price}` : "N/A"}</td> {/* Price cell */}
          <td>{new Date(booking.createdAt).toLocaleString()}</td>
          <td>
            {booking.status === "Pending" && (
              <>
                <button onClick={() => updateBookingStatus(booking._id, "Accepted")}>Accept</button>
                <button onClick={() => updateBookingStatus(booking._id, "Rejected")}>Decline</button>
              </>
            )}
            {booking.status === "Accepted" && (
              <button onClick={() => updateBookingStatus(booking._id, "Completed")}>Done</button>
            )}
            <button onClick={() => deleteBooking(booking._id)} style={{ color: "red" }}>Delete</button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="9" style={{ textAlign: "center" }}>
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