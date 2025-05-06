import React, { useState } from "react";
import { Box, Button, FormControl, Modal, Typography } from "@mui/material";
import { DateTimePickerRange } from "../DateTimePickerRange";
import OccupancyInput from "../OccupancyInput/OccupancyInput";
import * as Icon from "@mui/icons-material";
import LocationInput from "../LocationInput/LocationInput";

function SearchBar({ initialData = {}, onSearch }) {
	const [dateRange, setDateRange] = useState(
		initialData.dateRange || {
			startDate: new Date(),
			endDate: new Date(),
		}
	);
	const [occupancy, setOccupancy] = useState(
		initialData.occupancy || {
			adults: 1,
			children: 0,
			rooms: 1,
		}
	);
	const [location, setLocation] = useState(initialData.location || "");
	const [error, setError] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);

	const handleSearch = (e) => {
		e.preventDefault();

		// Check if location is empty
		if (!location || !location.display_name) {
			setError(true);
			setModalOpen(true); // Open the modal
			return;
		}

		if (onSearch) {
			onSearch({ location, dateRange, occupancy });
		}
	};

	return (
		<>
			<Box
				component="form"
				onSubmit={handleSearch}
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: 2,
					padding: 2,
					border: "1px solid #e0e0e0",
					borderRadius: 2,
					boxShadow: 2,
					backgroundColor: "#fff",
					margin: "0 auto",
					alignItems: "center",
					maxWidth: "100%",
				}}
			>
				{/* Location Input */}
				<FormControl sx={{ flex: 1, minWidth: "200px", width: 1 }}>
					<LocationInput
						value={location.locationLabel}
						onSelect={(location) => {
							setError(false);
							setLocation(location);
						}}
						onChange={(location) => {
							setError(false);
							setLocation({ ...location.address, display_name: location.display_name });
						}}
						error={error}
						helperText={error ? "Please select a location" : ""}
					/>
				</FormControl>
				{/* Date Range Picker */}
				<FormControl sx={{ flex: 1, minWidth: "300px", width: 1 }}>
					<DateTimePickerRange value={dateRange} minDate={new Date().setDate(new Date().getDate() - 1)} onChange={(newRange) => setDateRange(newRange)} showTime={false} numMonths={2} />
				</FormControl>
				{/* Occupancy Input */}
				<FormControl sx={{ flex: 1, minWidth: "200px", width: 1 }}>
					<OccupancyInput value={occupancy} onChange={(newOccupancy) => setOccupancy(newOccupancy)} />
				</FormControl>
				{/* Search Button */}
				<FormControl sx={{ flex: 0.5, minWidth: "150px" }}>
					<Button type="submit" variant="contained" color="primary" fullWidth>
						<Icon.Search />
						Search
					</Button>
				</FormControl>
			</Box>

			{/* Modal for Error */}
			<Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-labelledby="modal-title" aria-describedby="modal-description">
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 300,
						bgcolor: "#ffebee", // Light red background
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
						border: "1px solid #d32f2f", // Red border
					}}
				>
					<Typography
						id="modal-title"
						variant="h6"
						component="h2"
						gutterBottom
						sx={{ color: "#d32f2f" }} // Red text for the title
					>
						Missing Location
					</Typography>
					<Typography
						id="modal-description"
						variant="body2"
						color="text.secondary"
						sx={{ color: "#d32f2f" }} // Red text for the description
					>
						Please select a location before searching.
					</Typography>
					<Button
						variant="contained"
						fullWidth
						sx={{
							mt: 2,
							bgcolor: "#d32f2f", // Red button background
							"&:hover": {
								bgcolor: "#b71c1c", // Darker red on hover
							},
						}}
						onClick={() => setModalOpen(false)}
					>
						OK
					</Button>
				</Box>
			</Modal>
		</>
	);
}

export default SearchBar;
