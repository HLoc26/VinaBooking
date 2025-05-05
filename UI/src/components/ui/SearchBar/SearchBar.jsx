import React, { useState } from "react";
import { Box, TextField, Button, FormControl } from "@mui/material";
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

	const handleSearch = (e) => {
		e.preventDefault();
		if (onSearch) {
			console.log("On search", location);

			onSearch({ location, dateRange, occupancy });
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSearch}
			sx={{
				display: "flex",
				flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
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
						console.log("Selected location:", { ...location.address, display_name: location.display_name });
						setLocation(location);
					}}
					onChange={(location) => setLocation({ ...location.address, display_name: location.display_name })}
				/>
			</FormControl>
			{/* Date Range Picker */}
			<FormControl sx={{ flex: 1, minWidth: "300px", width: 1 }}>
				<DateTimePickerRange
					value={dateRange}
					minDate={new Date()} // Prevent selecting past dates
					onChange={(newRange) => setDateRange(newRange)}
					showTime={false}
					numMonths={2}
				/>
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
	);
}

export default SearchBar;
