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
    subtitle: "Automotive Services",
    main: (
      <>
        YOUR TRUSTED<br />
        LINK TO HASSLE-<br />
        FREE AUTO CARE.
      </>
    ),
    desc: "Professional car repairs, maintenance, and diagnostics for every vehicle. Drive with confidence!"
  },
  {
    title: "H2GO",
    subtitle: "Mineral Water Delivery",
    main: (
      <>
        PURE MINERAL WATER<br />
        DELIVERED TO<br />
        YOUR DOORSTEP.
      </>
    ),
    desc: "Stay hydrated with our fast, fresh, and reliable mineral water delivery service for homes and businesses."
  },
  {
    title: "PETCONNECT",
    subtitle: "Animal Care & Services",
    main: (
      <>
        CONNECTING YOU<br />
        TO TRUSTED PET<br />
        CARE & SUPPLIES.
      </>
    ),
    desc: "From grooming to pet essentials, we make caring for your furry friends easy and convenient."
  },
  {
    title: "GO RIDE CONNECT",
    subtitle: "Rental Rides & More",
    main: (
      <>
        RENTAL RIDES<br />
        AND TRANSPORT<br />
        MADE EASY.
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
    <circle cx="12" cy="12" r="12" fill="#e74c3c" />
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

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const goToSlide = (idx) => setCurrent(idx);

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

      {/* Services We Offer Section */}
      <section style={{ padding: "32px 0" }}>
        <h2 style={{ textAlign: "center", marginBottom: 32, color: "#e74c3c", letterSpacing: 1 }}>
          Services We Offer
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "32px",
          maxWidth: 1200,
          margin: "0 auto"
        }}>
          {serviceCategories.map((cat) => (
            <div
              key={cat.key}
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: `0 2px 12px ${categoryColors[cat.key] || "#000"}22`,
                width: 260,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderTop: `6px solid ${categoryColors[cat.key]}`,
              }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 18,
                  border: `2px solid ${categoryColors[cat.key]}`
                }}
              />
              <h3 style={{ margin: "8px 0 6px 0", color: categoryColors[cat.key] }}>{cat.label}</h3>
              <p style={{ fontSize: 15, marginBottom: 18, color: "#444" }}>{cat.desc}</p>
              <button
                style={{
                  background: categoryColors[cat.key],
                  color: "#fff",
                  border: "none",
                  borderRadius: 20,
                  padding: "8px 22px",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: 1,
                  transition: "background 0.2s"
                }}
                onClick={() => navigate(`/services?category=${encodeURIComponent(cat.key)}`)}
              >
                View Services
              </button>
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