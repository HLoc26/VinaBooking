import React from "react";
import { Box, Typography, Grid, Link, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

function Footer() {
	return (
		<Box sx={{ backgroundColor: "#f8f9fa", padding: 4, marginTop: 6 }}>
			{/* FooterTop */}
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
				{/* Logo */}
				<Typography variant="h6" fontWeight="bold">
					VinaBooking
				</Typography>

				{/* SocialLinks */}
				<Box>
					<IconButton color="primary" href="https://facebook.com" target="_blank">
						<Facebook />
					</IconButton>
					<IconButton color="primary" href="https://twitter.com" target="_blank">
						<Twitter />
					</IconButton>
					<IconButton color="primary" href="https://instagram.com" target="_blank">
						<Instagram />
					</IconButton>
					<IconButton color="primary" href="https://linkedin.com" target="_blank">
						<LinkedIn />
					</IconButton>
				</Box>
			</Box>

			{/* FooterLinks */}
			<Grid container spacing={4} sx={{ marginBottom: 4 }}>
				{/* Column: About Us */}
				<Grid>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						About Us
					</Typography>
					<Box>
						<Link href="#" color="inherit" underline="hover" display="block">
							Our Story
						</Link>
						<Link href="#" color="inherit" underline="hover" display="block">
							Careers
						</Link>
						<Link href="#" color="inherit" underline="hover" display="block">
							Blog
						</Link>
					</Box>
				</Grid>

				{/* Column: Support */}
				<Grid item>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Support
					</Typography>
					<Box>
						<Link href="#" color="inherit" underline="hover" display="block">
							Help Center
						</Link>
						<Link href="#" color="inherit" underline="hover" display="block">
							FAQs
						</Link>
						<Link href="#" color="inherit" underline="hover" display="block">
							Contact Support
						</Link>
					</Box>
				</Grid>

				{/* Column: Legal */}
				<Grid item>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Legal
					</Typography>
					<Box>
						<Link href="#" color="inherit" underline="hover" display="block">
							Terms of Service
						</Link>
						<Link href="#" color="inherit" underline="hover" display="block">
							Privacy Policy
						</Link>
						<Link href="#" color="inherit" underline="hover" display="block">
							Cookie Policy
						</Link>
					</Box>
				</Grid>

				{/* Column: Contact */}
				<Grid item>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Contact
					</Typography>
					<Box>
						<Typography variant="body2" color="text.secondary">
							Email: support@hotelbooking.com
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Phone: +1 234 567 890
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Address: 123 Main Street, City, Country
						</Typography>
					</Box>
				</Grid>
			</Grid>

			{/* FooterBottom */}
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ddd", paddingTop: 2 }}>
				{/* Copyright */}
				<Typography variant="body2" color="text.secondary">
					&copy; {new Date().getFullYear()} HotelBooking. All rights reserved.
				</Typography>

				{/* TermsLink and PrivacyLink */}
				<Box>
					<Link href="#" color="inherit" underline="hover" sx={{ marginRight: 2 }}>
						Terms of Service
					</Link>
					<Link href="#" color="inherit" underline="hover">
						Privacy Policy
					</Link>
				</Box>
			</Box>
		</Box>
	);
}

export default Footer;
