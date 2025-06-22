import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import fixupLogo from "../assets/images/logos/fixup.png";
import qrFixUp from "../assets/images/qr/QR-FixUp.png";
import "../styles/FixUpBooking.css";

const FixUpBookingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedService = location.state?.service;

  const [formData, setFormData] = useState({
    carDetails: {
      model: "",
      registrationNumber: "",
      currentMileage: "",
      modelOptional: ""
    },
    personalDetails: {
      firstname: "",
      lastname: "",
      phonenumber: "",
      email: "",
      address: "", // <-- add this
    },
    serviceDetails: {
      selectedService: selectedService?.name || "",
      serviceId: selectedService?._id || "",
      additionalInfo: "",
      idealDate: null,
      idealTime: "8am-9am",
      paymentMethod: "cash",
    }
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    // If no service is selected, redirect back to services page
    if (!selectedService) {
      navigate("/services?category=FixUp");
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        personalDetails: {
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          phonenumber: user.phonenumber || "",
          email: user.email || "",
          address: user.address || "", // <-- add this if user has address
        }
      }));
    }
  }, [user, selectedService, navigate]);

  const handleInputChange = (section, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    // Check user
    if (!user || !(user._id || user.id)) {
      setSubmitError("You must be logged in to book a service.");
      setLoading(false);
      return;
    }

    // Compose booking data for FixUp
    const bookingData = {
      userId: user._id || user.id,
      serviceId: formData.serviceDetails.serviceId,
      firstname: formData.personalDetails.firstname?.trim(),
      lastname: formData.personalDetails.lastname?.trim(),
      phonenumber: formData.personalDetails.phonenumber?.trim(),
      email: formData.personalDetails.email?.trim(),
      address: formData.personalDetails.address?.trim(),
      paymentMethod: formData.serviceDetails.paymentMethod,
      idealDate: formData.serviceDetails.idealDate,
      idealTime: formData.serviceDetails.idealTime,
      price: selectedService?.price || 0,
      additionalInfo: formData.serviceDetails.additionalInfo,
    };

    // Double-check all required fields are present and not empty
    for (const key of [
      "userId",
      "serviceId",
      "firstname",
      "lastname",
      "phonenumber",
      "email",
      "address",
      "paymentMethod",
      "idealDate",
      "idealTime"
    ]) {
      if (!bookingData[key]) {
        setSubmitError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || "Booking failed. Please try again.");
      } else {
        setSubmitSuccess("Booking submitted successfully!");
        setTimeout(() => {
          navigate("/services?category=FixUp");
          window.location.reload();
        }, 1200);
      }
    } catch (error) {
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeService = () => {
    navigate("/services?category=FixUp");
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        idealDate: e.target.value
      }
    }));
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <div className="container">
          <img src={fixupLogo} alt="FixUp Logo" className="booking-logo" />
          <div className="header-content">
            <h1>Book a Service</h1>
            <p>Please complete the form below to send a service request.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* 1. Car Details Section */}
        <section className="form-section">
          <h2>1. Your Car</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="carModel">Car Model *</label>
              <input
                type="text"
                id="carModel"
                name="model"
                value={formData.carDetails.model}
                onChange={(e) => handleInputChange('carDetails', e)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="regNumber">Car Registration Number *</label>
              <input
                type="text"
                id="regNumber"
                name="registrationNumber"
                value={formData.carDetails.registrationNumber}
                onChange={(e) => handleInputChange('carDetails', e)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="modelOptional">Can you tell us the model (optional)</label>
              <input
                type="text"
                id="modelOptional"
                name="modelOptional"
                value={formData.carDetails.modelOptional}
                onChange={(e) => handleInputChange('carDetails', e)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="mileage">Current Mileage (optional)</label>
              <input
                type="text"
                id="mileage"
                name="currentMileage"
                value={formData.carDetails.currentMileage}
                onChange={(e) => handleInputChange('carDetails', e)}
              />
            </div>
          </div>
        </section>

        {/* 2. Personal Details Section */}
        <section className="form-section">
          <h2>2. About you</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="firstname">First Name *</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.personalDetails.firstname}
                readOnly
              />
            </div>
            <div className="form-field">
              <label htmlFor="lastname">Last Name *</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.personalDetails.lastname}
                readOnly
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.personalDetails.email}
                readOnly
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phonenumber"
                value={formData.personalDetails.phonenumber}
                readOnly
              />
            </div>
            <div className="form-field">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.personalDetails.address || ""}
                onChange={(e) => handleInputChange('personalDetails', e)}
                required
              />
            </div>
          </div>
        </section>

        {/* 3. Service Selection Section */}
        <section className="form-section">
          <h2>3. Service Selected</h2>
          <div className="service-box">
            <span className="service-name">
              {selectedService ? (
                <>
                  <strong>{selectedService.name}</strong>
                  <br />
                  <span style={{ fontSize: "0.9em", color: "#666" }}>
                    Price: ₱{selectedService.price}
                  </span>
                </>
              ) : (
                "No service selected"
              )}
            </span>
            <button
              type="button"
              onClick={handleChangeService}
              className="change-service-btn"
            >
              Change Service
            </button>
          </div>
        </section>

        {/* 4. Appointment Section */}
        <section className="form-section">
          <h2>4. About your appointment</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="idealDate">Your Ideal Date *</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="date"
                  id="idealDate"
                  name="idealDate"
                  value={formData.serviceDetails.idealDate || ""}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="date-picker-input"
                  required
                  style={{ paddingRight: "2.2em" }}
                />
                <span
                  onClick={() => document.getElementById("idealDate").showPicker && document.getElementById("idealDate").showPicker()}
                  style={{
                    position: "absolute",
                    right: "0.7em",
                    cursor: "pointer",
                    color: "#888",
                    pointerEvents: "auto"
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Open calendar"
                >
                  {/* Calendar SVG icon */}
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#888" strokeWidth="2" fill="none"/>
                    <path d="M16 3v4M8 3v4" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 9h18" stroke="#888" strokeWidth="2"/>
                  </svg>
                </span>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="idealTime">Your Ideal Time *</label>
              <select
                id="idealTime"
                name="idealTime"
                value={formData.serviceDetails.idealTime}
                onChange={(e) => handleInputChange('serviceDetails', e)}
                required
              >
                <option value="8am-9am">8:00 AM - 9:00 AM</option>
                <option value="9am-10am">9:00 AM - 10:00 AM</option>
                <option value="10am-11am">10:00 AM - 11:00 AM</option>
                <option value="11am-12pm">11:00 AM - 12:00 PM</option>
                <option value="1pm-2pm">1:00 PM - 2:00 PM</option>
                <option value="2pm-3pm">2:00 PM - 3:00 PM</option>
                <option value="3pm-4pm">3:00 PM - 4:00 PM</option>
                <option value="4pm-5pm">4:00 PM - 5:00 PM</option>
              </select>
            </div>
            <div className="form-field full-width-field">
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.serviceDetails.additionalInfo}
                onChange={(e) => handleInputChange('serviceDetails', e)}
                placeholder="Please provide any additional information about your service request"
              />
            </div>
          </div>
        </section>

        {/* 5. Payment Section */}
        <section className="form-section">
          <h2>5. Payment</h2>
          <div className="payment-section">
            <div className="form-field">
              <label htmlFor="paymentMethod">Select Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.serviceDetails.paymentMethod}
                onChange={(e) => handleInputChange('serviceDetails', e)}
                required
              >
                <option value="cash">Cash</option>
                <option value="gcash">GCash</option>
              </select>
            </div>
            {formData.serviceDetails.paymentMethod === "gcash" && (
              <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 20
              }}>
                <p>
                  <strong>Scan this QR code to pay via GCash:</strong>
                </p>
                <img
                  src={qrFixUp}
                  alt="GCash QR Code"
                  style={{
                    width: 350,
                    height: 550,
                    objectFit: "contain",
                    margin: "12px 0",
                    display: "block",
                    borderRadius: 12,
                  }}
                />
                <p style={{ fontSize: "0.95em", marginTop: 8, color: "#555" }}>
                  Please scan and pay using GCash.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="privacy-section">
          <div className="privacy-checkbox">
            <input
              type="checkbox"
              id="privacyPolicy"
              name="privacyPolicy"
              required
            />
            <label htmlFor="privacyPolicy">I agree to the Privacy Policy</label>
          </div>
          <p className="privacy-text">
            We want you to feel confident that we take the privacy and security of your personal information very seriously. Tick the box to let us know you've read our{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{' '}
            before you continue.
          </p>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "SUBMIT"}
          </button>
          {submitError && <div className="error-message">{submitError}</div>}
          {submitSuccess && <div className="success-message">{submitSuccess}</div>}
        </div>
      </form>
    </div>
  );
};

export default FixUpBookingPage;