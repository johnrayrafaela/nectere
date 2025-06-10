import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import qrH2Go from "../assets/images/qr/QR-H2Go.png";
import "../styles/H2GoBookingPage.css";

// Delivery locations and fees from your image
const DELIVERY_LOCATIONS = [
  { loc: "UPPER PLANTA", fee: 40 }, { loc: "POBLACION", fee: 40 }, { loc: "LURAY", fee: 35 }, { loc: "DRILING", fee: 30 }, { loc: "KUNNEK BRO", fee: 30 }, { loc: "LAWS", fee: 30 }, { loc: "SANGI", fee: 30 },
  { loc: "DAANLUNGSOD", fee: 40 }, { loc: "DUMLUG", fee: 50 }, { loc: "CAMANCHILIS", fee: 60 }, { loc: "TALAVERA", fee: 70 }, { loc: "CALONG2", fee: 80 }, { loc: "MATAR ANG", fee: 90 }, { loc: "MARAAT", fee: 115 },
  { loc: "MAINGGIT", fee: 130 }, { loc: "ARPIL", fee: 150 }, { loc: "BUANOY", fee: 160 }, { loc: "ABUCAYAN", fee: 170 }, { loc: "PONDOL", fee: 180 }, { loc: "BALAMBAN", fee: 190 }, { loc: "CAMBUHAWE", fee: 195 },
  { loc: "PRENZA", fee: 195 }, { loc: "CANTUOD", fee: 215 }, { loc: "OWAK", fee: 230 }, { loc: "ASTURIAS", fee: 305 }, { loc: "TUBIGAGMANOK", fee: 345 }, { loc: "TUBURAN", fee: 345 },
  { loc: "ILIHAN", fee: 50 }, { loc: "KABULIHAN", fee: 75 }, { loc: "MAGDUGO", fee: 85 }, { loc: "UPPERMAGDUGO", fee: 105 }, { loc: "PANOG", fee: 105 }, { loc: "MEDIAONCE", fee: 135 },
  { loc: "BULONGAN SUDLON", fee: 140 }, { loc: "PANDONG BATO", fee: 160 }, { loc: "POOG", fee: 170 }, { loc: "LUTOPAN", fee: 180 }, { loc: "CANTABACO", fee: 185 }, { loc: "APID", fee: 235 },
  { loc: "ALIMANGO", fee: 235 }, { loc: "HARDEN", fee: 55 }, { loc: "CARMEN", fee: 70 }, { loc: "CANLUMAMPAO", fee: 70 }, { loc: "ANISLAG", fee: 90 }, { loc: "CAMBAN OG", fee: 115 },
  { loc: "DAKIT", fee: 115 }, { loc: "CASOY", fee: 185 }, { loc: "TUBOD", fee: 50 }, { loc: "LANDAHAN", fee: 50 }, { loc: "SUN OK", fee: 130 }, { loc: "SAGAY", fee: 195 },
  { loc: "CABIANOG", fee: 145 }, { loc: "ALETH", fee: 75 },
  { loc: "IBO", fee: 50 }, { loc: "ANGKAY", fee: 70 }, { loc: "CABITOONAN", fee: 70 }, { loc: "BATO", fee: 90 }, { loc: "AWIHAO", fee: 105 }, { loc: "TAJAO", fee: 105 },
  { loc: "CABIANOGN", fee: 125 }, { loc: "PANDAAN", fee: 135 }, { loc: "PINAMUNGAJAN PROPER", fee: 165 }, { loc: "MANGOTO", fee: 215 }, { loc: "BONBON", fee: 215 }, { loc: "ALOGINSAN", fee: 245 },
  { loc: "SINSIN", fee: 105 }, { loc: "LAGUNA", fee: 105 }, { loc: "LOWERCAMPO", fee: 185 }, { loc: "UPPERCABIANGON", fee: 195 }, { loc: "PANOG", fee: 115 },
  { loc: "NAGA", fee: 495 }, { loc: "MINGLANILLA", fee: 695 }, { loc: "TALISAY", fee: 795 }, { loc: "CEBU CITY", fee: 795 }, { loc: "CARCAR", fee: 795 }, { loc: "MOAL-BOAL", fee: 895 },
  { loc: "BARILI", fee: 895 }, { loc: "BOGO", fee: 1595 }
];

