import * as React from "react";
import { Box, TextField, Button, Typography, Container, Link, CircularProgress } from "@mui/material";
import { login } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.auth);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	// Redirect if user is already logged in
	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	const handleLogin = (e) => {
		// Prevent default if this is in a form
		if (e && e.preventDefault) e.preventDefault();

		// Validate input
		if (!email || !password) {
			alert("Email and password are required");
			return;
		}

		const credentials = {
			email: email,
			password: password,
		};

		console.log("Dispatching login with:", credentials);
		dispatch(login(credentials));
	};

	return (
		<Container maxWidth="sm">
			<Box
				component="form"
				onSubmit={handleLogin}
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					boxShadow: 3,
					padding: 4,
					borderRadius: 2,
					backgroundColor: "#fff",
				}}
			>
				<Typography variant="h4" fontWeight="bold" gutterBottom>
					Login
				</Typography>
				<TextField fullWidth label="Email" variant="outlined" margin="normal" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<Button fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }} type="submit" disabled={loading}>
					{loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
				</Button>

				{error && (
					<Typography color="error" sx={{ mt: 2 }}>
						{error}
					</Typography>
				)}

				<Typography variant="body2" sx={{ marginTop: 2 }}>
					Don't have an account?{" "}
					<Link href="/register" color="primary">
						Register
					</Link>
				</Typography>
			</Box>
		</Container>
	);
}

export default Login;
