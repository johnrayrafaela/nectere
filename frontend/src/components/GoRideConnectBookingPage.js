import React, { useState, useContext, useEffect, useMemo } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/GoRideConnectCarDetails.css"; // Reuse the car details CSS for theme

// Imports for cars
import t1 from "../assets/images/grc/t1.jpg";
import t2 from "../assets/images/grc/t2.jpg";
import t3 from "../assets/images/grc/t3.jpg";
import t4 from "../assets/images/grc/t4.jpg";
import s1 from "../assets/images/grc/s1.jpg";
import s2 from "../assets/images/grc/s2.jpg";
import s3 from "../assets/images/grc/s3.jpg";
import s4 from "../assets/images/grc/s4.jpg";
import h1 from "../assets/images/grc/h1.jpg";
import h2 from "../assets/images/grc/h2.jpg";
import h3 from "../assets/images/grc/h3.jpg";
import h4 from "../assets/images/grc/h4.jpg";
import n1 from "../assets/images/grc/n1.jpg";
import n2 from "../assets/images/grc/n2.jpg";
import n3 from "../assets/images/grc/n3.jpg";
import n4 from "../assets/images/grc/n4.jpg";
import i1 from "../assets/images/grc/i1.jpg";
import i2 from "../assets/images/grc/i2.jpg";
import i3 from "../assets/images/grc/i3.jpg";
import i4 from "../assets/images/grc/i4.jpg";

// Move carImagesMap outside the component since it's static
const carImagesMap = {
  "Toyota Vios Sedan": [t1, t2, t3, t4],
  "Suzuki XL7 SUV": [s1, s2, s3, s4],
  "Nissan NV350": [n1, n2, n3, n4],
  "Toyota HiAce": [h1, h2, h3, h4],
  "Toyota Innova": [i1, i2, i3, i4],
};

const GoRideConnectBookingPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    address: "",
    paymentMethod: "cash",
    deliveryDate: "",
    deliveryTime: "",
    dropoffDate: "",
    dropoffTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use service.images (array) if available, else fallback to single image or demo images
  const images = useMemo(() => {
    // Use backend images if present
    if (service?.images && Array.isArray(service.images) && service.images.length > 0) {
      return service.images.map(img =>
        img.startsWith("http") ? img : `http://localhost:5000/uploads/${img}`
      );
    }
    // Use mapped images for known car names
    if (service?.name && carImagesMap[service.name]) {
      return carImagesMap[service.name];
    }
    // Fallback to a single image or demo images
    if (service?.image) {
      return [
        service.image.startsWith("http")
          ? service.image
          : `http://localhost:5000/uploads/${service.image}`,
      ];
    }
    // Default fallback images
    return [t1, t2, t3, t4];
  }, [service]);

  const [mainImage, setMainImage] = useState(images[0]);
  useEffect(() => {
    setMainImage(images[0] || "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&w=600");
  }, [service, images]); // Reset main image when service or images change

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        phonenumber: user.phonenumber || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isYukimura = service?.shopcategory === "YUKIMURA RENTAL CARS";
  const destinationOptions = [
    { label: "Simala", value: "Simala", price: 5000 },
    { label: "Oslob", value: "Oslob", price: 7000 },
    { label: "Airport", value: "Airport", price: 5000 },
  ];

  const [destination, setDestination] = useState("");
  const selectedDestination = destinationOptions.find(opt => opt.value === destination);

  const price = isYukimura
    ? (selectedDestination ? `₱${selectedDestination.price}` : "")
    : service?.price
      ? `₱${service.price} Unit Price`
      : "₱1399 - ₱1599 Unit Price";

  // Calculate total price for Go Ride Connect (Yukimura: base + destination)
  const basePrice = service?.price || 0;
  const destinationPrice = isYukimura ? (selectedDestination?.price || 0) : 0;
  const totalPrice = isYukimura
    ? basePrice + destinationPrice
    : basePrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !user ||
      !service ||
      !service._id ||
      !formData.firstname ||
      !formData.lastname ||
      !formData.phonenumber ||
      !formData.email ||
      !formData.address ||
      !formData.paymentMethod ||
      !formData.deliveryDate ||
      !formData.deliveryTime ||
      !formData.dropoffDate ||
      !formData.dropoffTime ||
      (isYukimura && !destination)
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id || user._id,
          serviceId: service._id,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phonenumber: formData.phonenumber,
          email: formData.email,
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          dropoffDate: formData.dropoffDate,
          dropoffTime: formData.dropoffTime,
          quantity: 1,
          ...(isYukimura && {
            destination,
            basePrice: basePrice,         // service price
            price: destinationPrice,      // destination price
            // totalPrice: basePrice + destinationPrice, // optional, for reference
          }),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Booking failed.");
      } else {
        setSuccess("Booking submitted successfully!");
        setTimeout(() => {
          navigate("/services?category=Go%20Ride%20Connect");
        }, 1500);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const carName = service?.name || "Go Ride Connect Service";
  const carDesc =
    service?.description ||
    "Book your Go Ride Connect service. Fast, safe, and reliable transportation for your needs.";

  return (
    <div className="grc-details-container" style={{ background: "#fff" }}>
      <div className="grc-breadcrumb">
        <span>
          Home / Go Ride Connect / {carName}
        </span>
      </div>
      <div className="grc-main">
        <div className="grc-images">
          {/* Enlarged main image */}
          <img
            className="grc-main-img"
            src={mainImage}
            alt="Main car"
          />
          <div className="grc-thumbnails">
            {images.map((img, idx) => (
              <img
                key={img + idx}
                src={img}
                alt={`thumb${idx + 1}`}
                className={mainImage === img ? "selected" : ""}
                onClick={() => setMainImage(img)}
                tabIndex={0}
              />
            ))}
          </div>
        </div>
        <div className="grc-info">
          <h1>{carName}</h1>
          <div className="grc-price">
            {isYukimura
              ? <>Differs from destination {selectedDestination && <span>{price}</span>}</>
              : <>From <span>{price}</span></>
            }
          </div>
          {/* Show total price */}
          <div style={{ fontWeight: "bold", color: "#27ae60", marginBottom: 12 }}>
            Total Price: ₱{totalPrice ? totalPrice.toLocaleString() : "0"}
          </div>
          <form onSubmit={handleSubmit} className="fixup-booking-form">
            <div className="grc-form-2col">
              <div>
                <label>
                  First Name:
                  <input type="text" name="firstname" value={formData.firstname} readOnly />
                </label>
              </div>
              <div>
                <label>
                  Last Name:
                  <input type="text" name="lastname" value={formData.lastname} readOnly />
                </label>
              </div>
              <div>
                <label>
                  Phone Number:
                  <input type="text" name="phonenumber" value={formData.phonenumber} readOnly />
                </label>
              </div>
              <div>
                <label>
                  Email:
                  <input type="email" name="email" value={formData.email} readOnly />
                </label>
              </div>
              <div>
                <label>
                  Pickup Date &amp; Time
                  <div className="grc-date-row">
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="time"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </label>
              </div>
              <div>
                <label>
                  Dropoff Date &amp; Time
                  <div className="grc-date-row">
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="time"
                      name="dropoffTime"
                      value={formData.dropoffTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </label>
              </div>
              <div>
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
              </div>
              {/* DESTINATION DROPDOWN FOR YUKIMURA ONLY */}
              {isYukimura && (
                <div>
                  <label>
                    Destination:
                    <select
                      name="destination"
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      required
                    >
                      <option value="">Select destination</option>
                      {destinationOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} - ₱{opt.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
              <div>
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
              </div>
              <div>
                <button className="goride-button" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Book Now"}
                </button>
              </div>
            </div>
            {error && <div>{error}</div>}
            {success && <div>{success}</div>}
          </form>
          <div className="grc-category">
            Category: <span>Go Ride Connect</span>
          </div>
        </div>
      </div>
      <div className="grc-description-section">
        <div className="grc-tabs">
          <div className="grc-tab grc-tab-active">Description</div>
        </div>
        <div className="grc-description">
          {carDesc}
        </div>
      </div>
    </div>
  );
};

export default GoRideConnectBookingPage;