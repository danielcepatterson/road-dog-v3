import { Link } from 'react-router-dom';
import '../App.css';

function RevenueManager() {
	return (
		<div className="app-container">
			<div className="page-header">
				<Link to="/" className="back-link">← Back to Home</Link>
				<h1>revenue manager</h1>
			</div>
			<div className="coming-soon">
				<p>Revenue tracking and financial management coming soon...</p>
			</div>
		</div>
	);
}

export default RevenueManager;
