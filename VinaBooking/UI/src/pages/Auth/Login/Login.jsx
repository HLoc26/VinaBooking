import * as React from "react";
import { Box, TextField, Button, Typography, Container, Link } from "@mui/material";
import { login } from "../../../features/auth/authSlice";
import { useDispatch } from "react-redux";

function Login() {
	const dispatch = useDispatch();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const handleLogin = () => {
		dispatch(login({ email: email, password: password }));
	};

	return (
		<Container maxWidth="sm">
			<Box
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
				<TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
				<TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
				<Button fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleLogin}>
					Login
				</Button>
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