const H2GoBookingPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;

  // Guard: If no service, redirect or show error
  useEffect(() => {
    if (!service) {
      navigate("/services?category=PetConnect");
    }
  }, [service, navigate]);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phonenumber: user?.phonenumber || "",
    address: "",
    apartment: "",
    paymentMethod: "bank",
    quantity: 1, // <-- add this
  });
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Prefill user info if it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: user?.email || "",
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phonenumber: user?.phonenumber || "",
    }));
  }, [user]);

  // Update delivery fee when address changes
  useEffect(() => {
    const found = DELIVERY_LOCATIONS.find(
      (loc) => loc.loc === formData.address
    );
    setDeliveryFee(found ? found.fee : 0);
  }, [formData.address]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    // Compose booking data for backend (no region/city)
    const bookingData = {
      userId: user?._id || user?.id,
      serviceId: service?._id,
      serviceName: service?.name,
      price: service?.price,
      firstname: formData.firstname,
      lastname: formData.lastname,
      phonenumber: formData.phonenumber,
      email: formData.email,
      address: formData.address + (formData.apartment ? ", " + formData.apartment : ""),
      paymentMethod: formData.paymentMethod,
      deliveryFee,
      quantity: Number(formData.quantity) || 1, // <-- use the actual quantity from formData
      totalAmount, // <-- also send totalAmount if you want to save it
    };

    for (const key of ["userId", "serviceId", "firstname", "lastname", "email", "address", "paymentMethod"]) {
      if (!bookingData[key]) {
        setSubmitError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.message || "Booking failed. Please try again.");
      } else {
        setSubmitSuccess("Order submitted successfully!");
        setTimeout(() => {
          navigate("/services?category=H2Go");
          window.location.reload(); // Optional: force refresh if you want a clean state
        }, 1200); // 1.2 seconds delay so user sees the success message
      }
    } catch (error) {
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null; // Prevent rendering if no service

  const totalAmount =
  ((Number(service?.price) || 0) * (Number(formData.quantity) || 1)) +
  (Number(deliveryFee) || 0);

  return (
    <form className="h2go-order-page" onSubmit={handleSubmit}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Left: Main Form */}
        <div className="h2go-order-form" style={{ flex: 1 }}>
          {/* Show selected service name and price */}
          <div style={{ marginBottom: 20 }}>
            
          </div>

          <h2>Contact</h2>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email or mobile phone number"
            className="h2go-input"
            onChange={handleInputChange}
            required
          />

          <div className="h2go-row">
            <input
              className="h2go-input"
              name="firstname"
              placeholder="First name"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
            <input
              className="h2go-input"
              name="lastname"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </div>
          <input
            className="h2go-input"
            name="phonenumber"
            placeholder="Phone number"
            value={formData.phonenumber}
            onChange={handleInputChange}
            required
          />
          {/* Address dropdown */}
          <select
            className="h2go-input"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          >
            <option value="">Select delivery location</option>
            {DELIVERY_LOCATIONS.map((loc) => (
              <option key={loc.loc} value={loc.loc}>
                {loc.loc} (₱{loc.fee})
              </option>
            ))}
          </select>
          <input
            className="h2go-input"
            name="apartment"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.apartment}
            onChange={handleInputChange}
          />
          <h2>Quantity</h2>
          <input
            className="h2go-input"
            type="number"
            name="quantity"
            min={1}
            value={formData.quantity || 1}
            onChange={handleInputChange}
            required
          />

          <h2>Payment</h2>
          <div>
            <div>
              <label htmlFor="paymentMethod">Select Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              >
                <option value="cash">Cash</option>
                <option value="gcash">GCash QR</option>
              </select>
            </div>
            {formData.paymentMethod === "gcash" && (
              <div className="h2go-payment-details" style={{ textAlign: "center", marginTop: 10 }}>
                <p>
                  <strong>Scan this QR code to pay via GCash:</strong>
                </p>
                <img
                  src={qrH2Go}
                  alt="GCash QR Code"
                  style={{ width: 300, height: 500, margin: "0 auto" }}
                />
              </div>
            )}
          </div>

          <div className="h2go-summary-totals" style={{ marginTop: 24 }}>
            <div className="h2go-summary-row">
              <span>Quantity</span>
              <span>{formData.quantity || 1}</span>
            </div>
            <div className="h2go-summary-row">
              <span>Subtotal</span>
              <span>
                ₱{((Number(service?.price) || 0) * (Number(formData.quantity) || 1)).toLocaleString()}
              </span>
            </div>
            <div className="h2go-summary-row">
              <span>Delivery Fee</span>
              <span>₱{deliveryFee}</span>
            </div>
            <div className="h2go-summary-row h2go-summary-total" style={{ fontWeight: "bold", fontSize: "1.15em", marginTop: 8 }}>
              <span>Total Amount</span>
              <span>
                ₱{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <button className="h2go-complete-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Complete order"}
          </button>
          {submitError && <div className="error-message">{submitError}</div>}
          {submitSuccess && <div className="success-message">{submitSuccess}</div>}
        </div>

        {/* Right: Order Summary */}
        <div
          className="h2go-order-summary"
          style={{
            padding: 32,
            flex: "0 0 440px",
            marginLeft: "auto",
            marginRight: 0,
            position: "relative",
            top: 0,
            right: 0,
            alignSelf: "flex-start",
            background: "#e3f0ff",
            borderRadius: 18,
            boxShadow: "0 4px 24px rgba(41,128,185,0.10)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="h2go-summary-product"
            style={{
              gap: 24,
              alignItems: "center",
              flexDirection: "column",
              display: "flex",
              width: "100%",
            }}
          >
            <img
              src={
                service?.image
                  ? `http://localhost:5000/uploads/${service.image}`
                  : "https://cdn.shopify.com/s/files/1/0571/4381/8376/products/AoziLambAppleAdult10kg_1_360x.png"
              }
              alt="Product"
              className="h2go-summary-img"
              style={{
                width: 280,
                height: 280,
                objectFit: "cover",
                borderRadius: 16,
                border: "2px solid #b3d8ff",
                background: "#fff",
                boxShadow: "0 2px 12px rgba(41,128,185,0.10)",
                marginBottom: 18,
                display: "block",
              }}
            />
            <div style={{ textAlign: "center", width: "100%" }}>
              <div
                className="h2go-summary-title"
                style={{
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  marginBottom: 8,
                  color: "#1565c0",
                }}
              >
                {service?.name || "Product"}
              </div>
              <div
                className="h2go-summary-price"
                style={{
                  color: "#2980b9",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  marginBottom: 10,
                }}
              >
                ₱{service?.price || "0.00"}
              </div>
              <div style={{ marginTop: 10, fontSize: "1.08rem", color: "#1565c0" }}>
                <strong>Delivery Location:</strong>{" "}
                {formData.address || <span style={{ color: "#aaa" }}>N/A</span>}
                <br />
                <strong>Delivery Fee:</strong> ₱{deliveryFee}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </form>
  );
};

export default H2GoBookingPage;