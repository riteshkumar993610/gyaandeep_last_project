import { useState } from "react";
import api from "../api";

export default function WhatsApp() {
  const [qr, setQr] = useState(null);
  const [message, setMessage] = useState("");

  const startWhatsApp = async () => {
    const res = await api.post("/whatsapp/start");
    setMessage(res.data.message);
  };

  const getQR = async () => {
    const res = await api.get("/whatsapp/qr");

    if (res.data.qr) {
      setQr(res.data.qr);
      setMessage("Scan this QR from WhatsApp Linked Devices");
    } else {
      setMessage(res.data.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">WhatsApp Service</h1>

      <div className="bg-white p-5 rounded shadow max-w-xl">
        <button
          onClick={startWhatsApp}
          className="bg-green-700 text-white px-5 py-2 rounded mr-3"
        >
          Start WhatsApp
        </button>

        <button
          onClick={getQR}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Get QR
        </button>

        <p className="mt-4 font-semibold">{message}</p>

        {qr && (
          <img
            src={qr}
            alt="WhatsApp QR"
            className="mt-5 w-64 border p-3"
          />
        )}

        <div className="mt-5 bg-gray-100 p-3 rounded">
          <p>Customer WhatsApp message examples:</p>
          <p className="font-bold">product list</p>
          <p className="font-bold">order rice 2</p>
        </div>
      </div>
    </div>
  );
}