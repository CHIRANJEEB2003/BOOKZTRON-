// Local catalogue used in place of the original remote backend.
export const GENRES = [
  "Fiction",
  "Thriller",
  "Fantasy",
  "Science",
  "Biography",
  "Self-Help",
];

const raw = [
  ["The Silent Orchard", "Maya Rowe", "Fiction", 399, 599, 4.5, true, true, true],
  ["Paper Lanterns", "Ishaan Mehta", "Fiction", 299, 450, 4.1, true, false, false],
  ["A House of Tides", "Clara Benn", "Fiction", 549, 699, 3.8, false, true, false],
  ["Midnight Ledger", "Owen Pike", "Thriller", 449, 650, 4.6, true, true, true],
  ["Cold Platform", "Rhea Kapoor", "Thriller", 349, 499, 3.9, true, false, false],
  ["The Ninth Witness", "Daniel Shore", "Thriller", 499, 799, 4.3, true, true, false],
  ["Glass Signal", "Nora Quill", "Thriller", 279, 399, 3.4, false, false, true],
  ["Ember Crown", "Talia Voss", "Fantasy", 599, 899, 4.8, true, true, true],
  ["The Salt Dragon", "Arjun Nair", "Fantasy", 459, 599, 4.2, true, false, false],
  ["Wardens of Ash", "Lena Hart", "Fantasy", 389, 550, 3.7, true, true, false],
  ["Starfall Road", "Kenji Sato", "Fantasy", 649, 899, 4.4, false, true, true],
  ["Small Wonders of Physics", "Dr. Priya Rao", "Science", 699, 999, 4.7, true, true, true],
  ["The Living Cell", "Marcus Ellery", "Science", 549, 750, 4.0, true, false, false],
  ["Oceans Beneath Ice", "Sofia Lind", "Science", 499, 650, 3.6, true, true, false],
  ["Numbers Everywhere", "Ravi Shankar", "Science", 329, 450, 4.2, false, false, false],
  ["Steel and Sunrise", "Helen Ward", "Biography", 599, 799, 4.5, true, true, false],
  ["A Quiet Revolution", "Anand Iyer", "Biography", 449, 600, 3.9, true, false, true],
  ["The Long Walk Home", "Grace Obi", "Biography", 399, 550, 4.1, true, true, false],
  ["Ten Small Habits", "Leo Martin", "Self-Help", 249, 399, 4.3, true, true, true],
  ["Focus in a Noisy World", "Aisha Khan", "Self-Help", 349, 499, 4.0, true, false, false],
  ["Calm Mornings", "Tom Becker", "Self-Help", 199, 299, 3.5, true, true, false],
  ["The Courage Ledger", "Neha Joshi", "Self-Help", 299, 450, 4.6, false, true, false],
  ["Lighthouse Letters", "Emma Grey", "Fiction", 379, 520, 4.4, true, true, true],
  ["The Cipher Club", "Victor Hale", "Thriller", 419, 599, 4.1, true, false, false],
];

const palette = [
  ["#264653", "#2a9d8f"],
  ["#6d597a", "#b56576"],
  ["#1d3557", "#457b9d"],
  ["#7f5539", "#b08968"],
  ["#3a5a40", "#588157"],
  ["#9d0208", "#dc2f02"],
  ["#5a189a", "#9d4edd"],
  ["#003049", "#d62828"],
];

export const BOOKS = raw.map(
  ([title, author, genre, price, originalPrice, rating, inStock, fastDelivery, isNew], i) => ({
    id: String(i + 1),
    title,
    author,
    genre,
    price,
    originalPrice,
    rating,
    inStock,
    fastDelivery,
    isNew,
    colors: palette[i % palette.length],
    description: `${title} by ${author} is a much-loved ${genre.toLowerCase()} title. ` +
      "Readers praise its memorable characters, careful pacing and an ending that stays with you long after the last page.",
  })
);

export const getBook = (id) => BOOKS.find((b) => b.id === id);

export const COUPONS = {
  BOOK10: { label: "10% off", apply: (total) => Math.round(total * 0.1) },
  FLAT100: { label: "₹100 off on orders above ₹999", apply: (total) => (total >= 999 ? 100 : 0) },
};
