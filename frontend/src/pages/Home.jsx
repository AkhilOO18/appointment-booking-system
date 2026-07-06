import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero container">
     <h1>Look good. Feel great. Book in seconds.</h1>
<p>
  Browse our salon services, pick a stylist and time that suits you,
  and manage your bookings in one place — no calls needed.
</p>
      <Link to="/services" className="btn btn-accent">Browse Services</Link>
    </div>
  );
}
