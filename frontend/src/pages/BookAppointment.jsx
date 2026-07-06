import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function BookAppointment() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/services").then((res) => {
      const found = res.data.find((s) => s._id === serviceId);
      setService(found || null);
    });
  }, [serviceId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/appointments", { service: serviceId, ...form });
      setSuccess("Appointment booked! Redirecting to your appointments...");
      setTimeout(() => navigate("/my-appointments"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not book this slot");
    } finally {
      setSubmitting(false);
    }
  };

  // Prevents picking a date before today in the date picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Book Appointment</h1>
        {service && <p>{service.name} · {service.durationMinutes} mins · ₹{service.price}</p>}
      </div>

      {!service && <p>Loading service details...</p>}

      {service && (
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label>Date</label>
            <input type="date" name="date" min={today} value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
          </div>
          <div>
            <label>Notes (optional)</label>
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} />
          </div>
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      )}
    </div>
  );
}
