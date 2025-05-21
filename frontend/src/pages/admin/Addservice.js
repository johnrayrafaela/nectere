import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/addservices.css";

const categories = ["FixUp", "H2Go", "PetConnect", "WallFix & Style"];

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", description: "", price: "", category: "FixUp" });
  const [imageFile, setImageFile] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedService, setEditedService] = useState({ name: "", description: "", price: "", category: "FixUp", image: "", imageFile: null, imagePreview: "" });
  const [selectedCategory, setSelectedCategory] = useState("FixUp");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cleaning-services");
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newService.name);
      formData.append("description", newService.description);
      formData.append("price", newService.price);
      formData.append("category", newService.category);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/cleaning-services/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchServices();
      setNewService({ name: "", description: "", price: "", category: "FixUp" });
      setImageFile(null);
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cleaning-services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service._id);
    setEditedService({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      image: service.image,
      imageFile: null,
      imagePreview: "",
    });
  };

  // Modified to support image update
  const handleUpdateService = async (id) => {
    try {
      const token = localStorage.getItem("token");
      let dataToSend = editedService;
      let config = { headers: { Authorization: `Bearer ${token}` } };

      if (editedService.imageFile) {
        const formData = new FormData();
        formData.append("name", editedService.name);
        formData.append("description", editedService.description);
        formData.append("price", editedService.price);
        formData.append("category", editedService.category);
        formData.append("image", editedService.imageFile);
        dataToSend = formData;
        config.headers["Content-Type"] = "multipart/form-data";
      }

      await axios.put(`http://localhost:5000/api/cleaning-services/${id}`, dataToSend, config);
      setEditingServiceId(null);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const renderServicesByCategory = (category) => {
    const filteredServices = services.filter((service) => service.category === category);
    return (
      <div className="service-category">
        <h4>{category} Services</h4>
        <ul className="service-list">
          {filteredServices.map((service) => (
            <li key={service._id}>
              {editingServiceId === service._id ? (
                <div>
                  <input
                    type="text"
                    value={editedService.name}
                    onChange={(e) => setEditedService({ ...editedService, name: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editedService.description}
                    onChange={(e) => setEditedService({ ...editedService, description: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editedService.price}
                    onChange={(e) => setEditedService({ ...editedService, price: e.target.value })}
                  />
                  <select
                    value={editedService.category}
                    onChange={(e) => setEditedService({ ...editedService, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {/* Image preview and upload */}
                  <div style={{ margin: "10px 0" }}>
                    <img
                      src={
                        editedService.imagePreview
                          ? editedService.imagePreview
                          : `http://localhost:5000/${editedService.image}`
                      }
                      alt={editedService.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditedService((prev) => ({
                            ...prev,
                            imageFile: file,
                            imagePreview: URL.createObjectURL(file),
                          }));
                        }
                      }}
                    />
                  </div>
                  <button onClick={() => handleUpdateService(service._id)}>Save</button>
                  <button onClick={() => setEditingServiceId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <img
                    src={`http://localhost:5000/${service.image}`}
                    alt={service.name}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div>{service.name} - {service.description} - ₱{service.price} - <strong>{service.category}</strong></div>
                  <div>
                    <button onClick={() => handleEditClick(service)}>Edit</button>
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

  return (
    <div className="addservice-container">
      <h3>Add New Service</h3>
      <form onSubmit={handleAddService} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Service Name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newService.price}
          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          required
        />
        <select
          value={newService.category}
          onChange={(e) => setNewService({ ...newService, category: e.target.value })}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />
        <button type="submit">Add Service</button>
      </form>

      <nav style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <h3>{selectedCategory} Services</h3>
      {renderServicesByCategory(selectedCategory)}
    </div>
  );
};

export default AdminDashboard;