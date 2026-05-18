import { Link } from 'react-router-dom';
import '../App.css';

function BusinessDocs() {
	return (
		<div className="app-container">
			<div className="page-header">
				<Link to="/" className="back-link">← Back to Home</Link>
				<h1>business docs</h1>
			</div>
			<div className="coming-soon">
				<p>Document management system coming soon...</p>
			</div>
		</div>
	);
}

export default BusinessDocs;
