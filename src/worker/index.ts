import { Hono } from "hono";
import { cors } from "hono/cors";

interface Env {
	ROAD_DOG_KV: KVNamespace;
}

type Variables = {
	username: string;
};

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
	createdBy?: string;
	updatedBy?: string;
	updatedAt?: string;
}

const VALID_CREDENTIALS: Record<string, string> = {
	root: 'root',
	danny: 'danny',
	brooke: 'brooke',
	jared: 'jared',
	joey: 'joey',
	chris: 'chris',
	josh: 'josh',
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Enable CORS for all routes
app.use('/api/*', cors());

// Authentication middleware
const authenticate = async (c: any, next: any) => {
	const authHeader = c.req.header('Authorization');
	if (!authHeader || !authHeader.startsWith('Basic ')) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	const base64Credentials = authHeader.split(' ')[1];
	const credentials = atob(base64Credentials);
	const [username, password] = credentials.split(':');

	if (VALID_CREDENTIALS[username] !== password) {
		return c.json({ error: 'Invalid credentials' }, 401);
	}

	c.set('username', username);
	await next();
};

// Get all shows
app.get("/api/shows", authenticate, async (c) => {
	try {
		const showsData = await c.env.ROAD_DOG_KV.get('shows');
		const shows = showsData ? JSON.parse(showsData) : [];
		return c.json({ shows });
	} catch (error) {
		return c.json({ error: 'Failed to fetch shows' }, 500);
	}
});

// Create a new show
app.post("/api/shows", authenticate, async (c) => {
	try {
		const username = c.get('username');
		const newShow: Show = await c.req.json();
		
		// Add metadata
		newShow.createdBy = username;
		newShow.updatedBy = username;
		newShow.updatedAt = new Date().toISOString();

		const showsData = await c.env.ROAD_DOG_KV.get('shows');
		const shows: Show[] = showsData ? JSON.parse(showsData) : [];
		
		shows.push(newShow);
		await c.env.ROAD_DOG_KV.put('shows', JSON.stringify(shows));
		
		return c.json({ show: newShow }, 201);
	} catch (error) {
		return c.json({ error: 'Failed to create show' }, 500);
	}
});

// Update a show
app.put("/api/shows/:id", authenticate, async (c) => {
	try {
		const username = c.get('username');
		const id = c.req.param('id');
		const updatedShow: Partial<Show> = await c.req.json();

		const showsData = await c.env.ROAD_DOG_KV.get('shows');
		const shows: Show[] = showsData ? JSON.parse(showsData) : [];
		
		const index = shows.findIndex(show => show.id === id);
		if (index === -1) {
			return c.json({ error: 'Show not found' }, 404);
		}

		shows[index] = {
			...shows[index],
			...updatedShow,
			updatedBy: username,
			updatedAt: new Date().toISOString()
		};

		await c.env.ROAD_DOG_KV.put('shows', JSON.stringify(shows));
		
		return c.json({ show: shows[index] });
	} catch (error) {
		return c.json({ error: 'Failed to update show' }, 500);
	}
});

// Delete a show
app.delete("/api/shows/:id", authenticate, async (c) => {
	try {
		const id = c.req.param('id');

		const showsData = await c.env.ROAD_DOG_KV.get('shows');
		const shows: Show[] = showsData ? JSON.parse(showsData) : [];
		
		const filteredShows = shows.filter(show => show.id !== id);
		
		if (shows.length === filteredShows.length) {
			return c.json({ error: 'Show not found' }, 404);
		}

		await c.env.ROAD_DOG_KV.put('shows', JSON.stringify(filteredShows));
		
		return c.json({ success: true });
	} catch (error) {
		return c.json({ error: 'Failed to delete show' }, 500);
	}
});

app.get("/api/", (c) => c.json({ name: "Road Dog API", version: "1.0" }));

export default app;
