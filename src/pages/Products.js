import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BOOKS, GENRES } from "../data/books";
import { ProductCard } from "../components/Shared";

const PAGE_SIZE = 8;
const MAX_PRICE = 1000;

const initialFilters = (genre) => ({
  sort: "",
  min: 0,
  max: MAX_PRICE,
  genres: genre ? [genre] : [],
  rating: 0,
  includeOutOfStock: true,
  fastOnly: false,
});

export default function Products() {
  const [params] = useSearchParams();
  const query = (params.get("q") || "").toLowerCase();
  const [f, setF] = useState(() => initialFilters(params.get("genre")));
  const [page, setPage] = useState(1);

  useEffect(() => {
    const g = params.get("genre");
    if (g) setF((prev) => ({ ...prev, genres: [g] }));
  }, [params]);

  const set = (key, value) => {
    setF((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const toggleGenre = (g) =>
    set("genres", f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g]);

  const results = useMemo(() => {
    let list = BOOKS.filter(
      (b) =>
        (!query ||
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query)) &&
        b.price >= f.min &&
        b.price <= f.max &&
        (f.genres.length === 0 || f.genres.includes(b.genre)) &&
        b.rating >= f.rating &&
        (f.includeOutOfStock || b.inStock) &&
        (!f.fastOnly || b.fastDelivery)
    );
    if (f.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (f.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [f, query]);

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <main className="container listing">
      <aside className="filters">
        <div className="row between">
          <h3>Filters</h3>
          <button
            className="link-btn"
            onClick={() => {
              setF(initialFilters());
              setPage(1);
            }}
          >
            Clear all
          </button>
        </div>

        <h4>Sort by price</h4>
        <label>
          <input type="radio" checked={f.sort === "asc"} onChange={() => set("sort", "asc")} /> Low to high
        </label>
        <label>
          <input type="radio" checked={f.sort === "desc"} onChange={() => set("sort", "desc")} /> High to low
        </label>

        <h4>Price range</h4>
        <div className="row">
          <input
            type="number"
            min="0"
            value={f.min}
            onChange={(e) => set("min", Number(e.target.value) || 0)}
            aria-label="Minimum price"
          />
          <span>to</span>
          <input
            type="number"
            min="0"
            value={f.max}
            onChange={(e) => set("max", Number(e.target.value) || 0)}
            aria-label="Maximum price"
          />
        </div>

        <h4>Genre</h4>
        {GENRES.map((g) => (
          <label key={g}>
            <input type="checkbox" checked={f.genres.includes(g)} onChange={() => toggleGenre(g)} /> {g}
          </label>
        ))}

        <h4>Rating</h4>
        {[4, 3, 2, 0].map((r) => (
          <label key={r}>
            <input type="radio" checked={f.rating === r} onChange={() => set("rating", r)} />{" "}
            {r ? `${r}★ & above` : "Any"}
          </label>
        ))}

        <h4>Availability</h4>
        <label>
          <input
            type="checkbox"
            checked={f.includeOutOfStock}
            onChange={(e) => set("includeOutOfStock", e.target.checked)}
          />{" "}
          Include out of stock
        </label>
        <label>
          <input type="checkbox" checked={f.fastOnly} onChange={(e) => set("fastOnly", e.target.checked)} /> Fast
          delivery only
        </label>
      </aside>

      <section className="results">
        <p className="muted">
          {query && <>Results for “{params.get("q")}” · </>}
          {results.length} book{results.length === 1 ? "" : "s"}
        </p>
        {shown.length === 0 ? (
          <p className="empty">No books match these filters.</p>
        ) : (
          <div className="grid">
            {shown.map((b) => (
              <ProductCard key={b.id} book={b} />
            ))}
          </div>
        )}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`btn small ${n === current ? "" : "outline"}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
