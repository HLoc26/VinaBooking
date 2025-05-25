import * as React from "react";
import { Grid, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SpaIcon from "@mui/icons-material/Spa";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function AmenitiesTabContent({ groupedAmenities }) {
	const amenityMeta = {
		"Swimming Pool": {
			icon: <PoolIcon />,
			description: "Relax and cool off in our outdoor pool.",
		},
		Restaurant: {
			icon: <RestaurantIcon />,
			description: "Enjoy delicious meals with a variety of cuisines.",
		},
		Gym: {
			icon: <FitnessCenterIcon />,
			description: "Stay active with our modern fitness equipment.",
		},
		Parking: {
			icon: <LocalParkingIcon />,
			description: "Secure on-site parking for your convenience.",
		},
		Bar: {
			icon: <LocalBarIcon />,
			description: "Unwind with drinks at our stylish bar.",
		},
		Spa: {
			icon: <SpaIcon />,
			description: "Pamper yourself with our luxurious spa services.",
		},
		"Conference Room": {
			icon: <MeetingRoomIcon />,
			description: "Host meetings in our fully-equipped conference rooms.",
		},
		__default__: {
			icon: <CheckCircleIcon />,
			description: "Available at this property.",
		},
	};

	const formatTypeLabel = (type) => {
		return type
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	return (
		<>
			<Typography variant="h5" gutterBottom>
				What this place offers
			</Typography>
			{Object.keys(groupedAmenities).length === 0 ? (
				<Typography>No amenities available</Typography>
			) : (
				<Grid container spacing={3} sx={{ mt: 2, width: "100%", display: "flex", flexDirection: "row", alignItems: "stretch", justifyContent: "center" }}>
					{Object.entries(groupedAmenities).map(([type, list]) => (
						<Grid key={type} sx={{ width: "30%" }}>
							<Paper
								elevation={2}
								sx={{
									p: 2,
									borderRadius: 2,
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography
									variant="subtitle1"
									gutterBottom
									sx={{
										fontWeight: "bold",
										color: "primary.main",
										flexShrink: 0,
									}}
								>
									{formatTypeLabel(type)}
								</Typography>
								<List dense sx={{ flexGrow: 1 }}>
									{list.map((am) => {
										const meta = amenityMeta[am.name] || amenityMeta["__default__"];
										return (
											<ListItem key={am.id} alignItems="flex-start">
												<ListItemIcon sx={{ minWidth: 32 }}>{meta.icon}</ListItemIcon>
												<ListItemText primary={am.name} secondary={meta.description} primaryTypographyProps={{ fontWeight: 500 }} />
											</ListItem>
										);
									})}
								</List>
							</Paper>
						</Grid>
					))}
				</Grid>
			)}
		</>
	);
}

export default AmenitiesTabContent;
