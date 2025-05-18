import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FixUpServices from "./FixUpServices";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";  // Ensure this is correct
import "../styles/HomPage.css";

// Hero images and text setup
const heroImages = [
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80", // FixUp (Car)
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // H2GO (Mineral Water)
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80", // PetConnect (Animal)
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80", // WallFix (Furniture)
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
    title: "WALLFIX",
    subtitle: "Furniture & Home Repairs",
    main: (
      <>
        EXPERT FURNITURE<br />
        REPAIR AND HOME<br />
        IMPROVEMENT.
      </>
    ),
    desc: "Restore and enhance your home with skilled furniture repairs and handyman services."
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

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);  // Ensure this is correct
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

      {/* Services Section */}
      <section>
        <FixUpServices previewCount={4} />
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
