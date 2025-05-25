import * as React from "react";
import { Container, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";

function PolicyTabContent({ accommodation }) {
	const getPrepaymentDescription = (value) => {
		switch (value?.toUpperCase()) {
			case "FULL":
				return "Full prepayment is required before check-in.";
			case "HALF":
				return "50% prepayment is required before check-in.";
			case "NONE":
				return "No prepayment required.";
			default:
				return "No information available about prepayment.";
		}
	};

	const getCancellationDescription = (value) => {
		switch (value?.toUpperCase()) {
			case "CANCEL_24H":
				return "Free cancellation up to 24 hours before check-in.";
			case "CANCEL_3D":
				return "Free cancellation up to 3 days before check-in.";
			case "CANCEL_7D":
				return "Free cancellation up to 7 days before check-in.";
			case "CANCEL_15D":
				return "Free cancellation up to 15 days before check-in.";
			case "NO_CANCEL":
				return "No cancellation allowed after booking.";
			default:
				return "No information available about cancellation policy.";
		}
	};

	return (
		<Container maxWidth="sm" sx={{ py: 4 }}>
			<Paper
				elevation={2}
				sx={{
					p: 4,
					borderRadius: 3,
					boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
				}}
			>
				<Typography variant="h5" fontWeight="bold" gutterBottom>
					House Rules & Policies
				</Typography>
				{accommodation?.policy ? (
					<List disablePadding>
						<ListItem alignItems="flex-start">
							<ListItemIcon>
								<AccessTimeIcon color="primary" />
							</ListItemIcon>
							<ListItemText
								primary="Check-in / Check-out"
								secondary={`Check-in: ${accommodation.policy.checkIn?.substring(0, 5) || "---"} | Check-out: ${accommodation.policy.checkOut?.substring(0, 5) || "---"}`}
								primaryTypographyProps={{ fontWeight: "medium" }}
							/>
						</ListItem>
						<Divider variant="inset" component="li" sx={{ my: 1 }} />
						<ListItem alignItems="flex-start">
							<ListItemIcon>
								<CancelIcon color="error" />
							</ListItemIcon>
							<ListItemText primary="Cancellation Policy" secondary={getCancellationDescription(accommodation.policy.cancellation)} primaryTypographyProps={{ fontWeight: "medium" }} />
						</ListItem>
						<Divider variant="inset" component="li" sx={{ my: 1 }} />
						<ListItem alignItems="flex-start">
							<ListItemIcon>
								<PaymentIcon color="success" />
							</ListItemIcon>
							<ListItemText primary="Prepayment" secondary={getPrepaymentDescription(accommodation.policy.prepay)} primaryTypographyProps={{ fontWeight: "medium" }} />
						</ListItem>
					</List>
				) : (
					<Typography variant="body1" color="text.secondary">
						Loading policy information...
					</Typography>
				)}
			</Paper>
		</Container>
	);
}

export default PolicyTabContent;
