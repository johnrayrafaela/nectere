import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/ServicesPage.css";
import { useLocation } from "react-router-dom";
import BookingModal from "../components/BookingModal";

import fixupLogo from "../assets/images/FreshStart.png";
import h2goLogo from "../assets/images/FreshStart.png";
import petconnectLogo from "../assets/images/FreshStart.png";
import gorideLogo from "../assets/images/FreshStart.png";

const categoryList = [
  { key: "FixUp", label: "FixUp", className: "fixup" },
  { key: "H2Go", label: "H2Go", className: "h2go" },
  { key: "PetConnect", label: "PetConnect", className: "petconnect" },
  { key: "Go Ride Connect", label: "Go Ride Connect", className: "goride" },
];

const shopCategories = {
  FixUp: ["Main Garage", "Express Garage"],
  H2Go: ["Water Hub", "Water Express"],
  PetConnect: ["Pet Mall", "Pet Express"],
  "Go Ride Connect": ["Ride Center", "Ride Express"],
};

const allSubcategories = {
  FixUp: [
    "Oil Change",
    "Engine Repair",
    "Under Chassis Repair",
    "Wirings",
    "Brake System",
    "Engine Cooling System",
  ],
  H2Go: ["Water Delivery", "Refill Station", "Purified", "Minerals"],
  PetConnect: ["Grooming", "Pet Supplies", "Veterinary", "Boarding"],
  "Go Ride Connect": [
    "Car Rental",
    "Motorcycle Rental",
    "Bike Rental",
    "Chauffeur Service",
  ],
};

const categoryLogos = {
  FixUp: fixupLogo,
  H2Go: h2goLogo,
  PetConnect: petconnectLogo,
  "Go Ride Connect": gorideLogo,
};

const Services = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("FixUp");
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // New state for subcategory filter
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    address: "",
    paymentMethod: "cash",
  });

  const location = useLocation();

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category && categoryList.some((cat) => cat.key === category)) {
      setSelectedCategory(category);
    }
  }, [location.search]);

  useEffect(() => {
    setSelectedShop(shopCategories[selectedCategory][0]);
    setSelectedSubcategory(""); // Reset subcategory filter on category change
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cleaning-services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openBookingForm = (service) => {
    if (!user || !user.id) {
      alert("You must be logged in to book a service.");
      return;
    }
    setSelectedService(service);
    setShowForm(true);
  };

  const closeBookingForm = () => {
    setShowForm(false);
    setSelectedService(null);
    setFormData((prev) => ({ ...prev, address: "", paymentMethod: "cash" }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e, quantity) => {
    e.preventDefault();
    if (!selectedService) return alert("No service selected.");
    if (!user || !user.id) return alert("You must be logged in to book a service.");

    const required = ["firstname", "lastname", "phonenumber", "email", "address"];
    for (const field of required) {
      if (!formData[field]) return alert(`Please fill out the ${field} field.`);
    }

    try {
      const bookingPayload = {
        userId: user.id,
        serviceId: selectedService._id,
        ...formData,
        shopcategory: selectedShop,
      };
      if (selectedService.category === "H2Go") {
        bookingPayload.quantity = quantity;
      }

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      alert(
        selectedService.category === "H2Go"
          ? "Product ordered successfully!"
          : "Service booked successfully!"
      );
      closeBookingForm();
      fetchServices();
    } catch (err) {
      console.error("Booking Error:", err);
      alert(err.message);
    }
  };

  // Subcategories to show in dropdown (based on selectedCategory)
  const subcategoriesForDropdown = allSubcategories[selectedCategory] || [];

  const renderServicesByCategory = () => {
    const filtered = services.filter(
      (s) =>
        s.category === selectedCategory &&
        (!selectedShop || s.shopcategory === selectedShop) &&
        (selectedSubcategory ? s.subcategory === selectedSubcategory : true)
    );

    // Group by subcategory
    const grouped = {};
    filtered.forEach((s) => {
      const subcat = s.subcategory || "Uncategorized";
      if (!grouped[subcat]) grouped[subcat] = [];
      grouped[subcat].push(s);
    });

    // If a subcategory is selected, show only that group; else show all subcats in the category
    const subcats = selectedSubcategory
      ? [selectedSubcategory]
      : allSubcategories[selectedCategory] || ["Uncategorized"];

    return (
      <div>
        <h3>{selectedCategory} Services</h3>

        {/* Subcategory dropdown filter */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="subcategory-filter"
            style={{ marginRight: "10px", fontWeight: "bold", color: "#fff" }}
          >
            Filter by category:
          </label>
          <select
            id="subcategory-filter"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            style={{ padding: "6px", fontSize: "1rem" }}
          >
            <option value="">All</option>
            {subcategoriesForDropdown.map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>

        {subcats.map((subcat) => (
          <div key={subcat} style={{ marginBottom: 32 }}>
            <h4
              style={{
                color: "#e74c3c",
                margin: "18px 0 12px 0",
                fontSize: "1.6rem",
                fontWeight: "bold",
              }}
            >
              {subcat}
            </h4>
            <div className="services-list">
              {grouped[subcat]?.length > 0 ? (
                grouped[subcat].map((service) => (
                  <div
                    key={service._id}
                    className={`service-card ${
                      service.category === "FixUp"
                        ? "fixup"
                        : service.category === "H2Go"
                        ? "h2go"
                        : service.category === "PetConnect"
                        ? "petconnect"
                        : service.category === "Go Ride Connect"
                        ? "goride"
                        : ""
                    }`}
                  >
                    {service.image && (
                      <img
                        src={`http://localhost:5000/uploads/${service.image}`}
                        alt={service.name}
                        className="service-image"
                      />
                    )}
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <p>Price: ₱{service.price}</p>
                    <button
                      onClick={() => openBookingForm(service)}
                      disabled={!user || !user.id}
                      title={!user || !user.id ? "Log in to book" : ""}
                    >
                      {service.category === "H2Go" ? "Order Now" : "Book Now"}
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: "#888" }}>
                  No services available in this subcategory.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="services-container">
      {/* Logo and Title Side-by-Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // centers horizontally
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {categoryLogos[selectedCategory] && (
          <img
            src={categoryLogos[selectedCategory]}
            alt={`${selectedCategory} Logo`}
            style={{ maxWidth: "120px", height: "auto" }}
          />
        )}
        <h2 style={{ margin: 0 }}>
          {selectedCategory ? `${selectedCategory} Services` : "Our Services"}
        </h2>
      </div>

      {/* Shop Category Navbar */}
      <div
        style={{
          margin: "16px 0",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {shopCategories[selectedCategory].map((shop) => (
          <button
            key={shop}
            className={`shop-nav-btn${selectedShop === shop ? " active" : ""}`}
            style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border:
                selectedShop === shop ? "2px solid #e74c3c" : "1px solid #ccc",
              background: selectedShop === shop ? "#e74c3c" : "#fff",
              color: selectedShop === shop ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onClick={() => setSelectedShop(shop)}
          >
            {shop}
          </button>
        ))}
      </div>

      {loading && <p>Loading services...</p>}
      {error && <p className="error">{error}</p>}

      {renderServicesByCategory()}

      {showForm && selectedService && (
        <BookingModal
          selectedService={selectedService}
          formData={formData}
          handleInputChange={handleInputChange}
          handleBooking={handleBooking}
          closeBookingForm={closeBookingForm}
        />
      )}
    </div>
  );
};

export default Services;
