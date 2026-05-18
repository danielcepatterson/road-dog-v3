import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import '../App.css';
import './RevenueManager.css';

interface RevenueManagerProps {
	onLogout: () => void;
}

function RevenueManager({ onLogout }: RevenueManagerProps) {
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [memberPayout, setMemberPayout] = useState(0);
	const [showCount, setShowCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadRevenue();
	}, []);

	const loadRevenue = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const shows = await apiClient.getShows();
			
			// Calculate total revenue from payment amounts
			let total = 0;
			shows.forEach(show => {
				if (show.paymentAmount) {
					// Parse the payment amount (remove $, commas, and convert to number)
					const amount = parseFloat(show.paymentAmount.replace(/[$,]/g, ''));
					if (!isNaN(amount)) {
						total += amount;
					}
				}
			});

			setTotalRevenue(total);
			setMemberPayout(total / 7); // 1/7th for each member
			setShowCount(shows.length);
		} catch (err) {
			setError('Failed to load revenue data. Please try again.');
			console.error('Error loading revenue:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	return (
		<div className="app-container">
			<div className="page-header">
				<div className="header-top">
					<Link to="/" className="back-link">← Back to Home</Link>
					<button onClick={onLogout} className="logout-btn-small">Logout</button>
				</div>
				<h1>revenue manager</h1>
			</div>

			{error && (
				<div className="error-banner">
					{error}
					<button onClick={() => setError(null)} className="error-close">×</button>
				</div>
			)}

			{isLoading ? (
				<div className="loading-state">Loading revenue data...</div>
			) : (
				<div className="revenue-dashboard">
					<div className="revenue-stats">
						<div className="stat-card total-revenue">
							<div className="stat-icon">💰</div>
							<div className="stat-content">
								<h3>Total Booked Revenue</h3>
								<p className="stat-value">{formatCurrency(totalRevenue)}</p>
								<p className="stat-detail">From {showCount} show{showCount !== 1 ? 's' : ''}</p>
							</div>
						</div>

						<div className="stat-card member-payout">
							<div className="stat-icon">👤</div>
							<div className="stat-content">
								<h3>Member Payout</h3>
								<p className="stat-value">{formatCurrency(memberPayout)}</p>
								<p className="stat-detail">1/7th split per member</p>
							</div>
						</div>
					</div>

					<div className="revenue-breakdown">
						<h2>Payment Breakdown</h2>
						<div className="breakdown-table">
							<div className="breakdown-row">
								<span className="breakdown-label">Gross Revenue:</span>
								<span className="breakdown-value">{formatCurrency(totalRevenue)}</span>
							</div>
							<div className="breakdown-row">
								<span className="breakdown-label">Number of Members:</span>
								<span className="breakdown-value">7</span>
							</div>
							<div className="breakdown-row highlight">
								<span className="breakdown-label">Payout per Member:</span>
								<span className="breakdown-value">{formatCurrency(memberPayout)}</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default RevenueManager;
