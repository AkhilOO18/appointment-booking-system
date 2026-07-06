import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get("/appointments/mine")
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    await api.put(`/appointments/${id}/cancel`);
    load();
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>Everything you've booked, in one place.</p>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && appointments.length === 0 && (
        <p>You haven't booked anything yet.</p>
      )}

      {appointments.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.service?.name || "Deleted service"}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                <td>
                  {(a.status === "pending" || a.status === "confirmed") && (
                    <button className="btn btn-outline btn-sm" onClick={() => handleCancel(a._id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
