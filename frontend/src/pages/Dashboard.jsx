import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    api.get("/subscription").then((res) => {
      setSubscription(res.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold text-xl">ERP</h2>
          <p>Login, Business Info, Products, Orders</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold text-xl">AI Service</h2>
          <p>Information from product records</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold text-xl">Subscription</h2>
          <p>
            Status:{" "}
            <b className={subscription?.active ? "text-green-600" : "text-red-600"}>
              {subscription?.active ? "Active" : "Expired"}
            </b>
          </p>
        </div>
      </div>
    </div>
  );
}