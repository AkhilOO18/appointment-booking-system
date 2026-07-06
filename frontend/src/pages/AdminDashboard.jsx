import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [tab, setTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    durationMinutes: 30,
    price: 0,
    provider: "",
  });
  const [error, setError] = useState("");

  const loadAppointments = () => api.get("/appointments").then((res) => setAppointments(res.data));
  const loadServices = () => api.get("/services/all").then((res) => setServices(res.data));

  useEffect(() => {
    loadAppointments();
    loadServices();
  }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    loadAppointments();
  };

  const handleServiceFormChange = (e) =>
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });

  const handleAddService = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/services", serviceForm);
      setServiceForm({ name: "", description: "", durationMinutes: 30, price: 0, provider: "" });
      loadServices();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add service");
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Delete this service? Existing appointments for it will remain but show as deleted.")) return;
    await api.delete(`/services/${id}`);
    loadServices();
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage services and every appointment booked across the system.</p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          className={tab === "appointments" ? "btn" : "btn btn-outline"}
          onClick={() => setTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={tab === "services" ? "btn" : "btn btn-outline"}
          onClick={() => setTab("services")}
        >
          Manage Services
        </button>
      </div>

      {tab === "appointments" && (
        <>
          {appointments.length === 0 && <p>No appointments booked yet.</p>}
          {appointments.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      {a.user?.name || "Unknown"}
                      <br />
                      <small>{a.user?.email}</small>
                    </td>
                    <td>{a.service?.name || "Deleted service"}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                    <td>
                      <select value={a.status} onChange={(e) => handleStatusChange(a._id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === "services" && (
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <h3>Add a Service</h3>
            <form className="form form-wide" onSubmit={handleAddService}>
              <div>
                <label>Name</label>
                <input name="name" value={serviceForm.name} onChange={handleServiceFormChange} required />
              </div>
              <div>
                <label>Description</label>
                <textarea name="description" rows={2} value={serviceForm.description} onChange={handleServiceFormChange} />
              </div>
              <div>
                <label>Duration (minutes)</label>
                <input type="number" name="durationMinutes" value={serviceForm.durationMinutes} onChange={handleServiceFormChange} min={5} />
              </div>
              <div>
                <label>Price (₹)</label>
                <input type="number" name="price" value={serviceForm.price} onChange={handleServiceFormChange} min={0} />
              </div>
              <div>
                <label>Provider / Staff (optional)</label>
                <input name="provider" value={serviceForm.provider} onChange={handleServiceFormChange} />
              </div>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="btn">Add Service</button>
            </form>
          </div>

          <div>
            <h3>Existing Services</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {services.map((s) => (
                <div className="card" key={s._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{s.name}</strong>
                    <div className="meta">₹{s.price} · {s.durationMinutes} mins {!s.isActive && "(inactive)"}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteService(s._id)}>
                    Delete
                  </button>
                </div>
              ))}
              {services.length === 0 && <p>No services added yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
