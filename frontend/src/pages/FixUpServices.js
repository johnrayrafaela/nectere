import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/ServicesPage.css";
import { useLocation } from "react-router-dom";
import BookingModal from "../components/BookingModal";

const categoryList = [
  { key: "FixUp", label: "FixUp", className: "fixup" },
  { key: "H2Go", label: "H2Go", className: "h2go" },
  { key: "PetConnect", label: "PetConnect", className: "petconnect" },
  { key: "Go Ride Connect", label: "Go Ride Connect", className: "goride" },
];

const shopCategories = {
  FixUp: ["", "Express Garage"],
  H2Go: ["Water Hub", "Water Express"],
  PetConnect: ["Pet Mall", "Pet Express"],
  "Go Ride Connect": ["Ride Center", "Ride Express"],
};

const Services = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("FixUp");
  const [selectedShop, setSelectedShop] = useState(""); // <-- Shop selection
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
    if (category && categoryList.some(cat => cat.key === category)) {
      setSelectedCategory(category);
    }
  }, [location.search]);

  useEffect(() => {
    // Reset shop when category changes
    setSelectedShop(shopCategories[selectedCategory][0]);
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      const serviceRes = await fetch("http://localhost:5000/api/cleaning-services");
      if (!serviceRes.ok) throw new Error("Failed to fetch services");
      const servicesData = await serviceRes.json();
      setServices(servicesData);
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
    if (!selectedService) {
      alert("No service selected.");
      return;
    }
    if (!user || !user.id) {
      alert("You must be logged in to book a service.");
      return;
    }
    const requiredFields = ["firstname", "lastname", "phonenumber", "email", "address"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }
    try {
      const bookingPayload = {
        userId: user.id,
        serviceId: selectedService._id,
        ...formData,
        shopcategory: selectedShop, // <-- Include shopcategory in booking
      };
      if (selectedService.category === "H2Go") {
        bookingPayload.quantity = quantity;
      }
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed");
      if (selectedService.category === "H2Go") {
        alert("Product ordered successfully!");
      } else {
        alert("Service booked successfully!");
      }
      closeBookingForm();
      fetchServices();
    } catch (err) {
      console.error("Booking Error:", err);
      alert(err.message);
    }
  };

  // Group services by subcategory and display them with a heading
  const renderServicesByCategory = () => {
    // Filter by category and shop
    const filteredServices = services.filter(
      (service) =>
        service.category === selectedCategory &&
        (!selectedShop || service.shopcategory === selectedShop)
    );

    // Group by subcategory
    const grouped = {};
    filteredServices.forEach((service) => {
      const subcat = service.subcategory || "Uncategorized";
      if (!grouped[subcat]) grouped[subcat] = [];
      grouped[subcat].push(service);
    });

    return (
      <div>
        <h3>{selectedCategory} Services</h3>
        {Object.keys(grouped).length === 0 && (
          <p style={{ color: "#888" }}>No services available for this shop.</p>
        )}
        {Object.keys(grouped).map((subcat) => (
          <div key={subcat} style={{ marginBottom: 32 }}>
            <h4 style={{ color: "#e74c3c", 
                margin: "18px 0 12px 0", 
                fontSize: "1.6rem",
                fontWeight: "bold"}}>
              {subcat}
            </h4>
            <div className="services-list">
              {grouped[subcat].map((service) => (
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
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="services-container">
      <h2>
        {selectedCategory ? `${selectedCategory} Services` : "Our Services"}
      </h2>
      {/* Shop Category Navbar */}
      <div style={{ margin: "16px 0", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {shopCategories[selectedCategory].map((shop) => (
          <button
            key={shop}
            className={`shop-nav-btn${selectedShop === shop ? " active" : ""}`}
            style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border: selectedShop === shop ? "2px solid #e74c3c" : "1px solid #ccc",
              background: selectedShop === shop ? "#e74c3c" : "#fff",
              color: selectedShop === shop ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onClick={() => setSelectedShop(shop)}
          >
            {shop}
          </button>
        ))}
      </div>
      {loading && <p>Loading services...</p>}
      {error && <p className="error">{error}</p>}

      {/* Render Services for Selected Category and Shop */}
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