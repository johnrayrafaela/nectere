// frontend/src/pages/ServicesPage.jsx

import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/ServicesPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // <-- Import useCart

import fixupLogo from "../assets/images/logos/fixup.png";
import h2goLogo from "../assets/images/logos/h2go.png";
import petconnectLogo from "../assets/images/logos/petconnect.png";
import gorideLogo from "../assets/images/logos/goride.png";

const categoryList = [
  { key: "FixUp", label: "FixUp", className: "fixup" },
  { key: "H2Go", label: "H2Go", className: "h2go" },
  { key: "PetConnect", label: "PetConnect", className: "petconnect" },
  { key: "Go Ride Connect", label: "Go Ride Connect", className: "goride" },
];

const shopCategories = {
  FixUp: ["KEN", "KJK"],
  H2Go: ["AQUA BEA WATER REFILLING STATION", "ABC WATER REFILLING STATION"],
  PetConnect: ["PET HUB", "PET DYNASTY"],
  "Go Ride Connect": ["CHARMZKRYLE RENT A CAR", "YUKIMURA RENTAL CARS"],
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
  PetConnect: ["Dog Food Puppy ", "Dog Food Adult", "Shampoo"],
  "Go Ride Connect": [],
};

const categoryLogos = {
  FixUp: fixupLogo,
  H2Go: h2goLogo,
  PetConnect: petconnectLogo,
  "Go Ride Connect": gorideLogo,
};

// Dummy shop addresses for each shopcategory
const shopAddresses = {
  "KEN": "123 Ken St., Balamban, Cebu",
  "KJK": "456 KJK Ave., Balamban, Cebu",
  "AQUA BEA WATER REFILLING STATION": "789 Aqua Bea Rd., Balamban, Cebu",
  "ABC WATER REFILLING STATION": "101 ABC St., Balamban, Cebu",
  "PET HUB": "202 Pet Hub Lane, Balamban, Cebu",
  "PET DYNASTY": "303 Pet Dynasty Blvd., Balamban, Cebu",
  "CHARMZKRYLE RENT A CAR": "404 Charmzkryle Dr., Balamban, Cebu",
  "YUKIMURA RENTAL CARS": "505 Yukimura St., Balamban, Cebu"
};

// Define a brown color for PetConnect
const PETCONNECT_BROWN = "#8B5C2A"; // You can adjust this hex for your preferred brown

