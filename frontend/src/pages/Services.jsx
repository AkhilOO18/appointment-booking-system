import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (serviceId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/book/${serviceId}`);
  };

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Our Services</h1>
        <p>Pick a service below to see available slots.</p>
      </div>

      {loading && <p>Loading services...</p>}
      {!loading && services.length === 0 && (
        <p>No services available yet. Please check back soon.</p>
      )}

      <div className="grid">
        {services.map((s) => (
          <div className="card service-card" key={s._id}>
            <h3>{s.name}</h3>
            {s.description && <p>{s.description}</p>}
            <div className="meta">
              {s.durationMinutes} mins {s.provider ? `· ${s.provider}` : ""}
            </div>
            <div className="price">₹{s.price}</div>
            <button className="btn" onClick={() => handleBook(s._id)}>
              Book This
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
