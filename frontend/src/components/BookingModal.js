// frontend/src/components/BookingModal.jsx

import React, { useState } from "react";
import "../styles/BookingModal.css";

// Import a QR image for each category
import fixupQR from "../assets/images/qr/QR-FixUp.png";
import h2goQR from "../assets/images/qr/QR-H2Go.png";
import petconnectQR from "../assets/images/qr/QR-PetConnect.png";
import wallfixQR from "../assets/images/qr/QR-GoRideConnect.png";

const categoryQR = {
  FixUp: fixupQR,
  H2Go: h2goQR,
  PetConnect: petconnectQR,
  WallFix: wallfixQR,
};

const categoryColors = {
  FixUp: "#e74c3c",
  H2Go: "#2980b9",
  PetConnect: "#b7986b",
  WallFix: "#a2836e",
};

const BookingModal = ({
  selectedService,
  formData,
  handleInputChange,
  handleBooking,
  closeBookingForm,
}) => {
  const qrImage = categoryQR[selectedService.category];
  const themeColor = categoryColors[selectedService.category] || "#e74c3c";

  // H2Go uses a number input; PetConnect uses a 1–20 kg dropdown
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  const isH2Go = selectedService.category === "H2Go";
  const isPetConnect = selectedService.category === "PetConnect";
  const isQuantityBased = isH2Go || isPetConnect;

  // Fixed delivery fee for H2Go
  const deliveryFee = isH2Go ? 50 : 0;

  // Calculate total price (including delivery fee for H2Go)
  const totalPrice = isQuantityBased
    ? selectedService.price * quantity + deliveryFee
    : selectedService.price;

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = isQuantityBased
      ? await handleBooking(e, quantity)
      : await handleBooking(e);

    if (result !== false) {
      setSuccessMsg(
        isQuantityBased ? "Product ordered successfully!" : "Booking successfully!"
      );
    }
  };

  return (
    <div className="booking-modal">
      <div className="booking-form" style={{ borderTop: `6px solid ${themeColor}` }}>
        <h3 style={{ color: themeColor }}>
          {isQuantityBased ? "Order" : "Book"} {selectedService.name}
        </h3>

        <p
          style={{
            textAlign: "center",
            margin: "0 0 12px 0",
            fontWeight: "bold",
            color: themeColor,
            letterSpacing: "1px",
          }}
        >
          Services: {selectedService.category}
        </p>

        {selectedService.shopcategory && (
          <p
            style={{
              textAlign: "center",
              margin: "0 0 12px 0",
              fontWeight: "bold",
              color: "#333",
              letterSpacing: "1px",
            }}
          >
            SHOP: {selectedService.shopcategory}
          </p>
        )}

        {successMsg && (
          <div
            className="success-message"
            style={{ color: "green", textAlign: "center", marginBottom: 10 }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label>
            First Name:
            <input type="text" name="firstname" value={formData.firstname} readOnly />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastname" value={formData.lastname} readOnly />
          </label>
          <label>
            Phone Number:
            <input type="text" name="phonenumber" value={formData.phonenumber} readOnly />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} readOnly />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </label>

          {/* H2Go: free-form number input */}
          {isH2Go && (
            <label>
              Quantity:
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                style={{ width: 80, marginLeft: 8 }}
                required
              />
            </label>
          )}

          {/* PetConnect: dropdown 1–20 kg */}
          {isPetConnect && (
            <label>
              Quantity (kg):
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ marginLeft: 8, padding: "4px" }}
                required
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} kg
                  </option>
                ))}
              </select>
              <span style={{ marginLeft: 8, color: "#555" }}>by kilo</span>
            </label>
          )}

          <label>
            Payment Method:
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
            </select>
          </label>

          {/* Show QR code if payment method is GCash */}
          {formData.paymentMethod === "gcash" && qrImage && (
            <div className="gcash-qr-section">
              <p style={{ textAlign: "center", margin: "10px 10px" }}>
                Scan this QR code to pay with GCash:
              </p>
              <img
                src={qrImage}
                alt="GCash QR Code"
                className="gcash-qr-img"
                style={{ display: "block", margin: "0 auto", maxWidth: "200px" }}
              />
            </div>
          )}

          {/* Delivery fee line for H2Go */}
          {isH2Go && (
            <div style={{ margin: "8px 0", color: themeColor }}>
              Delivery Fee: ₱{deliveryFee}
            </div>
          )}

          <div style={{ margin: "10px 0", fontWeight: "bold", color: themeColor }}>
            Total Price: ₱{totalPrice}
          </div>

          <div className="form-buttons">
            <button type="submit">
              {isQuantityBased ? "Confirm Order" : "Confirm Booking"}
            </button>
            <button type="button" onClick={closeBookingForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
