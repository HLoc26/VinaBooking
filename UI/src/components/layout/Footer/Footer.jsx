import React from "react";
import { Box, Typography, Grid, Link, IconButton, Container, Divider, Button, Stack, Paper } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn, Email, LocationOn, FlightTakeoff } from "@mui/icons-material";

function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				backgroundColor: "#0a1929",
				color: "white",
				py: 6,
				mt: 8,
			}}
		>
			<Container maxWidth="lg">
				{/* Footer Top Section */}
				<Grid container spacing={4} justifyContent="space-between" sx={{ mb: 5 }}>
					{/* Company Info */}
					<Grid>
						<Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
							<FlightTakeoff sx={{ mr: 1, fontSize: "2rem" }} />
							<Typography variant="h5" fontWeight="700" letterSpacing=".5px">
								VinaBooking
							</Typography>
						</Box>
						<Typography variant="body2" sx={{ mb: 3, color: "rgba(255,255,255,0.7)", maxWidth: 300 }}>
							Discover Vietnam's hidden gems with our premium accommodation booking platform. From bustling cities to serene beaches, we help you find the perfect stay.
						</Typography>
						<Box sx={{ display: "flex", gap: 1 }}>
							<IconButton
								color="primary"
								sx={{
									backgroundColor: "rgba(255,255,255,0.1)",
									"&:hover": { backgroundColor: "#1976d2" },
								}}
								href="https://facebook.com"
								target="_blank"
							>
								<Facebook />
							</IconButton>
							<IconButton
								color="primary"
								sx={{
									backgroundColor: "rgba(255,255,255,0.1)",
									"&:hover": { backgroundColor: "#1976d2" },
								}}
								href="https://twitter.com"
								target="_blank"
							>
								<Twitter />
							</IconButton>
							<IconButton
								color="primary"
								sx={{
									backgroundColor: "rgba(255,255,255,0.1)",
									"&:hover": { backgroundColor: "#1976d2" },
								}}
								href="https://instagram.com"
								target="_blank"
							>
								<Instagram />
							</IconButton>
							<IconButton
								color="primary"
								sx={{
									backgroundColor: "rgba(255,255,255,0.1)",
									"&:hover": { backgroundColor: "#1976d2" },
								}}
								href="https://linkedin.com"
								target="_blank"
							>
								<LinkedIn />
							</IconButton>
						</Box>
					</Grid>

					{/* Quick Links */}
					<Grid>
						<Typography
							variant="h6"
							fontWeight="bold"
							gutterBottom
							sx={{ position: "relative", pb: 1.5, "&::after": { content: '""', position: "absolute", left: 0, bottom: 0, width: "40px", height: "2px", backgroundColor: "#1976d2" } }}
						>
							Company
						</Typography>
						<Stack spacing={1.5} sx={{ mt: 3 }}>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								About Us
							</Link>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								Careers
							</Link>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								Blog
							</Link>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								Press
							</Link>
						</Stack>
					</Grid>

					{/* Support Links */}
					<Grid>
						<Typography
							variant="h6"
							fontWeight="bold"
							gutterBottom
							sx={{ position: "relative", pb: 1.5, "&::after": { content: '""', position: "absolute", left: 0, bottom: 0, width: "40px", height: "2px", backgroundColor: "#1976d2" } }}
						>
							Support
						</Typography>
						<Stack spacing={1.5} sx={{ mt: 3 }}>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								Help Center
							</Link>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								FAQs
							</Link>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								Contact Support
							</Link>
							<Link href="#" sx={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", "&:hover": { color: "#1976d2" } }}>
								Terms of Service
							</Link>
						</Stack>
					</Grid>

					{/* Contact Info */}
					<Grid>
						<Typography
							variant="h6"
							fontWeight="bold"
							gutterBottom
							sx={{ position: "relative", pb: 1.5, "&::after": { content: '""', position: "absolute", left: 0, bottom: 0, width: "40px", height: "2px", backgroundColor: "#1976d2" } }}
						>
							Connect With Us
						</Typography>
						<Box>
							{/* Development Team */}
							<Paper
								elevation={0}
								sx={{
									p: 2.5,
									mt: 3,
									mb: 2,
									backgroundColor: "rgba(255,255,255,0.05)",
									borderRadius: 2,
									transition: "transform 0.3s",
									"&:hover": { transform: "translateY(-5px)" },
								}}
							>
								<Box sx={{ display: "flex", mb: 1 }}>
									<LinkedIn sx={{ mr: 2, color: "#1976d2" }} />
									<Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.9)" }}>
										Development Team
									</Typography>
								</Box>
								<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", ml: 4 }}>
									Huu Loc - Nhat Quang - Quang Sang - Gia Huy
								</Typography>
							</Paper>
							<Paper
								elevation={0}
								sx={{
									p: 2.5,
									backgroundColor: "rgba(255,255,255,0.05)",
									borderRadius: 2,
									transition: "transform 0.3s",
									"&:hover": { transform: "translateY(-5px)" },
								}}
							>
								<Box sx={{ display: "flex", mb: 3 }}>
									<Email sx={{ mr: 2, color: "#1976d2" }} />
									<Box>
										<Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.9)" }}>
											Email
										</Typography>
										<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
											cbl.nguyennhatquang2809@gmail.com
										</Typography>
									</Box>
								</Box>
								<Box sx={{ display: "flex" }}>
									<LocationOn sx={{ mr: 2, color: "#1976d2" }} />
									<Box>
										<Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.9)" }}>
											Address
										</Typography>
										<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
											So 1 Vo Van Ngan, Linh Chieu, Thu Duc, Ho Chi Minh City
										</Typography>
									</Box>
								</Box>
							</Paper>
						</Box>
					</Grid>
				</Grid>

				{/* Newsletter Section */}
				<Box
					sx={{
						py: 4,
						px: { xs: 2, md: 5 },
						mb: 5,
						borderRadius: 3,
						background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						alignItems: { xs: "flex-start", md: "center" },
						justifyContent: "space-between",
						gap: 3,
					}}
				>
					<Box sx={{ maxWidth: { md: "60%" } }}>
						<Typography variant="h5" fontWeight="bold" gutterBottom>
							Subscribe to our Newsletter
						</Typography>
						<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
							Get the latest offers, travel tips and destination inspiration straight to your inbox.
						</Typography>
					</Box>
					<Button
						variant="contained"
						sx={{
							backgroundColor: "white",
							color: "#1976d2",
							fontWeight: 600,
							"&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
						}}
					>
						Subscribe Now
					</Button>
				</Box>

				<Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

				{/* Footer Bottom Section */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
						pt: 3,
						gap: 2,
					}}
				>
					<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
						&copy; 2025 Vinabooking, HCMUTE
						<br />
						Huu Loc - Nhat Quang - Quang Sang - Gia Huy
					</Typography>
					<Box sx={{ display: "flex", gap: 3 }}>
						<Link href="#" sx={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { color: "#1976d2" } }}>
							Privacy Policy
						</Link>
						<Link href="#" sx={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { color: "#1976d2" } }}>
							Terms of Service
						</Link>
						<Link href="#" sx={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem", "&:hover": { color: "#1976d2" } }}>
							Cookie Policy
						</Link>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}

export default Footer;
