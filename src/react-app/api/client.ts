// API client for backend communication

const API_URL = import.meta.env.DEV ? 'http://localhost:5173/api' : '/api';

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

class APIClient {
	private getAuthHeader(): string {
		const username = localStorage.getItem('currentUser');
		const password = localStorage.getItem('userPassword');
		if (!username || !password) {
			throw new Error('Not authenticated');
		}
		return 'Basic ' + btoa(`${username}:${password}`);
	}

	async getShows(): Promise<Show[]> {
		const response = await fetch(`${API_URL}/shows`, {
			headers: {
				'Authorization': this.getAuthHeader(),
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch shows');
		}

		const data = await response.json();
		return data.shows;
	}

	async createShow(show: Show): Promise<Show> {
		const response = await fetch(`${API_URL}/shows`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': this.getAuthHeader(),
			},
			body: JSON.stringify(show),
		});

		if (!response.ok) {
			throw new Error('Failed to create show');
		}

		const data = await response.json();
		return data.show;
	}

	async updateShow(id: string, show: Partial<Show>): Promise<Show> {
		const response = await fetch(`${API_URL}/shows/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': this.getAuthHeader(),
			},
			body: JSON.stringify(show),
		});

		if (!response.ok) {
			throw new Error('Failed to update show');
		}

		const data = await response.json();
		return data.show;
	}

	async deleteShow(id: string): Promise<void> {
		const response = await fetch(`${API_URL}/shows/${id}`, {
			method: 'DELETE',
			headers: {
				'Authorization': this.getAuthHeader(),
			},
		});

		if (!response.ok) {
			throw new Error('Failed to delete show');
		}
	}
}

export const apiClient = new APIClient();
export type { Show };
