export function buildItemDiff(original, fromCard) {
  const norm = (v) => {
    if (typeof v === "string") {
      const t = v.trim();
      return t === "" ? null : t;
    }
    if (v === undefined) return null;
    return v;
  };
  const normPrice = (v) => {
    if (v === "" || v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };
  const from = {
    title: norm(fromCard.title),
    description: norm(fromCard.description),
    price: normPrice(fromCard.price),
    image: norm(fromCard.image),
  };
  const orig = {
    title: norm(original.title),
    description: norm(original.description),
    price: normPrice(original.price),
    image: norm(original.image ?? original.imageUrl),
  };
  const map = { image: "imageUrl" };
  const fields = ["title", "description", "price", "image"];
  const diff = {};
  for (const k of fields) {
    if (from[k] !== orig[k]) diff[map[k] || k] = from[k];
  }
  return diff;
}
