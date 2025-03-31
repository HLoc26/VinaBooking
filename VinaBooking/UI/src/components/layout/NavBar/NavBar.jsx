import * as React from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import * as Icon from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Navbar() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Mock login state
	const navigate = useNavigate();

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<AppBar position="fixed" color="primary">
			<Toolbar>
				{/* Logo */}
				<Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
					VinaBooking
				</Typography>

				{/* NavLinks */}
				<Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
					<Button color="inherit">Saved Accommodation</Button>
				</Box>

				{/* UserMenu */}
				{isLoggedIn ? (
					<Box>
						<IconButton>
							<Icon.Notifications htmlColor="white" />
						</IconButton>
						<IconButton onClick={handleMenuOpen} color="inherit">
							<Avatar alt="User Profile" src="https://via.placeholder.com/40" />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "right" }}
						>
							<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
							<MenuItem onClick={handleMenuClose}>Bookings</MenuItem>
							<MenuItem onClick={handleMenuClose}>Settings</MenuItem>
							<MenuItem
								onClick={() => {
									setIsLoggedIn(false);
									handleMenuClose();
								}}
							>
								Logout
							</MenuItem>
						</Menu>
					</Box>
				) : (
					<Button color="inherit" onClick={() => navigate("/login")}>
						Login
					</Button>
				)}

				{/* Mobile Menu */}
				<IconButton color="inherit" sx={{ display: { xs: "block", md: "none" } }}>
					<Icon.Menu />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
