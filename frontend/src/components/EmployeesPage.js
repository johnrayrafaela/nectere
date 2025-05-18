import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom"; // ✅ Import this
import defaultProfile from "../assets/images/default_profile.jpg";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation(); // ✅ Track location

  const fetchEmployees = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/employees')
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load employee data.");
        setLoading(false);
      });
  };

  // ✅ Trigger fetch on mount AND whenever this route is visited
  useEffect(() => {
    fetchEmployees();
  }, [location.pathname]); // 👈 Reacts to route change

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <div className="employees-container">
        <h2>Employees</h2>
        <div className="employees-list">
          {employees.length === 0 ? (
            <p>No employees available</p>
          ) : (
            employees.map((employee) => (
              <div className="profile-card" key={employee._id}>
                <div className="profile-header">
                  <img src={defaultProfile} alt="avatar" className="employee-image" />
                  <h2>{employee.name}</h2>
                </div>
                <div className="profile-info">
                  <p><strong>Role:</strong> {employee.role}</p>
                  <p><strong>Phone:</strong> {employee.phone}</p>
                  <p><strong>Email:</strong> {employee.email}</p>
                  <p className={`availability-status ${employee.availability ? 'available' : 'not-available'}`}>
                    <span>{employee.availability ? "Available" : "Not Available"}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
