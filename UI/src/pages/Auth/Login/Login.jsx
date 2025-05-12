import * as React from "react";
import { Box, TextField, Button, Typography, Container, Link, CircularProgress, FormControlLabel, Checkbox, Paper } from "@mui/material";
import { login } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getFavourite } from "../../../features/favourite/favoritesSlice";

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const fromPath = location.state?.from || "/";
	const { loading, error, user } = useSelector((state) => state.auth);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [rememberMe, setRememberMe] = React.useState(false);

	// Redirect if user is already logged in
	useEffect(() => {
		if (user) {
			navigate(fromPath, { replace: true });
		}
	}, [user, navigate, fromPath]);

	const handleLogin = async (e) => {
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
			rememberMe: rememberMe, // Include the rememberMe option
		};

		console.log("Dispatching login"); // Removed credentials from log
		await dispatch(login(credentials)); // Await to make sure user have logged in before get their favs
		dispatch(getFavourite());
	};

	return (
		<Container component="main" maxWidth="sm" sx={{ 
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			padding: 3
		}}>
			<Paper
				elevation={6}
				sx={{
					width: '100%',
					borderRadius: 3,
					overflow: 'hidden',
					transition: 'all 0.3s ease-in-out',
					'&:hover': {
						boxShadow: 10,
					},
				}}
			>
				<Box
					sx={{
						bgcolor: 'primary.main',
						color: 'white',
						padding: 3,
						textAlign: 'center',
					}}
				>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Welcome Back
					</Typography>
					<Typography variant="subtitle1">
						Sign in to continue to VinaBooking
					</Typography>
				</Box>

				<Box
					component="form"
					onSubmit={handleLogin}
					sx={{
						padding: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						backgroundColor: "#fff",
					}}
				>
					<TextField 
						fullWidth 
						label="Email" 
						variant="outlined" 
						margin="normal" 
						name="email" 
						value={email} 
						onChange={(e) => setEmail(e.target.value)} 
						required 
						disabled={loading}
						InputProps={{
							sx: { borderRadius: 2 }
						}}
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						variant="outlined"
						margin="normal"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={loading}
						InputProps={{
							sx: { borderRadius: 2 }
						}}
					/>

					<Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", mt: 1, mb: 2 }}>
						<FormControlLabel 
							control={
								<Checkbox 
									checked={rememberMe} 
									onChange={(e) => setRememberMe(e.target.checked)} 
									color="primary" 
									disabled={loading} 
								/>
							} 
							label="Remember me" 
						/>
						<Link href="#" underline="hover" color="primary.main" sx={{ alignSelf: 'center' }}>
							Forgot password?
						</Link>
					</Box>

					<Button 
						fullWidth 
						variant="contained" 
						color="primary" 
						type="submit" 
						disabled={loading}
						sx={{ 
							marginTop: 2,
							padding: '12px',
							borderRadius: 2,
							fontSize: '1rem',
							fontWeight: 'bold',
							textTransform: 'none',
							transition: 'all 0.2s',
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: 4,
							}
						}}
					>
						{loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
					</Button>

					{error && (
						<Typography color="error" sx={{ mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1, width: '100%', textAlign: 'center' }}>
							{error}
						</Typography>
					)}

					<Box sx={{ marginTop: 4, textAlign: 'center' }}>
						<Typography variant="body2">
							Don't have an account?{" "}
							<Link href="/register" color="primary" underline="hover" sx={{ fontWeight: 'bold' }}>
								Create an account
							</Link>
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}

export default Login;
