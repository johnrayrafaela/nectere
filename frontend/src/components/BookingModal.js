import React from "react";
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

const BookingModal = ({
  selectedService,
  formData,
  handleInputChange,
  handleBooking,
  closeBookingForm,
}) => {
  // Get the QR code based on the selected service's category
  const qrImage = categoryQR[selectedService.category];

  return (
    <div className="booking-modal">
      <div className="booking-form">
        <h3>Book {selectedService.name}</h3>
        <form onSubmit={handleBooking}>
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
          <label>
            Payment Method:
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
            </select>
          </label>
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
          <div className="form-buttons">
            <button type="submit">Confirm Booking</button>
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