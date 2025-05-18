import { useState, useEffect } from "react";
import axios from "axios";

const WallfixService = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", description: "", price: "" });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedService, setEditedService] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wallfix-services");
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/wallfix-services/add", newService, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
      setNewService({ name: "", description: "", price: "" });
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/wallfix-services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setEditedService({ name: service.name, description: service.description, price: service.price });
  };

  const handleUpdateService = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/wallfix-services/${id}`, editedService, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingServiceId(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <div>

      <h3>Add New Wallfix Services</h3>
      {/* Add New Service Form */}
      <form onSubmit={handleAddService}>
        <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} required />
        <input type="text" placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} required />
        <input type="number" placeholder="Price" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} required />
        <button type="submit">Add Service</button>
      </form>

      <h3>Existing Services</h3>
    <ul>
      {services.map((service) => (
        <li className="service-item" key={service._id}>
          {editingServiceId === service._id ? (
            <div>
              <input type="text" value={editedService.name} onChange={(e) => setEditedService({ ...editedService, name: e.target.value })} />
              <input type="text" value={editedService.description} onChange={(e) => setEditedService({ ...editedService, description: e.target.value })} />
              <input type="number" value={editedService.price} onChange={(e) => setEditedService({ ...editedService, price: e.target.value })} />
              <button className="save-btn" onClick={() => handleUpdateService(service._id)}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingServiceId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              {service.name} - {service.description} - ${service.price}
              <div>
                <button className="edit-btn" onClick={() => handleEditClick(service)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteService(service._id)}>Delete</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
    </div>
  );
};

export default WallfixService;
