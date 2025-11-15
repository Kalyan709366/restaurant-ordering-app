import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: "#fdf7f4" }}>
        <nav className="navbar navbar-expand-lg" style={{ background: "#b85c38" }}>
          <div className="container">
            <a className="navbar-brand text-white fw-bold" href="/admin/menu">
              Admin Panel
            </a>

            <div>
              <a className="btn btn-outline-light me-2" href="/admin/menu">Menu</a>
              <a className="btn btn-outline-light me-2" href="/admin/inventory">Inventory</a>
              <a className="btn btn-outline-light me-2" href="/admin/orders">Orders</a>
              <a className="btn btn-outline-light" href="/admin/history">History</a>
            </div>
          </div>
        </nav>

        <div className="container py-4">
          {children}
        </div>
      </body>
    </html>
  );
}
