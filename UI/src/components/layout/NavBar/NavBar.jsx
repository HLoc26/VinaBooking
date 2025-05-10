import * as React from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import * as Icon from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../features/auth/authSlice";

function Navbar() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const isLoggedIn = !!user;

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		dispatch(logoutUser()).then(() => {
			handleMenuClose();
			navigate("/");
		});
	};

	const navigateTo = (path) => {
		navigate(path);
		handleMenuClose();
	};

	return (
		<AppBar position="sticky" color="primary">
			<Toolbar>
				{/* Logo */}
				<Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/")}>
					VinaBooking
				</Typography>

				{/* NavLinks */}
				<Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
					{isLoggedIn && (
							<Button 
								color="inherit" 
								onClick={() => navigate("/saved")}
								startIcon={<Icon.Favorite />}
							>
								Saved Accommodations
							</Button>
					)}
				</Box>

				{/* UserMenu */}
				{isLoggedIn ? (
					<Box>
						<IconButton>
							<Icon.Notifications htmlColor="white" />
						</IconButton>
						<IconButton onClick={handleMenuOpen} color="inherit">
							<Avatar alt={user?.name || "User"} src="https://via.placeholder.com/40" />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "right" }}
						>
							<MenuItem onClick={() => navigateTo("/profile")}>Profile</MenuItem>
							<MenuItem onClick={() => navigateTo("/bookings")}>Bookings</MenuItem>
							<MenuItem onClick={() => navigateTo("/settings")}>Settings</MenuItem>
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
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
