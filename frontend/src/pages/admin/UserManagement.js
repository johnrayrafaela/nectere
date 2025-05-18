import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminBookingManagementPage.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/get-all");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      phonenumber: user.phonenumber,
      email: user.email,
    });
  };

  const handleDelete = async (userId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/users/delete/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/update/${editingUser}`, formData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
  if (searchQuery.trim() === "") {
    setFilteredUsers(users); // Show all users if no search
  } else {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.firstname?.toLowerCase() || "").includes(lowerCaseQuery) ||
        (user.lastname?.toLowerCase() || "").includes(lowerCaseQuery) ||
        (user.email?.toLowerCase() || "").includes(lowerCaseQuery) ||
        (user.phonenumber || "").includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  }
}, [searchQuery, users]);

  const renderTable = () => (
    <table border="1" cellPadding="10" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <React.Fragment key={user._id}>
            {editingUser === user._id ? (
              <tr>
                <td>
                  <input
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={formData.phonenumber}
                    onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </td>
                <td>{user.role}</td>
                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingUser(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.phonenumber}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
      />
      {filteredUsers.length > 0 ? renderTable() : <p>No users found. Please search to display results.</p>}
    </div>
  );
}

export default UserManagement;