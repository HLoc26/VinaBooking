import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, Link } from "@mui/material";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = () => {
		// Implement register functionality here
		console.log("Register with:", { name, email, password });
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
					Register
				</Typography>
				<TextField fullWidth label="Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
				<TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
				<TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
				<Button fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleRegister}>
					Register
				</Button>
				<Typography variant="body2" sx={{ marginTop: 2 }}>
					Already have an account?{" "}
					<Link href="/login" color="primary">
						Login
					</Link>
				</Typography>
			</Box>
		</Container>
	);
}

export default Register;
