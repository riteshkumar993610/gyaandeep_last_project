import { useEffect, useState } from "react";
import api from "../api";

export default function BusinessInfo() {
  const [form, setForm] = useState({
    business_name: "",
    category: "grocery",
    timing: "",
    whatsapp_no: "",
    contact_no: "",
    address: "",
  });

  useEffect(() => {
    api.get("/business").then((res) => {
      if (res.data) setForm(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/business", form);
    alert("Business info saved");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Business Info</h1>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow max-w-xl">
        {["business_name", "category", "timing", "whatsapp_no", "contact_no", "address"].map(
          (field) => (
            <input
              key={field}
              className="border p-2 w-full mb-3"
              placeholder={field}
              value={form[field] || ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          )
        )}

        <button className="bg-green-700 text-white px-5 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}