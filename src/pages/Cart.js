import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useStore } from "../context/StoreContext";
import { COUPONS, getBook } from "../data/books";
import { BookCover } from "../components/Shared";

const DELIVERY_FEE = 49;
const FREE_DELIVERY_ABOVE = 499;

export default function Cart() {
  const { cart, setQty, removeFromCart, moveToWishlist, placeOrder, toast } = useStore();
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const items = cart.map((c) => ({ ...c, book: getBook(c.id) }));
  const mrp = items.reduce((s, i) => s + i.book.originalPrice * i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.book.price * i.qty, 0);
  const couponDiscount = coupon ? COUPONS[coupon].apply(subtotal) : 0;
  const delivery = subtotal >= FREE_DELIVERY_ABOVE || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal - couponDiscount + delivery;

  const applyCoupon = () => {
    const c = code.trim().toUpperCase();
    if (!COUPONS[c]) return toast("error", "Invalid coupon code");
    if (COUPONS[c].apply(subtotal) === 0) return toast("warning", "Cart does not qualify for this coupon");
    setCoupon(c);
    toast("success", `Coupon ${c} applied`);
  };

  // Simulated payment step (stands in for the original Razorpay checkout).
  const checkout = () => {
    setPaying(true);
    setTimeout(() => {
      const order = placeOrder({ total, paymentMethod: "Demo payment", coupon });
      setPaying(false);
      setCoupon(null);
      toast("success", `Order #${order.id} placed`);
      navigate("/orders");
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <main className="container">
        <h1>My cart</h1>
        <p className="empty">
          Your cart is empty. <Link to="/products">Browse books</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container cart">
      <section>
        <h1>My cart ({items.length})</h1>
        {items.map(({ id, qty, book }) => (
          <div key={id} className="cart-item">
            <Link to={`/products/${id}`}>
              <BookCover book={book} />
            </Link>
            <div className="cart-info">
              <Link to={`/products/${id}`} className="card-title">
                {book.title}
              </Link>
              <span className="muted">{book.author}</span>
              <div className="row">
                <span className="price">₹{book.price}</span>
                <span className="strike">₹{book.originalPrice}</span>
              </div>
              <div className="qty">
                <button aria-label="Decrease" onClick={() => setQty(id, qty - 1)} disabled={qty <= 1}>
                  <FiMinus />
                </button>
                <span>{qty}</span>
                <button aria-label="Increase" onClick={() => setQty(id, qty + 1)}>
                  <FiPlus />
                </button>
              </div>
              <div className="row">
                <button className="btn outline small" onClick={() => moveToWishlist(id)}>
                  Move to wishlist
                </button>
                <button className="btn ghost small" onClick={() => removeFromCart(id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <aside className="panel summary">
        <h3>Order summary</h3>
        <div className="row between">
          <span>Price ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
          <span>₹{mrp}</span>
        </div>
        <div className="row between">
          <span>Discount</span>
          <span className="green">−₹{mrp - subtotal}</span>
        </div>
        {coupon && (
          <div className="row between">
            <span>
              Coupon {coupon}{" "}
              <button className="link-btn" onClick={() => setCoupon(null)}>
                remove
              </button>
            </span>
            <span className="green">−₹{couponDiscount}</span>
          </div>
        )}
        <div className="row between">
          <span>Delivery</span>
          <span>{delivery ? `₹${delivery}` : "Free"}</span>
        </div>
        <hr />
        <div className="row between total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        {!coupon && (
          <div className="row coupon">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Coupon code"
              aria-label="Coupon code"
            />
            <button className="btn outline small" onClick={applyCoupon}>
              Apply
            </button>
          </div>
        )}
        <p className="muted small">Try BOOK10 or FLAT100</p>
        <button className="btn full" onClick={checkout} disabled={paying}>
          {paying ? "Processing payment…" : "Place order"}
        </button>
      </aside>
    </main>
  );
}