const Services = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart(); // <-- Use addToCart from context
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("FixUp");
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const location = useLocation();

  // Handle ?category= query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category && categoryList.some((cat) => cat.key === category)) {
      setSelectedCategory(category);
    }
  }, [location.search]);

  // Reset shop & subcategory when category changes
  useEffect(() => {
    setSelectedShop(shopCategories[selectedCategory][0]);
    setSelectedSubcategory("");
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

  // Replace openBookingForm with navigation logic
  const handleBookOrOrder = (service) => {
    if (!user || !user.id) {
      alert("You must be logged in to book a service.");
      return;
    }
    // Route to the correct booking page
    if (service.category === "FixUp") {
      navigate("/book/fixup", { state: { service } });
    } else if (service.category === "H2Go") {
      navigate("/book/h2go", { state: { service } });
    } else if (service.category === "PetConnect") {
      navigate("/book/petconnect", { state: { service } });
    } else if (service.category === "Go Ride Connect") {
      if (!service.availability) {
        alert("Sorry, this car is currently unavailable.");
        return;
      }
      navigate("/book/gorideconnect", { state: { service } });
    }
  };

  const subcategoriesForDropdown = allSubcategories[selectedCategory] || [];

  const renderServicesByCategory = () => {
    const filtered = services.filter(
      (s) =>
        s.category === selectedCategory &&
        (!selectedShop || s.shopcategory === selectedShop) &&
        (selectedCategory === "Go Ride Connect"
          ? true
          : selectedSubcategory
          ? s.subcategory === selectedSubcategory
          : true)
    );

    let grouped = {};
    if (selectedCategory === "Go Ride Connect") {
      grouped["All"] = filtered;
    } else {
      filtered.forEach((s) => {
        const subcat = s.subcategory || "Uncategorized";
        if (!grouped[subcat]) grouped[subcat] = [];
        grouped[subcat].push(s);
      });
    }

    const subcats =
      selectedCategory === "Go Ride Connect"
        ? ["All"]
        : selectedSubcategory
        ? [selectedSubcategory]
        : allSubcategories[selectedCategory] || ["Uncategorized"];

    return (
      <div>

        {selectedCategory !== "Go Ride Connect" && (
          <div style={{ marginBottom: "20px" }}>
            {/* <label
              htmlFor="subcategory-filter"
              style={{ marginRight: "10px", fontWeight: "bold", color: "#fff" }}
            >
            
            </label> */}
            <select
              id="subcategory-filter"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              style={{
                padding: "6px 10px",
                fontSize: "0.98rem",
                minWidth: "180px",
                maxWidth: "280px",
                borderRadius: "7px",
                border: "1px solid #ccc",
                color: selectedSubcategory ? "#222" : "#888",
                background: "#fff",
                fontWeight: 500,
              }}
            >
              <option value="" disabled selected>
                Filter by category
              </option>
              <option value="">All</option>
              {subcategoriesForDropdown.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>
        )}

        {subcats.map((subcat) => (
          <div key={subcat} style={{ marginBottom: 32 }}>
            {selectedCategory !== "Go Ride Connect" && (
              <h4
                style={{
                  color: selectedCategory === "PetConnect" ? "#222" : "#e74c3c",
                  margin: "18px 0 12px 0",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                }}
              >
                {subcat}
              </h4>
            )}
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
                    {/* --- Shop Address Label --- */}
                    {service.shopcategory && (
                      <div
                        style={{
                          background: "#f1f1f1",
                          color: "#444",
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: "0.98rem",
                          marginBottom: 10,
                          marginTop: 2,
                          fontWeight: 500,
                          textAlign: "center",
                          maxWidth: 320,
                          alignSelf: "center",
                        }}
                      >
                        <span style={{ color: "#888", fontWeight: 600 }}>Shop Address:</span>{" "}
                        {shopAddresses[service.shopcategory] || "No address set"}
                      </div>
                    )}
                    {/* --- End Shop Address Label --- */}
                    <h3>
                      {service.name}
                    </h3>
                    {service.category !== "Go Ride Connect" && (
                      <p>
                        {service.description}
                      </p>
                    )}
                    <p>
                      Price: ₱{service.price}
                    </p>

                    {/* Availability badge for Go Ride Connect */}
                    {service.category === "Go Ride Connect" && (
                      <p
                        style={{
                          color: service.availability ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {service.availability ? "Available" : "Unavailable"}
                      </p>
                    )}

                    {/* --- BUTTONS --- */}
                    <div>
                      {/* Order Now */}
                      <button
                        onClick={() => handleBookOrOrder(service)}
                        disabled={
                          (!user || !user.id) ||
                          (service.category === "Go Ride Connect" && !service.availability)
                        }
                        title={
                          !user || !user.id
                            ? "Log in to order"
                            : service.category === "Go Ride Connect" && !service.availability
                            ? "Currently unavailable"
                            : ""
                        }
                      >
                        {service.category === "H2Go" ||
                        service.category === "PetConnect"
                          ? "Order Now"
                          : "Book Now"}
                      </button>
                      {/* Add to Cart for PetConnect */}
                      {service.category === "PetConnect" && (
                        <button
                          onClick={() => {
                            if (!user || !user.id) return;
                            addToCart({
                              id: service._id,
                              name: service.name,
                              price: service.price,
                              image: service.image ? `http://localhost:5000/uploads/${service.image}` : "",
                              description: service.description,
                            });
                          }}
                          disabled={!user || !user.id}
                          title={!user || !user.id ? "Log in to add to cart" : ""}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#888" }}>
                  No services available
                  {selectedCategory !== "Go Ride Connect" ? " in this subcategory." : "."}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="services-container"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#f9f9f9",
      }}
    >
      {/* Fixed background images for each category */}
      {selectedCategory === "Go Ride Connect" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            background: `url(${require("../assets/images/grc-bkg.jpg")}) center/cover no-repeat`,
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />
      )}
      {selectedCategory === "FixUp" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            background: `url(${require("../assets/images/fixup-bkg.jpg")}) center/cover no-repeat`,
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />
      )}
      {selectedCategory === "PetConnect" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            background: `url(${require("../assets/images/pet-bkg.jpg")}) center/cover no-repeat`,
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />
      )}
      {selectedCategory === "H2Go" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            background: `url(${require("../assets/images/h2go-bkg.jpg")}) center/cover no-repeat`,
            opacity: 0.7,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Logo and Title Side-by-Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {categoryLogos[selectedCategory] && (
          <img
            src={categoryLogos[selectedCategory]}
            alt={`${selectedCategory} Logo`}
            style={{
              maxWidth: selectedCategory === "PetConnect" ? "170px" : "120px",
              height: "auto",
            }}
          />
        )}
        <h2 style={{
          margin: 0,
          color: selectedCategory === "PetConnect" ? "#222" : undefined, // Black for PetConnect
        }}>
          {selectedCategory
            ? `${selectedCategory} ${
                ["H2Go", "PetConnect"].includes(selectedCategory)
                  ? "Products"
                  : "Services"
              }`
            : "Our Services"}
        </h2>
      </div>

      {/* Shop Category Navbar */}
      <h1 style={{
        color: selectedCategory === "PetConnect" ? "#222" : "#fff", // Black for PetConnect
        position: "relative",
        zIndex: 1
      }}> SHOPS </h1>
      {selectedCategory === "Go Ride Connect" && (
        <p
          style={{
            color: "#fff",
            position: "relative",
            zIndex: 1,
            marginTop: "2px",
            marginBottom: "10px",
            fontSize: "1rem",
            textAlign: "left",
            opacity: 0.95,
          }}
        >
          Select a rental shop below to browse and avail available car rental services from our trusted partners.
        </p>
      )}
      <div
        style={{
          margin: "16px 0",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {shopCategories[selectedCategory].map((shop) => (
          <button
            key={shop}
            className={`shop-nav-btn${selectedShop === shop ? " active" : ""}`}
            style={{
              padding: "7px 14px",
              fontSize: "0.95rem",
              borderRadius: "8px",
              border:
                selectedShop === shop
                  ? `2px solid ${
                      selectedCategory === "FixUp"
                        ? "#e74c3c"
                        : selectedCategory === "H2Go"
                        ? "#2980b9"
                        : selectedCategory === "PetConnect"
                        ? PETCONNECT_BROWN
                        : selectedCategory === "Go Ride Connect"
                        ? "#27ae60"
                        : "#ccc"
                    }`
                  : `1px solid ${
                      selectedCategory === "FixUp"
                        ? "#e74c3c"
                        : selectedCategory === "H2Go"
                        ? "#2980b9"
                        : selectedCategory === "PetConnect"
                        ? PETCONNECT_BROWN
                        : selectedCategory === "Go Ride Connect"
                        ? "#27ae60"
                        : "#ccc"
                    }`,
              background:
                selectedShop === shop
                  ? selectedCategory === "FixUp"
                    ? "#e74c3c"
                    : selectedCategory === "H2Go"
                    ? "#2980b9"
                    : selectedCategory === "PetConnect"
                    ? PETCONNECT_BROWN
                    : selectedCategory === "Go Ride Connect"
                    ? "#27ae60"
                    : "#fff"
                  : "#fff",
              color:
                selectedShop === shop
                  ? "#fff"
                  : selectedCategory === "FixUp"
                  ? "#e74c3c"
                  : selectedCategory === "H2Go"
                  ? "#2980b9"
                  : selectedCategory === "PetConnect"
                  ? PETCONNECT_BROWN
                  : selectedCategory === "Go Ride Connect"
                  ? "#27ae60"
                  : "#333",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow:
                selectedShop === shop
                  ? selectedCategory === "FixUp"
                    ? "0 2px 8px rgba(231,76,60,0.12)"
                    : selectedCategory === "H2Go"
                    ? "0 2px 8px rgba(41,128,185,0.12)"
                    : selectedCategory === "PetConnect"
                    ? "0 2px 8px rgba(139,92,42,0.12)" // brown shadow
                    : selectedCategory === "Go Ride Connect"
                    ? "0 2px 8px rgba(39,174,96,0.12)"
                    : "none"
                  : "none",
            }}
            onClick={() => setSelectedShop(shop)}
          >
            {shop}
          </button>
        ))}
      </div>

      {loading && <p style={{ position: "relative", zIndex: 1 }}>Loading services...</p>}
      {error && <p className="error" style={{ position: "relative", zIndex: 1 }}>{error}</p>}

      <div style={{ position: "relative", zIndex: 1 }}>{renderServicesByCategory()}</div>
    </div>
  );
};

export default Services;

