import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/ServicesPage.css";
import { useLocation } from "react-router-dom";
import BookingModal from "../components/BookingModal";

const categoryList = [
  { key: "FixUp", label: "FixUp", className: "fixup" },
  { key: "H2Go", label: "H2Go", className: "h2go" },
  { key: "PetConnect", label: "PetConnect", className: "petconnect" },
  { key: "WallFix & Style", label: "WallFix & Style", className: "wallfix" }, // updated
];

const Services = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("FixUp");
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
      };
      // Only add quantity if H2Go
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

  const renderServicesByCategory = () => {
    const filteredServices = services.filter((service) => service.category === selectedCategory);
    return (
      <div>
        <h3>{selectedCategory} Services</h3>
        <div className="services-list">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className={`service-card ${
                service.category === "FixUp"
                  ? "fixup"
                  : service.category === "H2Go"
                  ? "h2go"
                  : service.category === "PetConnect"
                  ? "petconnect"
                  : service.category === "WallFix & Style" // updated
                  ? "wallfix"
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
    );
  };

  return (
    <div className="services-container">
      <h2>
        {selectedCategory ? `${selectedCategory} Services` : "Our Services"}
      </h2>
      {loading && <p>Loading services...</p>}
      {error && <p className="error">{error}</p>}

      {/* Render Services for Selected Category */}
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