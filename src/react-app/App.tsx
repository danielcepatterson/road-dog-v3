// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookingManager from './pages/BookingManager';
import RevenueManager from './pages/RevenueManager';
import BusinessDocs from './pages/BusinessDocs';
import "./App.css";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/booking-manager" element={<BookingManager />} />
				<Route path="/revenue-manager" element={<RevenueManager />} />
				<Route path="/business-docs" element={<BusinessDocs />} />
			</Routes>
		</Router>
	);
}

export default App;
