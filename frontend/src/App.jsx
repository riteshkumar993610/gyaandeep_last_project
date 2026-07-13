import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BusinessInfo from "./pages/BusinessInfo";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import WhatsApp from "./pages/WhatsApp";

function Layout({ children }) {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white p-4 flex gap-5">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/business">Business</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/whatsapp">WhatsApp</Link>
        <button onClick={logout} className="ml-auto bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </nav>

      <div className="p-5">{children}</div>
    </div>
  );
}

function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        <Route
          path="/business"
          element={
            <Protected>
              <BusinessInfo />
            </Protected>
          }
        />

        <Route
          path="/products"
          element={
            <Protected>
              <Products />
            </Protected>
          }
        />

        <Route
          path="/orders"
          element={
            <Protected>
              <Orders />
            </Protected>
          }
        />

        <Route
          path="/whatsapp"
          element={
            <Protected>
              <WhatsApp />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}