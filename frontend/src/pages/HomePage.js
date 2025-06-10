import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/HomPage.css";


import bannerFixup from "../assets/images/banners/banner-fixup.jpg";
import bannerH2go from "../assets/images/banners/banner-h2go.jpg";
import bannerPet from "../assets/images/banners/banner-pet.jpg";
import bannerGrc from "../assets/images/banners/banner-grc.jpg";

import Fixup from "../assets/images/banners/banner-fixup2.jpg";
import H2go from "../assets/images/banners/banner-h2go2.jpg";
import Pet from "../assets/images/banners/banner-pet2.jpg";
import Grc from "../assets/images/banners/banner-grc2.jpg";




// Category color mapping for themed cards
const categoryColors = {
  FixUp: "#e74c3c",
  H2Go: "#2980b9",
  PetConnect: "#b7986b",
  "Go Ride Connect": "#27ae60", // Updated to a distinct green
};

// Hero images and text setup
const heroImages = [
  bannerFixup,
  bannerH2go,
  bannerPet,
  bannerGrc,
];

const heroTexts = [
  {
    title: "FIX UP",
    main: (
      <>
        YOUR TRUSTED LINK TO <br />
         HASSLE-FREE AUTO CARE.<br />
      </>
    ),
    desc: "Professional car repairs, maintenance, and diagnostics for every vehicle. Drive with confidence!"
  },
  {
    title: "H2GO",
    main: (
      <>
        PURE MINERAL WATER DELIVERED<br />
        TO YOUR DOORSTEP.<br /> 
      </>
    ),
    desc: "Stay hydrated with our fast, fresh, and reliable mineral water delivery service for homes and businesses."
  },
  {
    title: "PETCONNECT",
    main: (
      <>
        CONNECTING YOU TO TRUSTED<br />
        DOG FOOD BRANDS<br />
        
      </>
    ),
    desc: "We specialize in providing quality dog food to keep your furry companions healthy and happy"
  },
  {
    title: "GO RIDE CONNECT",
    main: (
      <>
        RENTAL RIDES AND <br />
        TRANSPORT MADE EASY.<br />
        
      </>
    ),
    desc: "Affordable and convenient ride rentals and transport services for your daily needs."
  },
];

// Animation variants for images and text
const imageVariants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
};

const textVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.5 } },
};

