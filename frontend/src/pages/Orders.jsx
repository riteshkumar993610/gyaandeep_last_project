import { useEffect, useState } from "react";
import api from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Orders</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-2">Customer</th>
              <th>Mobile</th>
              <th>Total Qty</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b text-center">
                <td className="p-2">{o.customer?.name}</td>
                <td>{o.customer?.mobile}</td>
                <td>{o.total_quantity}</td>
                <td>₹{o.total_pricing}</td>
                <td>{o.status}</td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-5 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}