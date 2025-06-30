export default function NarrowPage({ children }) {
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      {children}
    </div>
  );
}
