import { Link, useNavigate, useParams } from "react-router-dom";
import { FiTruck } from "react-icons/fi";
import { getBook } from "../data/books";
import { BookCover, Rating } from "../components/Shared";
import { useStore } from "../context/StoreContext";

export default function ProductDetail() {
  const { id } = useParams();
  const book = getBook(id);
  const { user, inCart, inWishlist, addToCart, toggleWishlist, toast } = useStore();
  const navigate = useNavigate();

  if (!book) {
    return (
      <main className="container">
        <p className="empty">
          Book not found. <Link to="/products">Back to shop</Link>
        </p>
      </main>
    );
  }

  const guard = (fn) => () => {
    if (!user) {
      toast("warning", "Please log in first");
      return navigate("/login");
    }
    fn();
  };

  return (
    <main className="container detail">
      <BookCover book={book} large />
      <div className="detail-info">
        <span className="muted">{book.genre}</span>
        <h1>{book.title}</h1>
        <p className="muted">by {book.author}</p>
        <Rating value={book.rating} />
        <div className="row">
          <span className="price big">₹{book.price}</span>
          <span className="strike">₹{book.originalPrice}</span>
        </div>
        <p>{book.description}</p>
        <ul className="facts">
          <li>{book.inStock ? "In stock" : "Currently out of stock"}</li>
          {book.fastDelivery && (
            <li>
              <FiTruck /> Fast delivery available
            </li>
          )}
        </ul>
        <div className="row">
          {book.inStock &&
            (inCart(book.id) ? (
              <button className="btn outline" onClick={() => navigate("/cart")}>
                Go to cart
              </button>
            ) : (
              <button className="btn" onClick={guard(() => addToCart(book.id))}>
                Add to cart
              </button>
            ))}
          <button className="btn ghost" onClick={guard(() => toggleWishlist(book.id))}>
            {inWishlist(book.id) ? "Remove from wishlist" : "Add to wishlist"}
          </button>
        </div>
      </div>
    </main>
  );
}
