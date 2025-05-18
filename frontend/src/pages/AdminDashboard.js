import { Link, Routes, Route, Navigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import UserManagement from "./admin/UserManagement";
import AdminBookingManagementPage from "./admin/AdminBookingManagementPage";
import AddServicesPage from "./admin/Addservice";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin</h2>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin/add-service" className="nav-link">Add Services / Existing Services</Link>
            </li>
            <li>
              <Link to="/admin/bookings" className="nav-link">Booking Management</Link>
            </li>
            <li>
              <Link to="/admin/user-management" className="nav-link">User Management</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Welcome to the Admin Dashboard</h1>
                <p>
                  Use the navigation on the left to manage services, bookings, and users.
                </p>
                
              </>
            }
          />
          <Route path="add-service" element={<AddServicesPage />} />
          <Route path="bookings" element={<AdminBookingManagementPage />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;