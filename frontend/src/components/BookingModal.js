import React, { useState } from "react";
import "../styles/BookingModal.css";

// Import a QR image for each category
import fixupQR from "../assets/images/bg.jpg";
import h2goQR from "../assets/images/default_profile.jpg";
import petconnectQR from "../assets/images/FreshStart.png";
import wallfixQR from "../assets/images/rey.jpg";

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
  // Get the QR code and color based on the selected service's category
  const qrImage = categoryQR[selectedService.category];
  const themeColor = categoryColors[selectedService.category] || "#e74c3c";

  // H2Go: Quantity state
  const [quantity, setQuantity] = useState(1);

  // Success message state
  const [successMsg, setSuccessMsg] = useState("");

  // Calculate total price for H2Go, otherwise use base price
  const totalPrice =
    selectedService.category === "H2Go"
      ? (selectedService.price * quantity)
      : selectedService.price;

  // Wrap the booking handler to include quantity for H2Go
  const onSubmit = async (e) => {
    e.preventDefault();
    if (selectedService.category === "H2Go") {
      const result = await handleBooking(e, quantity);
      if (result !== false) setSuccessMsg("Product ordered successfully!");
    } else {
      const result = await handleBooking(e);
      if (result !== false) setSuccessMsg("Booking successfully!");
    }
  };

  return (
    <div className="booking-modal">
      <div className="booking-form" style={{ borderTop: `6px solid ${themeColor}` }}>
        <h3 style={{ color: themeColor }}>Book {selectedService.name}</h3>
        <p style={{
          textAlign: "center",
          margin: "0 0 12px 0",
          fontWeight: "bold",
          color: themeColor,
          letterSpacing: "1px"
        }}>
          SHOP: {selectedService.category}
        </p>
        {successMsg && (
          <div className="success-message" style={{ color: "green", textAlign: "center", marginBottom: 10 }}>
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
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
          </label>
          {/* H2Go: Quantity Selector */}
          {selectedService.category === "H2Go" && (
            <label>
              Quantity:
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                style={{ width: 80, marginLeft: 8 }}
                required
              />
            </label>
          )}
          <label>
            Payment Method:
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
            </select>
          </label>
          {/* Show QR if GCash */}
          {formData.paymentMethod === "gcash" && qrImage && (
            <div className="gcash-qr-section">
              <p style={{ textAlign: "center", margin: "10px 10px 10px 10px" }}>
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
          <div style={{ margin: "10px 0", fontWeight: "bold", color: themeColor }}>
            Total Price: ₱{totalPrice}
          </div>
          <div className="form-buttons">
            <button type="submit">
              {selectedService.category === "H2Go" ? "Confirm Order" : "Confirm Booking"}
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