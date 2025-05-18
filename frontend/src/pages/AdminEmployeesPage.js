import { useEffect, useState } from "react";
import axios from "axios";

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    availability: true,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error fetching employees");
      console.error("Error fetching employees", err);
    }
  };

  const handleEdit = (employee) => {
    setEditing(employee._id);
    setFormData(employee);
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (id) => {
    if (!formData.name || !formData.email || !formData.phone || !formData.role) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/employees/${id}`, formData);
      setEditing(null);
      setSuccessMessage("Employee updated successfully.");
      fetchEmployees();
    } catch (err) {
      setError("Update failed");
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
    setError("");
    setSuccessMessage("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setSuccessMessage("Employee deleted.");
        fetchEmployees();
      } catch (err) {
        setError("Error deleting employee");
        console.error("Delete failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetAvailability = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset all employee availability?");
    if (confirmReset) {
      try {
        setLoading(true);
        await axios.put("http://localhost:5000/api/employees/reset-availability");
        setSuccessMessage("All employee availability has been reset.");
        setError("");
        fetchEmployees();
      } catch (err) {
        setError("Failed to reset availability");
        console.error("Reset failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.role || !newEmployee.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/employees", newEmployee);
      setSuccessMessage("Employee created successfully.");
      setError("");
      setNewEmployee({ name: "", email: "", phone: "", role: "", availability: true, password: "" });
      fetchEmployees();
    } catch (err) {
      setError("Error creating employee");
      console.error("Create employee failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-employee-container">
      <h2>Manage Employees</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <h3>Create New Employee</h3>
      <form className="employee-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newEmployee.phone}
          onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newEmployee.password}
          onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newEmployee.role}
          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
        />
        <label>
          Available:
          <input
            type="checkbox"
            checked={newEmployee.availability}
            onChange={(e) => setNewEmployee({ ...newEmployee, availability: e.target.checked })}
          />
        </label>
        <button type="submit">Create Employee</button>
      </form>

      <button className="reset-btn" onClick={handleResetAvailability}>
        Reset All Availability
      </button>

      {loading && <p>Loading...</p>}

      <div className="employee-list">
        {employees.map((employee) => (
          <div key={employee._id} className="employee-card">
            {editing === employee._id ? (
              <>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                <input name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
                <label>
                  Available:
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleChange}
                  />
                </label>
                <button onClick={() => handleUpdate(employee._id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {employee.name}</p>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Phone:</strong> {employee.phone}</p>
                <p><strong>Role:</strong> {employee.role}</p>
                <p><strong>Available:</strong> {employee.availability ? "Yes" : "No"}</p>
                <button onClick={() => handleEdit(employee)}>Edit</button>
                <button onClick={() => handleDelete(employee._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEmployeesPage;