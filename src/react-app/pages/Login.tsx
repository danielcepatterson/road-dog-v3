import { useState } from 'react';
import './Login.css';

interface LoginProps {
	onLogin: (username: string) => void;
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

function Login({ onLogin }: LoginProps) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (VALID_CREDENTIALS[username] === password) {
			// Store password for API authentication
			localStorage.setItem('userPassword', password);
			onLogin(username);
		} else {
			setError('Invalid username or password');
			setPassword('');
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h1>Road Dog</h1>
				<p className="login-subtitle">Sign in to continue</p>
				
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
								setError('');
							}}
							placeholder="Enter your username"
							required
							autoFocus
						/>
					</div>
					
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError('');
							}}
							placeholder="Enter your password"
							required
						/>
					</div>
					
					{error && <div className="error-message">{error}</div>}
					
					<button type="submit" className="login-btn">
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
