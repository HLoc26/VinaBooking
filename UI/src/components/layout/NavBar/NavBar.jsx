import * as React from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Avatar, Badge, Tooltip, Container, useScrollTrigger, Slide } from "@mui/material";
import * as Icon from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../features/auth/authSlice";

// Hide navbar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const isLoggedIn = !!user;

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMenuAnchor(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMenuAnchor(null);
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
		handleMobileMenuClose();
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<HideOnScroll>
			<AppBar 
				position="sticky" 
				elevation={0}
				sx={{
					background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
				}}
			>
				<Container maxWidth="xl">
					<Toolbar disableGutters sx={{ py: 0.5 }}>
						{/* Logo */}
						<Typography 
							variant="h5" 
							component="div" 
							sx={{ 
								mr: 4,
								fontWeight: 700,
								letterSpacing: '.5px',
								cursor: "pointer",
								display: 'flex',
								alignItems: 'center',
								'&:hover': { 
									textShadow: '0 0 10px rgba(255,255,255,0.5)' 
								},
								transition: 'all 0.3s'
							}} 
							onClick={() => navigate("/")}
						>
							<Icon.FlightTakeoff sx={{ mr: 1, fontSize: '1.8rem' }} />
							VinaBooking
						</Typography>

						{/* Desktop NavLinks */}
						<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}>
							<Button 
								color="inherit" 
								sx={{ 
									opacity: isActive('/') ? 1 : 0.85,
									fontWeight: isActive('/') ? 600 : 400,
									'&:hover': { opacity: 1, transform: 'translateY(-2px)' },
									transition: 'all 0.2s'
								}}
								onClick={() => navigate("/")}
							>
								Home
							</Button>
							<Button 
								color="inherit" 
								sx={{ 
									opacity: isActive('/search') ? 1 : 0.85,
									fontWeight: isActive('/search') ? 600 : 400,
									'&:hover': { opacity: 1, transform: 'translateY(-2px)' },
									transition: 'all 0.2s'
								}}
								onClick={() => navigate("/search")}
							>
								Explore
							</Button>
							{isLoggedIn && (
								<Button 
									color="inherit" 
									sx={{ 
										opacity: isActive('/saved') ? 1 : 0.85,
										fontWeight: isActive('/saved') ? 600 : 400,
										'&:hover': { opacity: 1, transform: 'translateY(-2px)' },
										transition: 'all 0.2s'
									}}
									onClick={() => navigate("/saved")} 
									startIcon={<Icon.Favorite />}
								>
									Saved
								</Button>
							)}
						</Box>

						{/* UserMenu */}
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							{isLoggedIn ? (
								<>
									<Tooltip title="Notifications">
										<IconButton sx={{ mr: 1, color: 'white', '&:hover': { transform: 'scale(1.1)' }, transition: 'all 0.2s' }}>
											<Badge badgeContent={3} color="error">
												<Icon.Notifications />
											</Badge>
										</IconButton>
									</Tooltip>
									<Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
										<Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
											{user?.name || "User"}
										</Typography>
									</Box>
									<Tooltip title="Account settings">
										<IconButton 
											onClick={handleMenuOpen} 
											color="inherit"
											sx={{ 
												p: 0.5,
												border: '2px solid rgba(255, 255, 255, 0.5)',
												'&:hover': { transform: 'scale(1.1)' },
												transition: 'all 0.2s'
											}}
										>
											<Avatar 
												alt={user?.name || "User"} 
												src={user?.avatar || "https://via.placeholder.com/40"}
												sx={{ width: 32, height: 32 }}
											/>
										</IconButton>
									</Tooltip>
									<Menu
										anchorEl={anchorEl}
										open={Boolean(anchorEl)}
										onClose={handleMenuClose}
										PaperProps={{
											elevation: 3,
											sx: { mt: 1.5, borderRadius: 2, minWidth: 180 }
										}}
										transformOrigin={{ vertical: "top", horizontal: "right" }}
										anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									>
										<MenuItem onClick={() => navigateTo("/profile")} sx={{ py: 1 }}>
											<Icon.Person sx={{ mr: 1.5, fontSize: '1.25rem', color: '#666' }} />
											Profile
										</MenuItem>
										<MenuItem onClick={() => navigateTo("/bookings")} sx={{ py: 1 }}>
											<Icon.Book sx={{ mr: 1.5, fontSize: '1.25rem', color: '#666' }} />
											Bookings
										</MenuItem>
										<MenuItem onClick={() => navigateTo("/settings")} sx={{ py: 1 }}>
											<Icon.Settings sx={{ mr: 1.5, fontSize: '1.25rem', color: '#666' }} />
											Settings
										</MenuItem>
										<MenuItem onClick={handleLogout} sx={{ py: 1, color: '#d32f2f' }}>
											<Icon.Logout sx={{ mr: 1.5, fontSize: '1.25rem' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<>
									<Button 
										variant="outlined" 
										color="inherit" 
										onClick={() => navigate("/login", { state: { from: location.pathname + location.search } })}
										sx={{ 
											mr: 1.5,
											borderRadius: '20px',
											borderColor: 'rgba(255, 255, 255, 0.5)',
											textTransform: 'none',
											px: 2,
											'&:hover': { 
												borderColor: 'white',
												backgroundColor: 'rgba(255, 255, 255, 0.1)' 
											}
										}}
									>
										Login
									</Button>
									<Button 
										variant="contained" 
										onClick={() => navigate("/register")}
										sx={{ 
											display: { xs: 'none', sm: 'block' },
											borderRadius: '20px',
											backgroundColor: 'white',
											color: '#1976d2',
											textTransform: 'none',
											px: 2,
											'&:hover': { 
												backgroundColor: 'rgba(255, 255, 255, 0.9)',
											}
										}}
									>
										Sign Up
									</Button>
								</>
							)}

							{/* Mobile Menu */}
							<IconButton 
								color="inherit" 
								sx={{ display: { xs: "block", md: "none" }, ml: 1 }}
								onClick={handleMobileMenuOpen}
							>
								<Icon.Menu />
							</IconButton>
							<Menu
								anchorEl={mobileMenuAnchor}
								open={Boolean(mobileMenuAnchor)}
								onClose={handleMobileMenuClose}
								PaperProps={{
									elevation: 3,
									sx: { mt: 1.5, width: '100%', maxWidth: '300px' }
								}}
								transformOrigin={{ vertical: "top", horizontal: "right" }}
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							>
								<MenuItem onClick={() => navigateTo("/")} sx={{ py: 1.5 }}>
									<Icon.Home sx={{ mr: 2, color: '#666' }} />
									Home
								</MenuItem>
								<MenuItem onClick={() => navigateTo("/search")} sx={{ py: 1.5 }}>
									<Icon.Search sx={{ mr: 2, color: '#666' }} />
									Explore
								</MenuItem>
								{isLoggedIn && (
									<>
										<MenuItem onClick={() => navigateTo("/saved")} sx={{ py: 1.5 }}>
											<Icon.Favorite sx={{ mr: 2, color: '#666' }} />
											Saved Accommodations
										</MenuItem>
										<MenuItem onClick={() => navigateTo("/profile")} sx={{ py: 1.5 }}>
											<Icon.Person sx={{ mr: 2, color: '#666' }} />
											Profile
										</MenuItem>
										<MenuItem onClick={() => navigateTo("/bookings")} sx={{ py: 1.5 }}>
											<Icon.Book sx={{ mr: 2, color: '#666' }} />
											Bookings
										</MenuItem>
										<MenuItem onClick={() => navigateTo("/settings")} sx={{ py: 1.5 }}>
											<Icon.Settings sx={{ mr: 2, color: '#666' }} />
											Settings
										</MenuItem>
										<MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#d32f2f' }}>
											<Icon.Logout sx={{ mr: 2 }} />
											Logout
										</MenuItem>
									</>
								)}
								{!isLoggedIn && (
									<MenuItem onClick={() => navigateTo("/register")} sx={{ py: 1.5, display: { xs: 'flex', sm: 'none' } }}>
										<Icon.PersonAdd sx={{ mr: 2, color: '#666' }} />
										Sign Up
									</MenuItem>
								)}
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
		</HideOnScroll>
	);
}

export default Navbar;
