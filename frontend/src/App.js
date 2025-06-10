import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import UserProfilePage from "./pages/userProfilePage";
import AppointmentHistoryPage from "./pages/appointmentHistory";
import EmployeesPage from "./components/EmployeesPage";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEmployeesPage from "./pages/AdminEmployeesPage";
import AdminProfilePage from "./pages/Adminprofile";
import EmployeeLoginPage from "./pages/EmployeeLoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import FixUpServices from "./pages/FixUpServices";
import ScrollToTop from "./components/ScrollToTop";
import FixUpBookingPage from "./components/FixUpBookingPage";
import PetConnectBookingPage from "./components/PetConnectBookingPage";
import H2GoBookingPage from "./components/H2GoBookingPage";
import GoRideConnectBookingPage from "./components/GoRideConnectBookingPage";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext"; // <-- Import CartProvider

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="main-container">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="content">
              <Routes>
                {/* Employee Routes */}
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee-login" element={<EmployeeLoginPage />} />
                <Route path="/employees" element={<EmployeesPage />} />

                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/admin-profile" element={<AdminProfilePage />} />
                <Route path="/admin/employees" element={<AdminEmployeesPage />} />

                {/* Booking Routes */}
                <Route path="/book/fixup" element={<FixUpBookingPage />} />
                <Route path="/book/petconnect" element={<PetConnectBookingPage />} />
                <Route path="/book/h2go" element={<H2GoBookingPage />} />
                <Route path="/book/gorideconnect" element={<GoRideConnectBookingPage />} />

                {/* User Routes */}
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/appointment-history" element={<AppointmentHistoryPage />} />

                {/* Services */}
                <Route path="/services" element={<FixUpServices />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;