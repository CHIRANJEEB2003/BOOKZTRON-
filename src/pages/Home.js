import { Link } from "react-router-dom";
import { BOOKS, GENRES } from "../data/books";
import { ProductCard } from "../components/Shared";
import { HeroArt } from "../components/Art";

export default function Home() {
  const newArrivals = BOOKS.filter((b) => b.isNew).slice(0, 4);
  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <h1>Find your next favourite book</h1>
          <p>Fiction, thrillers, fantasy, science and more, delivered to your door.</p>
          <Link to="/products" className="btn large">
            Shop now
          </Link>
        </div>
        <HeroArt />
      </section>

      <section className="container">
        <h2>Categories</h2>
        <div className="genre-grid">
          {GENRES.map((g) => (
            <Link key={g} to={`/products?genre=${encodeURIComponent(g)}`} className="genre-tile">
              {g}
            </Link>
          ))}
        </div>

        <h2>New arrivals</h2>
        <div className="grid">
          {newArrivals.map((b) => (
            <ProductCard key={b.id} book={b} />
          ))}
        </div>
      </section>
    </main>
  );
}
