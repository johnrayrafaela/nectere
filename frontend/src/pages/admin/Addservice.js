import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/addservices.css";

// Update categories and subcategories to match your backend
const categories = ["FixUp", "H2Go", "PetConnect", "Go Ride Connect"];

// Subcategory options for each category (all categories now have subcategories)
const subcategories = {
  FixUp: [
    "Oil Change",
    "Engine Repair",
    "Under Chassis Repair",
    "Wirings",
    "Brake System",
    "Engine Cooling System"
  ],
  H2Go: ["Water Delivery", "Refill Station", "Purified", "Mineral"],
  PetConnect: ["Grooming", "Pet Supplies", "Veterinary", "Boarding"],
  "Go Ride Connect": ["Car Rental", "Motorcycle Rental", "Bike Rental", "Chauffeur Service"],
};

// Shop categories for each main service category
const shopCategories = {
  FixUp: ["Main Garage", "Express Garage"],
  H2Go: ["Water Hub", "Water Express"],
  PetConnect: ["Pet Mall", "Pet Express"],
  "Go Ride Connect": ["Ride Center", "Ride Express"],
};

const AdminDashboard = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    category: "FixUp",
    subcategory: subcategories["FixUp"][0],
    shopcategory: shopCategories["FixUp"][0],
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedService, setEditedService] = useState({
    name: "",
    description: "",
    price: "",
    category: "FixUp",
    subcategory: subcategories["FixUp"][0],
    shopcategory: shopCategories["FixUp"][0],
    image: "",
    imageFile: null,
    imagePreview: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("FixUp");

  useEffect(() => {
    fetchServices();
  }, []);

  // Update subcategory and shopcategory when main category changes (for add form)
  useEffect(() => {
    setNewService((prev) => ({
      ...prev,
      subcategory: subcategories[prev.category][0],
      shopcategory: shopCategories[prev.category][0],
    }));
  }, [newService.category]);

  // Update subcategory and shopcategory when editing category changes (for edit form)
  useEffect(() => {
    setEditedService((prev) => ({
      ...prev,
      subcategory: subcategories[prev.category][0],
      shopcategory: shopCategories[prev.category][0],
    }));
    // eslint-disable-next-line
  }, [editedService.category]);

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
      formData.append("subcategory", newService.subcategory);
      formData.append("shopcategory", newService.shopcategory);
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
      setNewService({
        name: "",
        description: "",
        price: "",
        category: "FixUp",
        subcategory: subcategories["FixUp"][0],
        shopcategory: shopCategories["FixUp"][0],
      });
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
      subcategory: service.subcategory || subcategories[service.category][0],
      shopcategory: service.shopcategory || shopCategories[service.category][0],
      image: service.image,
      imageFile: null,
      imagePreview: "",
    });
  };

  // Modified to support image, subcategory, and shopcategory update
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
        formData.append("subcategory", editedService.subcategory);
        formData.append("shopcategory", editedService.shopcategory);
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
                  {/* Subcategory selection for edit */}
                  <select
                    value={editedService.subcategory}
                    onChange={(e) => setEditedService({ ...editedService, subcategory: e.target.value })}
                  >
                    {subcategories[editedService.category].map((subcat) => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                  {/* Shopcategory selection for edit */}
                  <select
                    value={editedService.shopcategory}
                    onChange={(e) => setEditedService({ ...editedService, shopcategory: e.target.value })}
                  >
                    {shopCategories[editedService.category].map((shop) => (
                      <option key={shop} value={shop}>{shop}</option>
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
                  <div>
                    {service.name} - {service.description} - ₱{service.price} - <strong>{service.category}</strong>
                    {service.subcategory && (
                      <span style={{ marginLeft: 8, color: "#888" }}>({service.subcategory})</span>
                    )}
                    {service.shopcategory && (
                      <span style={{ marginLeft: 8, color: "#27ae60" }}>[{service.shopcategory}]</span>
                    )}
                  </div>
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
        {/* Subcategory selection for add */}
        <select
          value={newService.subcategory}
          onChange={(e) => setNewService({ ...newService, subcategory: e.target.value })}
          required
        >
          {subcategories[newService.category].map((subcat) => (
            <option key={subcat} value={subcat}>{subcat}</option>
          ))}
        </select>
        {/* Shopcategory selection for add */}
        <select
          value={newService.shopcategory}
          onChange={(e) => setNewService({ ...newService, shopcategory: e.target.value })}
          required
        >
          {shopCategories[newService.category].map((shop) => (
            <option key={shop} value={shop}>{shop}</option>
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