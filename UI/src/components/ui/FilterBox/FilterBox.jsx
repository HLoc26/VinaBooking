import React, { useState } from "react";
import { Box, Typography, Slider, Checkbox, FormControlLabel, Button } from "@mui/material";

function FilterBox() {
	const [priceRange, setPriceRange] = useState([0, 500]);
	const [amenities, setAmenities] = useState({
		wifi: false,
		pool: false,
		parking: false,
		gym: false,
	});

	const handlePriceChange = (event, newValue) => {
		setPriceRange(newValue);
	};

	const handleAmenityChange = (event) => {
		setAmenities({
			...amenities,
			[event.target.name]: event.target.checked,
		});
	};

	const applyFilters = () => {
		console.log("Filters applied:", { priceRange, amenities });
		// Add logic to apply filters
	};

	return (
		<Box sx={{ padding: 2, border: "1px solid #ddd", borderRadius: 2, backgroundColor: "#fff" }}>
			<Typography variant="h6" fontWeight="bold" gutterBottom>
				Filters
			</Typography>

			{/* Price Range Filter */}
			<Typography variant="body1" gutterBottom>
				Price Range
			</Typography>
			<Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={1000} />
			<Typography variant="body2">
				${priceRange[0]} - ${priceRange[1]}
			</Typography>

			{/* Amenities Filter */}
			<Typography variant="body1" gutterBottom sx={{ marginTop: 2 }}>
				Amenities
			</Typography>
			{Object.keys(amenities).map((amenity) => (
				<FormControlLabel
					key={amenity}
					control={<Checkbox checked={amenities[amenity]} onChange={handleAmenityChange} name={amenity} />}
					label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
				/>
			))}

			{/* Apply Filters Button */}
			<Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={applyFilters}>
				Apply Filters
			</Button>
		</Box>
	);
}

export default FilterBox;
