import { Link } from 'react-router-dom';
import './Home.css';

interface HomeProps {
	currentUser: string | null;
	onLogout: () => void;
}

function Home({ currentUser, onLogout }: HomeProps) {
	return (
		<div className="home-container">
			<div className="user-header">
				<span className="welcome-text">Welcome, {currentUser}!</span>
				<button onClick={onLogout} className="logout-btn">Logout</button>
			</div>
			<div className="title-with-logo">
				<img src="/road-dog-logo.jpg" alt="Road Dog" className="logo" />
				<h1>Road Dog</h1>
			</div>
			<p className="home-subtitle">Your touring management hub</p>
			
			<div className="home-cards">
				<Link to="/booking-manager" className="home-card">
					<div className="card-icon">📅</div>
					<h2>Booking Manager</h2>
					<p>Manage show bookings, venues, and schedules</p>
				</Link>

				<Link to="/revenue-manager" className="home-card">
					<div className="card-icon">💰</div>
					<h2>Revenue Manager</h2>
					<p>Track income, expenses, and financial reports</p>
				</Link>

				<Link to="/business-docs" className="home-card">
					<div className="card-icon">📄</div>
					<h2>Business Docs</h2>
					<p>Store contracts, invoices, and important documents</p>
				</Link>
			</div>
		</div>
	);
}

export default Home;
