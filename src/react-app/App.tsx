// src/App.tsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import BookingManager from './pages/BookingManager';
import RevenueManager from './pages/RevenueManager';
import BusinessDocs from './pages/BusinessDocs';
import "./App.css";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [currentUser, setCurrentUser] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is already logged in
		const savedUser = localStorage.getItem('currentUser');
		const authToken = localStorage.getItem('authToken');
		
		if (savedUser && authToken) {
			setCurrentUser(savedUser);
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, []);

	const handleLogin = (username: string) => {
		setCurrentUser(username);
		setIsAuthenticated(true);
		localStorage.setItem('currentUser', username);
		localStorage.setItem('authToken', 'authenticated');
	};

	const handleLogout = () => {
		setCurrentUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem('currentUser');
		localStorage.removeItem('authToken');
		localStorage.removeItem('userPassword');
	};

	if (isLoading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<p>Loading...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Login onLogin={handleLogin} />;
	}

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home currentUser={currentUser} onLogout={handleLogout} />} />
				<Route path="/booking-manager" element={<BookingManager onLogout={handleLogout} />} />
				<Route path="/revenue-manager" element={<RevenueManager onLogout={handleLogout} />} />
				<Route path="/business-docs" element={<BusinessDocs onLogout={handleLogout} />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Router>
	);
}

export default App;
