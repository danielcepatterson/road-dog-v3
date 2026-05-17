// src/App.tsx

import { useState, useEffect } from "react";
import "./App.css";

interface Show {
	id: string;
	date: string;
	venue: string;
	city: string;
	state: string;
	artist: string;
	ticketPrice: string;
	notes: string;
}

function App() {
	const [shows, setShows] = useState<Show[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [formData, setFormData] = useState({
		date: "",
		venue: "",
		city: "",
		state: "",
		artist: "",
		ticketPrice: "",
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
		const newShow: Show = {
			id: Date.now().toString(),
			...formData,
		};
		setShows((prev) => [...prev, newShow]);
		// Reset form
		setFormData({
			date: "",
			venue: "",
			city: "",
			state: "",
			artist: "",
			ticketPrice: "",
			notes: "",
		});
	};

	const handleDelete = (id: string) => {
		setShows((prev) => prev.filter((show) => show.id !== id));
		const updatedShows = shows.filter((show) => show.id !== id);
		localStorage.setItem("bookedShows", JSON.stringify(updatedShows));
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
								<div key={show.id} className="calendar-show" title={`${show.artist} at ${show.venue}`}>
									<div className="calendar-show-artist">{show.artist}</div>
									<div className="calendar-show-venue">{show.venue}</div>
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

			<div className="form-container">
				<h2>Add New Show</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-row">
						<div className="form-group">
							<label htmlFor="date">Date *</label>
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

					<div className="form-row">
						<div className="form-group">
							<label htmlFor="venue">Venue *</label>
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
					</div>

					<div className="form-row">
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
					</div>

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

					<button type="submit" className="submit-btn">
						Add Show
					</button>
				</form>
			</div>

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
									<div className="show-header">
										<h3>{show.artist}</h3>
										<button
											className="delete-btn"
											onClick={() => handleDelete(show.id)}
											aria-label="Delete show"
										>
											×
										</button>
									</div>
									<div className="show-details">
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
										<p>
											<strong>📍 Location:</strong> {show.city}
											{show.state && `, ${show.state}`}
										</p>
										{show.ticketPrice && (
											<p>
												<strong>🎟️ Price:</strong> {show.ticketPrice}
											</p>
										)}
										{show.notes && (
											<p className="show-notes">
												<strong>📝 Notes:</strong> {show.notes}
											</p>
										)}
									</div>
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
