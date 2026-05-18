// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";

interface Show {
	id: string;
	date: string;
	venue: string;
	venueAddress: string;
	city: string;
	state: string;
	artist: string;
	pocName: string;
	pocPhone: string;
	pocEmail: string;
	loadInTime: string;
	soundCheckTime: string;
	doorsTime: string;
	performanceTime: string;
	ticketPrice: string;
	parkingDetails: string;
	backlineDrums: string;
	backlineBass: string;
	sound: string;
	paymentAmount: string;
	settlementType: string;
	contract: string;
	notes: string;
}

function App() {
	const [shows, setShows] = useState<Show[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [expandedShows, setExpandedShows] = useState<Set<string>>(new Set());
	const [isFormExpanded, setIsFormExpanded] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		date: "",
		venue: "",
		venueAddress: "",
		city: "",
		state: "",
		artist: "",
		pocName: "",
		pocPhone: "",
		pocEmail: "",
		loadInTime: "",
		soundCheckTime: "",
		doorsTime: "",
		performanceTime: "",
		ticketPrice: "",
		parkingDetails: "",
		backlineDrums: "",
		backlineBass: "",
		sound: "",
		paymentAmount: "",
		settlementType: "",
		contract: "",
		notes: "",
	});

	// Load shows from localStorage on mount
	useEffect(() => {
		const savedShows = localStorage.getItem("bookedShows");
		if (savedShows) {
			setShows(JSON.parse(savedShows));
		}
	}, []);

	// Save shows to localStorage whenever they change
	useEffect(() => {
		if (shows.length > 0) {
			localStorage.setItem("bookedShows", JSON.stringify(shows));
		}
	}, [shows]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingId) {
			// Update existing show
			setShows((prev) =>
				prev.map((show) =>
					show.id === editingId ? { ...show, ...formData } : show
				)
			);
			setEditingId(null);
		} else {
			// Create new show
			const newShow: Show = {
				id: Date.now().toString(),
				...formData,
			};
			setShows((prev) => [...prev, newShow]);
		}
		// Reset form
		setFormData({
			date: "",
			venue: "",
			venueAddress: "",
			city: "",
			state: "",
			artist: "",
			pocName: "",
			pocPhone: "",
			pocEmail: "",
			loadInTime: "",
			soundCheckTime: "",
			doorsTime: "",
			performanceTime: "",
			ticketPrice: "",
			parkingDetails: "",
			backlineDrums: "",
			backlineBass: "",
			sound: "",
			paymentAmount: "",
			settlementType: "",
			contract: "",
			notes: "",
		});
		// Collapse form after submission
		setIsFormExpanded(false);
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this show?")) {
			setShows((prev) => prev.filter((show) => show.id !== id));
			const updatedShows = shows.filter((show) => show.id !== id);
			localStorage.setItem("bookedShows", JSON.stringify(updatedShows));
		}
	};

	const handleEdit = (show: Show) => {
		setFormData({
			date: show.date,
			venue: show.venue,
			venueAddress: show.venueAddress,
			city: show.city,
			state: show.state,
			artist: show.artist,
			pocName: show.pocName,
			pocPhone: show.pocPhone,
			pocEmail: show.pocEmail,
			loadInTime: show.loadInTime,
			soundCheckTime: show.soundCheckTime,
			doorsTime: show.doorsTime,
			performanceTime: show.performanceTime,
			ticketPrice: show.ticketPrice,
			parkingDetails: show.parkingDetails,
			backlineDrums: show.backlineDrums,
			backlineBass: show.backlineBass,
			sound: show.sound,
			paymentAmount: show.paymentAmount,
			settlementType: show.settlementType,
			contract: show.contract,
			notes: show.notes,
		});
		setEditingId(show.id);
		setIsFormExpanded(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setFormData({
			date: "",
			venue: "",
			venueAddress: "",
			city: "",
			state: "",
			artist: "",
			pocName: "",
			pocPhone: "",
			pocEmail: "",
			loadInTime: "",
			soundCheckTime: "",
			doorsTime: "",
			performanceTime: "",
			ticketPrice: "",
			parkingDetails: "",
			backlineDrums: "",
			backlineBass: "",
			sound: "",
			paymentAmount: "",
			settlementType: "",
			contract: "",
			notes: "",
		});
	};

	const toggleShowExpanded = (id: string) => {
		setExpandedShows((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const formatTimeTo12Hour = (time24: string) => {
		if (!time24) return "";
		const [hours, minutes] = time24.split(":");
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? "PM" : "AM";
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	};

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		return new Date(year, month + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		return new Date(year, month, 1).getDay();
	};

	const getShowsForDate = (dateStr: string) => {
		return shows.filter((show) => show.date === dateStr);
	};

	const previousMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
	};

	const nextMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
	};

	const goToToday = () => {
		setCurrentMonth(new Date());
	};

	const renderCalendar = () => {
		const daysInMonth = getDaysInMonth(currentMonth);
		const firstDay = getFirstDayOfMonth(currentMonth);
		const days = [];
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < firstDay; i++) {
			days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
		}

		// Add cells for each day of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
			const dayShows = getShowsForDate(dateStr);
			const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

			days.push(
				<div key={day} className={`calendar-day ${isToday ? "today" : ""} ${dayShows.length > 0 ? "has-shows" : ""}`}>
					<div className="calendar-day-number">{day}</div>
					{dayShows.length > 0 && (
						<div className="calendar-shows">
							{dayShows.map((show) => (
								<div key={show.id} className="calendar-show" title={`${show.artist} at ${show.venue}${show.performanceTime ? ` - ${formatTimeTo12Hour(show.performanceTime)}` : ''}`}>
									<div className="calendar-show-artist">{show.artist}</div>
									<div className="calendar-show-venue">{show.venue}</div>
									{show.performanceTime && <div className="calendar-show-time">🎤 {formatTimeTo12Hour(show.performanceTime)}</div>}
								</div>
							))}
						</div>
					)}
				</div>
			);
		}

		return days;
	};

	return (
		<div className="app-container">
			<h1>🎸 Show Booking Manager</h1>
			<button 
				className="add-show-toggle-btn"
				onClick={() => {
					if (isFormExpanded && editingId) {
						handleCancelEdit();
					}
					setIsFormExpanded(!isFormExpanded);
				}}
			>
				{isFormExpanded ? '− Hide Form' : editingId ? '+ Edit Show' : '+ Add New Show'}
			</button>

		{isFormExpanded && (
			<div className="form-container">
				<h2>{editingId ? 'Edit Show' : 'Add New Show'}</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-section">
						<h3>Basic Information</h3>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="date">Date of Event *</label>
								<input
									type="date"
									id="date"
									name="date"
									value={formData.date}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="artist">Artist/Band *</label>
								<input
									type="text"
									id="artist"
									name="artist"
									value={formData.artist}
									onChange={handleInputChange}
									placeholder="Artist or Band Name"
									required
								/>
							</div>
						</div>
					</div>

					<div className="form-section">
						<h3>Venue Details</h3>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="venue">Venue Name *</label>
								<input
									type="text"
									id="venue"
									name="venue"
									value={formData.venue}
									onChange={handleInputChange}
									placeholder="Venue Name"
									required
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="venueAddress">Venue Address</label>
							<input
								type="text"
								id="venueAddress"
								name="venueAddress"
								value={formData.venueAddress}
								onChange={handleInputChange}
								placeholder="123 Main St"
							/>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="city">City *</label>
								<input
									type="text"
									id="city"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
									placeholder="City"
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="state">State</label>
								<input
									type="text"
									id="state"
									name="state"
									value={formData.state}
									onChange={handleInputChange}
									placeholder="State/Province"
								/>
							</div>
						</div>
					</div>

					<div className="form-section">
						<h3>Point of Contact</h3>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="pocName">Contact Name</label>
								<input
									type="text"
									id="pocName"
									name="pocName"
									value={formData.pocName}
									onChange={handleInputChange}
									placeholder="John Doe"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="pocPhone">Contact Phone</label>
								<input
									type="tel"
									id="pocPhone"
									name="pocPhone"
									value={formData.pocPhone}
									onChange={handleInputChange}
									placeholder="(555) 123-4567"
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="pocEmail">Contact Email</label>
							<input
								type="email"
								id="pocEmail"
								name="pocEmail"
								value={formData.pocEmail}
								onChange={handleInputChange}
								placeholder="contact@venue.com"
							/>
						</div>
					</div>

					<div className="form-section">
						<h3>Schedule</h3>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="loadInTime">Load In Time</label>
								<input
									type="time"
									id="loadInTime"
									name="loadInTime"
									value={formData.loadInTime}
									onChange={handleInputChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="soundCheckTime">Sound Check Time</label>
								<input
									type="time"
									id="soundCheckTime"
									name="soundCheckTime"
									value={formData.soundCheckTime}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="doorsTime">Doors Time</label>
								<input
									type="time"
									id="doorsTime"
									name="doorsTime"
									value={formData.doorsTime}
									onChange={handleInputChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="performanceTime">Performance Time</label>
								<input
									type="time"
									id="performanceTime"
									name="performanceTime"
									value={formData.performanceTime}
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</div>

					<div className="form-section">
						<h3>Technical & Logistics</h3>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="backlineDrums">Backline Drums</label>
								<input
									type="text"
									id="backlineDrums"
									name="backlineDrums"
									value={formData.backlineDrums}
									onChange={handleInputChange}
									placeholder="Full kit, snare only, etc."
								/>
							</div>
							<div className="form-group">
								<label htmlFor="backlineBass">Backline Bass</label>
								<input
									type="text"
									id="backlineBass"
									name="backlineBass"
									value={formData.backlineBass}
									onChange={handleInputChange}
									placeholder="Amp provided, etc."
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="sound">Sound</label>
							<input
								type="text"
								id="sound"
								name="sound"
								value={formData.sound}
								onChange={handleInputChange}
								placeholder="In-house PA, monitors, etc."
							/>
						</div>
						<div className="form-group">
							<label htmlFor="parkingDetails">Parking Details</label>
							<textarea
								id="parkingDetails"
								name="parkingDetails"
								value={formData.parkingDetails}
								onChange={handleInputChange}
								placeholder="Loading dock location, parking pass info, etc."
								rows={2}
							/>
						</div>
					</div>

					<div className="form-section">
						<h3>Financial Details</h3>
						<div className="form-row">
							<div className="form-group">
								<label htmlFor="ticketPrice">Ticket Price</label>
								<input
									type="text"
									id="ticketPrice"
									name="ticketPrice"
									value={formData.ticketPrice}
									onChange={handleInputChange}
									placeholder="$25"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="paymentAmount">Payment Amount</label>
								<input
									type="text"
									id="paymentAmount"
									name="paymentAmount"
									value={formData.paymentAmount}
									onChange={handleInputChange}
									placeholder="$500"
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="settlementType">Settlement Type & Terms</label>
							<input
								type="text"
								id="settlementType"
								name="settlementType"
								value={formData.settlementType}
								onChange={handleInputChange}
								placeholder="Guarantee, door split, percentage, etc."
							/>
						</div>
						<div className="form-group">
							<label htmlFor="contract">Contract</label>
							<input
								type="text"
								id="contract"
								name="contract"
								value={formData.contract}
								onChange={handleInputChange}
								placeholder="Signed, pending, link to document, etc."
							/>
						</div>
					</div>

					<div className="form-section">
						<h3>Additional Notes</h3>
						<div className="form-group">
							<label htmlFor="notes">Notes</label>
							<textarea
								id="notes"
								name="notes"
								value={formData.notes}
								onChange={handleInputChange}
								placeholder="Additional notes about the show..."
								rows={3}
							/>
						</div>
					</div>

					<div style={{ display: "flex", gap: "10px" }}>
						<button type="submit" className="submit-btn">
							{editingId ? "Update Show" : "Add Show"}
						</button>
						{editingId && (
							<button
								type="button"
								className="cancel-btn"
								onClick={handleCancelEdit}
							>
								Cancel
							</button>
						)}
					</div>
				</form>
			</div>
			)}

			<div className="shows-container">
				<h2>Booked Shows ({shows.length})</h2>
				{shows.length === 0 ? (
					<p className="empty-state">No shows booked yet. Add your first show above!</p>
				) : (
					<div className="shows-list">
						{shows
							.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
							.map((show) => (
								<div key={show.id} className="show-card">
									<div className="show-header" onClick={() => toggleShowExpanded(show.id)}>
									<div className="show-title">
										<span className="expand-icon">{expandedShows.has(show.id) ? '▼' : '▶'}</span>
										<h3>{show.artist} @ {show.venue}</h3>
									</div>
								<div className="show-actions">
									<button
										className="edit-btn"
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(show);
										}}
										aria-label="Edit show"
									>
										✏️
									</button>
									<button
										className="delete-btn"
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(show.id);
										}}
										aria-label="Delete show"
									>
										×
									</button>
								</div>
									</div>
						{expandedShows.has(show.id) && (
							<div className="show-details">
										<div className="detail-section">
											<p>
												<strong>📅 Date:</strong>{" "}
												{new Date(show.date + "T00:00:00").toLocaleDateString("en-US", {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
											<p>
												<strong>🏛️ Venue:</strong> {show.venue}
											</p>
											{show.venueAddress && (
												<p>
													<strong>📬 Address:</strong> {show.venueAddress}
												</p>
											)}
											<p>
												<strong>📍 Location:</strong> {show.city}
												{show.state && `, ${show.state}`}
											</p>
										</div>

										{(show.pocName || show.pocPhone || show.pocEmail) && (
											<div className="detail-section">
												<p className="section-title"><strong>Contact Information</strong></p>
												{show.pocName && <p><strong>👤 Name:</strong> {show.pocName}</p>}
												{show.pocPhone && <p><strong>📞 Phone:</strong> {show.pocPhone}</p>}
												{show.pocEmail && <p><strong>📧 Email:</strong> {show.pocEmail}</p>}
											</div>
										)}

										{(show.loadInTime || show.soundCheckTime || show.doorsTime || show.performanceTime) && (
											<div className="detail-section">
												<p className="section-title"><strong>Schedule</strong></p>
										{show.loadInTime && <p><strong>🚚 Load In:</strong> {formatTimeTo12Hour(show.loadInTime)}</p>}
										{show.soundCheckTime && <p><strong>🎚️ Sound Check:</strong> {formatTimeTo12Hour(show.soundCheckTime)}</p>}
										{show.doorsTime && <p><strong>🚪 Doors:</strong> {formatTimeTo12Hour(show.doorsTime)}</p>}
										{show.performanceTime && <p><strong>🎤 Performance:</strong> {formatTimeTo12Hour(show.performanceTime)}</p>}
											</div>
										)}

										{(show.backlineDrums || show.backlineBass || show.sound) && (
											<div className="detail-section">
												<p className="section-title"><strong>Technical</strong></p>
												{show.backlineDrums && <p><strong>🥁 Drums:</strong> {show.backlineDrums}</p>}
												{show.backlineBass && <p><strong>🎸 Bass:</strong> {show.backlineBass}</p>}
												{show.sound && <p><strong>🔊 Sound:</strong> {show.sound}</p>}
											</div>
										)}

										{(show.ticketPrice || show.paymentAmount || show.settlementType || show.contract) && (
											<div className="detail-section">
												<p className="section-title"><strong>Financial</strong></p>
												{show.ticketPrice && <p><strong>🎟️ Ticket Price:</strong> {show.ticketPrice}</p>}
												{show.paymentAmount && <p><strong>💰 Payment:</strong> {show.paymentAmount}</p>}
												{show.settlementType && <p><strong>📋 Settlement:</strong> {show.settlementType}</p>}
												{show.contract && <p><strong>📄 Contract:</strong> {show.contract}</p>}
											</div>
										)}

										{show.parkingDetails && (
											<div className="detail-section">
												<p className="section-title"><strong>Logistics</strong></p>
												<p><strong>🅿️ Parking:</strong> {show.parkingDetails}</p>
											</div>
										)}

										{show.notes && (
											<div className="detail-section">
												<p className="show-notes">
													<strong>📝 Notes:</strong> {show.notes}
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						))}
						</div>
					)}
				</div>

			<div className="calendar-container">
				<div className="calendar-header">
					<h2>📅 Calendar View</h2>
					<div className="calendar-controls">
						<button onClick={previousMonth} className="month-nav-btn">
							← Prev
						</button>
						<button onClick={goToToday} className="today-btn">
							Today
						</button>
						<span className="current-month">
							{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
						</span>
						<button onClick={nextMonth} className="month-nav-btn">
							Next →
						</button>
					</div>
				</div>

				<div className="calendar">
					<div className="calendar-weekdays">
						<div className="weekday">Sun</div>
						<div className="weekday">Mon</div>
						<div className="weekday">Tue</div>
						<div className="weekday">Wed</div>
						<div className="weekday">Thu</div>
						<div className="weekday">Fri</div>
						<div className="weekday">Sat</div>
					</div>
					<div className="calendar-days">{renderCalendar()}</div>
				</div>
			</div>
		</div>
	);
}

export default App;
