import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import defaultProfile from "../assets/images/default_profile.jpg";

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  if (!user) {
    return <h2>Please log in to view your profile.</h2>;
  }

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
        </div>

        <div className="profile-picture-section">
          <img
            src={profileImage || defaultProfile}
            alt="Profile"
            className="profile-image"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="profile-info">
          <p><strong>First Name:</strong> {user.firstname}</p>
          <p><strong>Last Name:</strong> {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phonenumber}</p>
          
        </div>

        {user.role === "admin" && (
          
          <>
          <button className="admin-btn" onClick={() => navigate("/admin")}>
            Admin Dashboard
          </button>
          
          
          </>
          
          
          
        )}
      </div>

      {/* Appointment History Section */}
      
    </div>
  );
};

export default UserProfilePage;
