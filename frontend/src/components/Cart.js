import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const { cartItems, setCartItems } = useCart();
  const isEmpty = !cartItems || cartItems.length === 0;
  const navigate = useNavigate();

  // State to track selected item for checkout
  const [selectedId, setSelectedId] = useState(cartItems.length === 1 ? cartItems[0].id : "");

  // Handlers for quantity and delete
  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleDelete = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(""); // Deselect if deleted
  };

  // Calculate subtotal for all items
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Calculate total for selected item only
  const selectedItem = cartItems.find(i => i.id === selectedId);
  const selectedTotal = selectedItem ? selectedItem.price * selectedItem.quantity : 0;

  // Handle checkout
  const handleCheckout = () => {
    const item = selectedItem;
    if (item) {
      navigate("/book/petconnect", {
        state: {
          service: {
            _id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
            quantity: item.quantity
          }
        }
      });
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">
        Your Cart
        {isEmpty ? (
          <span>
            {" "}
            is <span style={{ color: "red" }}>Empty!</span>
          </span>
        ) : (
          ` (${cartItems.length} item${cartItems.length > 1 ? "s" : ""})`
        )}
      </h2>

      {isEmpty ? (
        <div className="cart-empty">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="cart-empty-img"
          />
          <div className="cart-empty-msg">
            Must add items from the PetConnect store on the cart before you proceed to check out.
          </div>
          <Link to="/services?category=PetConnect" className="cart-return-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="cart-table-header" style={{ gridTemplateColumns: "0.3fr 1.5fr 0.7fr 1.1fr 1fr 1fr" }}>
            <span></span>
            <span>Item</span>
            <span>Price</span>
            <span style={{ textAlign: "center" }}>Quantity</span>
            <span className="cart-total-header" style={{ textAlign: "right" }}>Total</span>
            <span style={{ textAlign: "center" }}></span>
          </div>

          {/* Cart Items */}
          {cartItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="cart-item-row"
              style={{ gridTemplateColumns: "0.3fr 1.5fr 0.7fr 1.1fr 1fr 1fr" }}
            >
              {/* Select radio */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <input
                  type="radio"
                  name="selectedCartItem"
                  value={item.id}
                  checked={selectedId === item.id}
                  onChange={() => setSelectedId(item.id)}
                  aria-label="Select for checkout"
                />
              </div>
              {/* Item Info */}
              <div className="cart-item-info">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  {item.note && (
                    <div className="cart-item-note">
                      {item.note}
                    </div>
                  )}
                  <div className="cart-item-desc">{item.description}</div>
                </div>
              </div>
              {/* Price */}
              <div className="cart-item-price">₱{item.price.toLocaleString()}</div>
              {/* Quantity */}
              <div className="cart-item-qty plain-qty">
                <button
                  className="plain-qty-btn"
                  onClick={() => handleDecrease(item.id)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="cart-qty-num">{item.quantity}</span>
                <button
                  className="plain-qty-btn"
                  onClick={() => handleIncrease(item.id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {/* Total */}
              <div className="cart-item-total" style={{ textAlign: "right", fontWeight: 600 }}>
                ₱{(item.price * item.quantity).toLocaleString()}
              </div>
              {/* Delete Button */}
              <div className="cart-item-delete">
                <button
                  className="cart-delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Remove item"
                >
                  <FaTrash className="cart-delete-icon" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="cart-summary-row">
            <div className="cart-summary">
              <div className="cart-summary-line">
                <span>Subtotal:</span>
                <span>
                  ₱{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="cart-summary-total">
                <span>Grand total:</span>
                <span>
                  ₱{selectedTotal.toLocaleString()}
                </span>
              </div>

              {subtotal >= 2000 ? (
                <div className="cart-summary-shipping cart-summary-shipping-eligible">
                  Congrats, you're eligible for <b>Free Delivery</b>
                </div>
              ) : (
                <div className="cart-summary-shipping cart-summary-shipping-more">
                  Add ₱{(2000 - subtotal).toLocaleString()} more for <b>Free Delivery</b>
                </div>
              )}
              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={isEmpty || !selectedId}
              >
                Check out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;