import { Link } from 'react-router-dom';
import '../App.css';

interface RevenueManagerProps {
	onLogout: () => void;
}

function RevenueManager({ onLogout }: RevenueManagerProps) {
	return (
		<div className="app-container">
			<div className="page-header">
				<div className="header-top">
					<Link to="/" className="back-link">← Back to Home</Link>
					<button onClick={onLogout} className="logout-btn-small">Logout</button>
				</div>
				<h1>revenue manager</h1>
			</div>
			<div className="coming-soon">
				<p>Revenue tracking and financial management coming soon...</p>
			</div>
		</div>
	);
}

export default RevenueManager;
