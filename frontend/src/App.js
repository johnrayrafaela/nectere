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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="main-container">
        <AuthProvider>
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

              {/* User Routes */}
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/appointment-history" element={<AppointmentHistoryPage />} />

              {/* Services */}
              <Route path="/services" element={<FixUpServices />} />
            </Routes>
          </div>
          <Footer />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;