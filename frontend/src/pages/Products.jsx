import { useEffect, useState } from "react";
import api from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product_name: "",
    cost: "",
    min_quantity: "",
    stock: "",
    unit: "",
  });

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/products", form);

    setForm({
      product_name: "",
      cost: "",
      min_quantity: "",
      stock: "",
      unit: "",
    });

    loadProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Products</h1>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow mb-5 grid md:grid-cols-5 gap-3">
        <input
          className="border p-2"
          placeholder="Product Name"
          value={form.product_name}
          onChange={(e) => setForm({ ...form, product_name: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Cost"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Min Qty"
          value={form.min_quantity}
          onChange={(e) => setForm({ ...form, min_quantity: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          className="border p-2"
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        <button className="bg-green-700 text-white px-5 py-2 rounded md:col-span-5">
          Add Product
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-2">Name</th>
              <th>Cost</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b text-center">
                <td className="p-2">{p.product_name}</td>
                <td>₹{p.cost}</td>
                <td>{p.stock}</td>
                <td>{p.unit}</td>
                <td>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-5 text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}