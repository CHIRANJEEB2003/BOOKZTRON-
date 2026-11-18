import { Link, Route, Routes } from "react-router-dom";
import { Navbar, RequireAuth, Toasts } from "./components/Shared";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import { Login, Orders, Signup, Wishlist } from "./pages/Account";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
        <Route
          path="*"
          element={
            <main className="container">
              <p className="empty">
                Page not found. <Link to="/">Go home</Link>
              </p>
            </main>
          }
        />
      </Routes>
      <Toasts />
    </>
  );
}
