import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { getBook } from "../data/books";
import { ProductCard } from "../components/Shared";

function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup, toast } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (isSignup && form.password.length < 6) return setError("Password must be at least 6 characters");
    const err = isSignup
      ? signup(form.name.trim(), form.email.trim().toLowerCase(), form.password)
      : login(form.email.trim().toLowerCase(), form.password);
    if (err) return setError(err);
    toast("success", isSignup ? "Account created" : "Welcome back!");
    navigate(location.state?.from || "/products", { replace: true });
  };

  return (
    <main className="container auth">
      <form className="auth-card" onSubmit={submit}>
        <h1>{isSignup ? "Create account" : "Log in"}</h1>
        {isSignup && (
          <label>
            Name
            <input name="name" required value={form.name} onChange={onChange} />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" required value={form.email} onChange={onChange} />
        </label>
        <label>
          Password
          <input name="password" type="password" required value={form.password} onChange={onChange} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn full">{isSignup ? "Sign up" : "Log in"}</button>
        <p className="muted small">
          {isSignup ? (
            <>
              Already have an account? <Link to="/login">Log in</Link>
            </>
          ) : (
            <>
              New here? <Link to="/signup" state={location.state}>Create an account</Link>
            </>
          )}
        </p>
      </form>
    </main>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Signup = () => <AuthForm mode="signup" />;

export function Wishlist() {
  const { wishlist } = useStore();
  return (
    <main className="container">
      <h1>My wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <p className="empty">
          Your wishlist is empty. <Link to="/products">Browse books</Link>
        </p>
      ) : (
        <div className="grid">
          {wishlist.map((id) => (
            <ProductCard key={id} book={getBook(id)} />
          ))}
        </div>
      )}
    </main>
  );
}

export function Orders() {
  const { orders } = useStore();
  return (
    <main className="container">
      <h1>My orders</h1>
      {orders.length === 0 ? (
        <p className="empty">
          No orders yet. <Link to="/products">Start shopping</Link>
        </p>
      ) : (
        orders.map((o) => (
          <section key={o.id} className="panel">
            <div className="row between">
              <strong>Order #{o.id}</strong>
              <span className="muted">{new Date(o.date).toLocaleString()}</span>
            </div>
            <ul className="order-items">
              {o.items.map((i) => (
                <li key={i.id}>
                  <Link to={`/products/${i.id}`}>{i.title}</Link> × {i.qty}
                  <span>₹{i.price * i.qty}</span>
                </li>
              ))}
            </ul>
            <div className="row between">
              <span className="muted">Paid via {o.paymentMethod}</span>
              <strong>Total ₹{o.total}</strong>
            </div>
          </section>
        ))
      )}
    </main>
  );
}
