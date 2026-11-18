import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getBook } from "../data/books";

const StoreContext = createContext(null);

const USERS_KEY = "bz_users";
const SESSION_KEY = "bz_session";
const dataKey = (email) => `bz_data_${email}`;
const emptyData = { cart: [], wishlist: [], orders: [] };

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: state stays in memory */
  }
};

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION_KEY, null));
  const [data, setData] = useState(() => (user ? read(dataKey(user.email), emptyData) : emptyData));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (user) write(dataKey(user.email), data);
  }, [user, data]);

  const toast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  // --- auth (demo only: credentials live in this browser's localStorage) ---
  const signup = (name, email, password) => {
    const users = read(USERS_KEY, {});
    if (users[email]) return "An account with this email already exists";
    users[email] = { name, password };
    write(USERS_KEY, users);
    return login(email, password);
  };

  const login = (email, password) => {
    const users = read(USERS_KEY, {});
    const u = users[email];
    if (!u || u.password !== password) return "Invalid email or password";
    const session = { name: u.name, email };
    write(SESSION_KEY, session);
    setUser(session);
    setData(read(dataKey(email), emptyData));
    return null;
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setData(emptyData);
  };

  // --- cart & wishlist ---
  const inCart = (id) => data.cart.some((c) => c.id === id);
  const inWishlist = (id) => data.wishlist.includes(id);

  const addToCart = (id) => {
    if (inCart(id)) return;
    setData((d) => ({ ...d, cart: [...d.cart, { id, qty: 1 }] }));
    toast("success", "Added to cart");
  };
  const setQty = (id, qty) =>
    setData((d) => ({
      ...d,
      cart: d.cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, qty) } : c)),
    }));
  const removeFromCart = (id) => {
    setData((d) => ({ ...d, cart: d.cart.filter((c) => c.id !== id) }));
    toast("warning", "Removed from cart");
  };
  const toggleWishlist = (id) => {
    const has = inWishlist(id);
    setData((d) => ({
      ...d,
      wishlist: has ? d.wishlist.filter((w) => w !== id) : [...d.wishlist, id],
    }));
    toast(has ? "info" : "success", has ? "Removed from wishlist" : "Added to wishlist");
  };
  const moveToWishlist = (id) => {
    setData((d) => ({
      ...d,
      cart: d.cart.filter((c) => c.id !== id),
      wishlist: d.wishlist.includes(id) ? d.wishlist : [...d.wishlist, id],
    }));
    toast("info", "Moved to wishlist");
  };

  const placeOrder = (summary) => {
    const order = {
      id: "BZ" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items: data.cart.map((c) => ({ ...c, title: getBook(c.id).title, price: getBook(c.id).price })),
      ...summary,
    };
    setData((d) => ({ ...d, cart: [], orders: [order, ...d.orders] }));
    return order;
  };

  const value = {
    user,
    signup,
    login,
    logout,
    cart: data.cart,
    wishlist: data.wishlist,
    orders: data.orders,
    inCart,
    inWishlist,
    addToCart,
    setQty,
    removeFromCart,
    toggleWishlist,
    moveToWishlist,
    placeOrder,
    toasts,
    toast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
