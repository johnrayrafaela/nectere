import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to Fresh Start A Cleaning Services Website</h1>
      <p>Book professional cleaning services at your convenience.</p>
      <button  onClick={() => navigate("/login")}>
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;