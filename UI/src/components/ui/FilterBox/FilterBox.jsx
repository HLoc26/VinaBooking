import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Checkbox, FormControlLabel, Button, TextField, Stack } from "@mui/material";

function FilterBox({ results, onFilterChange }) {
	// Get min and max prices from results
	const minAvailablePrice = Math.min(...results.map((hotel) => hotel.minPrice));
	const maxAvailablePrice = Math.max(...results.map((hotel) => hotel.minPrice));

	const [priceRange, setPriceRange] = useState([minAvailablePrice || 0, maxAvailablePrice || 1000]);

	// Get unique amenities from all hotels by their ID
	const allAmenities = results.flatMap((hotel) => hotel.amenities);
	const uniqueAmenityIds = [...new Set(allAmenities.map((amenity) => amenity.id))];

	// Create a map of unique amenities by ID for easy access
	const amenityMap = allAmenities.reduce((map, amenity) => {
		if (!map[amenity.id]) {
			map[amenity.id] = amenity;
		}
		return map;
	}, {});

	// Initialize amenities state with IDs as keys
	const initialAmenities = Object.fromEntries(uniqueAmenityIds.map((id) => [id, false]));
	const [amenities, setAmenities] = useState(initialAmenities);

	// Update price range and amenities when results change
	useEffect(() => {
		setPriceRange([minAvailablePrice || 0, maxAvailablePrice || 1000]);

		// Reset amenities when results change
		const newAllAmenities = results.flatMap((hotel) => hotel.amenities);
		const newUniqueAmenityIds = [...new Set(newAllAmenities.map((amenity) => amenity.id))];
		const newInitialAmenities = Object.fromEntries(newUniqueAmenityIds.map((id) => [id, false]));
		setAmenities(newInitialAmenities);
	}, [results, minAvailablePrice, maxAvailablePrice]);

	const handlePriceChange = (event, newValue) => {
		setPriceRange(newValue);
	};

	const handlePriceInputChange = (index) => (event) => {
		const newValue = parseInt(event.target.value) || 0;
		const newPriceRange = [...priceRange];
		newPriceRange[index] = newValue;

		// Ensure min <= max
		if (index === 0 && newValue > priceRange[1]) {
			newPriceRange[1] = newValue;
		} else if (index === 1 && newValue < priceRange[0]) {
			newPriceRange[0] = newValue;
		}

		setPriceRange(newPriceRange);
	};

	const handleAmenityChange = (event) => {
		setAmenities({
			...amenities,
			[event.target.name]: event.target.checked,
		});
	};

	const applyFilters = () => {
		const filteredResults = results.filter((hotel) => {
			// Filter by price
			const meetsPrice = hotel.minPrice >= priceRange[0] && hotel.minPrice <= priceRange[1];

			// Filter by amenities
			const selectedAmenityIds = Object.entries(amenities)
				.filter(([, checked]) => checked)
				.map(([id]) => parseInt(id)); // Convert string keys back to numbers

			// Changed from every() to some() to implement OR logic
			// Check if the hotel has any of the selected amenities
			const meetsAmenities = selectedAmenityIds.length === 0 || selectedAmenityIds.some((amenityId) => hotel.amenities.some((amenity) => amenity.id === amenityId));

			return meetsPrice && meetsAmenities;
		});

		onFilterChange(filteredResults);
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
			<Stack spacing={2}>
				<Stack direction="row" spacing={2}>
					<TextField label="Min Price" type="number" value={priceRange[0]} onChange={handlePriceInputChange(0)} size="small" InputProps={{ inputProps: { min: 0 } }} />
					<TextField label="Max Price" type="number" value={priceRange[1]} onChange={handlePriceInputChange(1)} size="small" InputProps={{ inputProps: { min: 0 } }} />
				</Stack>
				<Slider value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" min={minAvailablePrice || 0} max={maxAvailablePrice || 1000} />
			</Stack>

			{/* Amenities Filter */}
			{uniqueAmenityIds.length > 0 && (
				<>
					<Typography variant="body1" gutterBottom sx={{ marginTop: 2 }}>
						Amenities
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						{uniqueAmenityIds.map((id) => (
							<FormControlLabel
								key={id}
								control={<Checkbox checked={amenities[id]} onChange={handleAmenityChange} name={id.toString()} />}
								label={amenityMap[id].name.charAt(0).toUpperCase() + amenityMap[id].name.slice(1)}
							/>
						))}
					</Box>
				</>
			)}

			{/* Apply Filters Button */}
			<Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={applyFilters}>
				Apply Filters
			</Button>
		</Box>
	);
}

export default FilterBox;
