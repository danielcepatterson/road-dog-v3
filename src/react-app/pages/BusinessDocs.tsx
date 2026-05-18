import { Link } from 'react-router-dom';
import '../App.css';

interface BusinessDocsProps {
	onLogout: () => void;
}

function BusinessDocs({ onLogout }: BusinessDocsProps) {
	return (
		<div className="app-container">
			<div className="page-header">
				<div className="header-top">
					<Link to="/" className="back-link">← Back to Home</Link>
					<button onClick={onLogout} className="logout-btn-small">Logout</button>
				</div>
				<h1>business docs</h1>
			</div>
			<div className="coming-soon">
				<p>Document management system coming soon...</p>
			</div>
		</div>
	);
}

export default BusinessDocs;