// Arrow Icon for carousel navigation
const ArrowIcon = ({ direction = "left" }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="12" fill="#021526" />
    <path
      d="M10 8l4 4-4 4"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Service categories for "Services We Offer" section
const serviceCategories = [
  {
    key: "FixUp",
    label: "FixUp",
    image: Fixup,
    desc: "Automotive repairs, maintenance, and diagnostics.",
  },
  {
    key: "H2Go",
    label: "H2Go",
    image: H2go,
    desc: "Mineral water delivery for homes and businesses.",
  },
  {
    key: "PetConnect",
    label: "PetConnect",
    image: Pet,
    desc: "Pet care, grooming, and supplies.",
  },
  {
    key: "Go Ride Connect",
    label: "Go Ride Connect",
    image: Grc,
    desc: "Rental rides and transport services.",
  },
];

// Add this above HomePage component for filter logic
const filterOptions = [
  { label: "ALL", value: "all" },
  { label: "AUTOMOTIVE", value: "automotive" },
  { label: "WATER", value: "water" },
  { label: "PET CARE", value: "petcare" },
];

// Map filter to categories
const filterMap = {
  all: ["FixUp", "H2Go", "PetConnect", "Go Ride Connect"],
  automotive: ["FixUp", "Go Ride Connect"],
  water: ["H2Go"],
  petcare: ["PetConnect"],
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [current, setCurrent] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  const nextSlide = () => setCurrent((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const goToSlide = (idx) => setCurrent(idx);

  // Filtered categories
  const filteredCategories = serviceCategories.filter(cat =>
    filterMap[activeFilter].includes(cat.key)
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-img-wrapper">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={heroImages[current]}
              alt="Hero"
              className="hero-img"
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
          </AnimatePresence>
        </div>
        <div className="hero-overlay">
          <AnimatePresence mode="wait">
            <motion.div
              key={current + "-text"}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="hero-text-group"
            >
              <h1 className="hero-title">{heroTexts[current].title}</h1>
              <span className="hero-subtitle">{heroTexts[current].subtitle}</span>
              <div className="hero-main-text">{heroTexts[current].main}</div>
              <div className="hero-desc" style={{ marginTop: 16, fontSize: "1.05rem", color: "#fff", opacity: 0.92 }}>
                {heroTexts[current].desc}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="hero-dots">
            {heroImages.map((_, idx) => (
              <span
                key={idx}
                className={`dot${current === idx ? " active" : ""}`}
                onClick={() => goToSlide(idx)}
                style={{ cursor: "pointer" }}
              ></span>
            ))}
          </div>
          <button className="hero-arrow left" onClick={prevSlide} aria-label="Previous">
            <ArrowIcon direction="left" />
          </button>
          <button className="hero-arrow right" onClick={nextSlide} aria-label="Next">
            <ArrowIcon direction="right" />
          </button>
        </div>
      </section>

      
      {/* Welcome Message */}
        <section style={{ padding: "64px 20px", background: "#00224D", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#2F58CD", marginBottom: "16px", letterSpacing: 1 }}>
            BEYOND SERVICES
          </h2>
          <h3 style={{ fontSize: "1.5rem", color: "#E5E4E2", marginBottom: "28px" }}>
            Convenience Crafted for Every Lifestyle
          </h3>
          <p style={{
            maxWidth: "900px",
            margin: "0 auto",
            fontSize: "1.1rem",
            lineHeight: "1.8",
            color: "#E5E4E2"
          }}>
            Using Nectere is more than booking a service — it's a smarter, simpler way to take care of life’s daily needs.
            With multiple services under one roof, we help you live more and worry less.
            <br /><br />
            Whether you're fixing up your car, refreshing your home, grooming your furry companion, or securing a quick ride,
            every service is designed with your time, trust, and ease in mind.
            <br /><br />
            At Nectere, we believe in making essential services feel effortless. Each booking is a promise — of quality, speed,
            and satisfaction. This is the future of everyday living, created for you.
          </p>
        </section>

      {/* Services We Offer Section */}
      <section style={{ background: "#021526", padding: "48px 0" }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: 32,
          color: "#fff",
          letterSpacing: 1,
          fontWeight: 700
        }}>
          Services We Offer
        </h2>

        {/* Filter Bar */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          marginBottom: 36,
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: 1,
          background: "#181b20",
          borderRadius: 30,
          overflow: "hidden",
          maxWidth: 700,
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 2px 12px #0005"
        }}>
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              style={{
                flex: 1,
                background: activeFilter === opt.value ? "#23272f" : "transparent",
                color: activeFilter === opt.value ? "#6EACDA" : "#bbb",
                border: "none",
                outline: "none",
                padding: "16px 0",
                cursor: "pointer",
                borderBottom: activeFilter === opt.value ? "3px solid #6EACDA" : "3px solid transparent",
                fontWeight: activeFilter === opt.value ? 700 : 500,
                fontSize: 17,
                letterSpacing: 1,
                transition: "color 0.2s, border-bottom 0.2s, background 0.2s"
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${filteredCategories.length}, 1fr)`,
          gap: "32px",
          maxWidth: 1200,
          justifyContent: "center",
          margin: "0 auto",
        }}>
          {filteredCategories.map((cat) => (
            <div
              key={cat.key}
              style={{
                background: "#181b20",
                borderRadius: 18,
                boxShadow: `0 2px 16px #000a`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 420,
                maxHeight: 420,
                height: 420,
                width: 320,
                maxWidth: 320,
                margin: "0 auto",
                border: `1.5px solid ${categoryColors[cat.key] || "#333"}33`,
                cursor: "pointer",
                transition: "transform 0.13s",
              }}
              onClick={() => navigate(`/services?category=${encodeURIComponent(cat.key)}`)}
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/services?category=${encodeURIComponent(cat.key)}`);
                }
              }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  objectPosition: "center",
                  borderBottom: `3px solid ${categoryColors[cat.key]}`,
                  maxHeight: 180,
                  minHeight: 180,
                }}
              />
              <div style={{ padding: "28px 22px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{
                  color: "#bbb",
                  fontSize: 15,
                  fontWeight: 500,
                  marginBottom: 6,
                  letterSpacing: 1
                }}>
                  {cat.label}
                </span>
                <h3 style={{
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 10px 0"
                }}>
                  {cat.label}
                </h3>
                <p style={{
                  color: "#e0e0e0",
                  fontSize: 15.5,
                  marginBottom: "auto",
                  lineHeight: 1.7
                }}>
                  {cat.desc}
                </p>
                <span
                  style={{
                    marginTop: 22,
                    alignSelf: "flex-start",
                    color: categoryColors[cat.key],
                    fontWeight: 700,
                    fontSize: 15.5,
                    letterSpacing: 1,
                    borderBottom: `2px solid ${categoryColors[cat.key]}`,
                    cursor: "pointer",
                    padding: 0,
                    transition: "color 0.2s"
                  }}
                >
                 VIEW SERVICES
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action - Only if user is not logged in */}
      {!user && (
        <section className="cta-section">
          <div className="cta-card">
            <div className="cta-title">
              Ready to Access Trusted Services All in One Place?
            </div>
            <div className="cta-desc">
              Join thousands of happy customers who rely on us for everything from auto repairs and pet essentials to clean water and rental rides — all in one seamless platform.
            </div>
            <button className="cta-btn" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;