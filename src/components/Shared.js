import { Link, Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiSearch,
  FiLogOut,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useStore } from "../context/StoreContext";
import { BookCover, Logo } from "./Art";

export function Navbar() {
  const { user, logout, cart, wishlist } = useStore();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <Logo /> Bookztron
      </Link>
      <form className="search" onSubmit={submit}>
        <FiSearch />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by book or author"
          aria-label="Search books"
        />
      </form>
      <nav className="nav-links">
        <NavLink to="/products">Shop</NavLink>
        {user && <NavLink to="/orders">Orders</NavLink>}
        <NavLink to="/wishlist" className="icon-link" aria-label="Wishlist">
          <FiHeart />
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </NavLink>
        <NavLink to="/cart" className="icon-link" aria-label="Cart">
          <FiShoppingCart />
          {cart.length > 0 && <span className="badge">{cart.length}</span>}
        </NavLink>
        {user ? (
          <button className="btn ghost small" onClick={logout} title={user.email}>
            <FiLogOut /> Logout
          </button>
        ) : (
          <Link to="/login" className="btn small">
            <FiUser /> Login
          </Link>
        )}
      </nav>
    </header>
  );
}

const toastIcons = {
  success: <FiCheckCircle />,
  error: <FiXCircle />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
};

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts" role="status">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {toastIcons[t.type]} {t.message}
        </div>
      ))}
    </div>
  );
}

export { BookCover };

export function Rating({ value }) {
  return (
    <span className="rating">
      {value.toFixed(1)} <FiStar />
    </span>
  );
}

export function ProductCard({ book }) {
  const { user, inCart, inWishlist, addToCart, toggleWishlist, toast } = useStore();
  const navigate = useNavigate();
  const off = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);

  const guard = (fn) => () => {
    if (!user) {
      toast("warning", "Please log in first");
      navigate("/login");
      return;
    }
    fn();
  };

  return (
    <article className="card">
      <button
        className="wish-btn"
        aria-label="Toggle wishlist"
        onClick={guard(() => toggleWishlist(book.id))}
      >
        {inWishlist(book.id) ? <FaHeart className="red" /> : <FiHeart />}
      </button>
      {book.isNew && <span className="tag">New</span>}
      <Link to={`/products/${book.id}`}>
        <BookCover book={book} />
      </Link>
      <div className="card-body">
        <Link to={`/products/${book.id}`} className="card-title">
          {book.title}
        </Link>
        <span className="muted">{book.author}</span>
        <div className="row">
          <span className="price">₹{book.price}</span>
          <span className="strike">₹{book.originalPrice}</span>
          <span className="off">{off}% off</span>
        </div>
        <div className="row">
          <Rating value={book.rating} />
          {book.fastDelivery && (
            <span className="muted small">
              <FiTruck /> Fast
            </span>
          )}
        </div>
        {!book.inStock ? (
          <button className="btn full" disabled>
            Out of stock
          </button>
        ) : inCart(book.id) ? (
          <button className="btn outline full" onClick={() => navigate("/cart")}>
            Go to cart
          </button>
        ) : (
          <button className="btn full" onClick={guard(() => addToCart(book.id))}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}

export function RequireAuth({ children }) {
  const { user } = useStore();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}
