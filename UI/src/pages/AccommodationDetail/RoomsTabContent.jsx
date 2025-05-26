import * as React from "react";
import { Grid, Box, Typography } from "@mui/material";
import RoomCard from "../../components/ui/RoomCard/RoomCard";
import BookingSummary from "../../components/ui/BookingSummary/BookingSummary";

function RoomsTabContent({ rooms }) {
	return (
		<Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
			<Grid size={8}>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					{rooms && rooms.length > 0 ? (
						rooms.map((room) => <RoomCard key={room.id} room={room} />)
					) : (
						<Typography variant="body1" color="text.secondary">
							No rooms available at the moment.
						</Typography>
					)}
				</Box>
			</Grid>
			<Grid size={4}>
				<Box sx={{ position: { md: "sticky" }, top: { md: "140px" }, marginBottom: "2em" }}>
					<BookingSummary hideTitle={true} />
				</Box>
			</Grid>
		</Grid>
	);
}

export default RoomsTabContent;
