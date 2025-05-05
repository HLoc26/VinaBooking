import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../app/axios";
import HotelCard from "../../components/ui/HotelCard/HotelCard";

function Search() {
	const [searchResults, setSearchResults] = useState([]);
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const fetchSearchResults = async () => {
			const query = searchParams.toString();
			const response = await axiosInstance.get(`/accommodations/search?${query}`);
			if (response.data.success) {
				console.log(response.data.payload);
				setSearchResults(response.data.payload);
			} else {
				console.error(response.data.error);
			}
		};

		fetchSearchResults();
	}, [searchParams]);

	return (
		<Box>
			<Container sx={{ marginTop: 4 }}>
				<Typography variant="h4" fontWeight="bold" gutterBottom>
					Search Results
				</Typography>
				{searchResults.length > 0 ? (
					<Grid container spacing={3}>
						{searchResults.map((result, index) => (
							<Grid key={index} item xs={12} md={6}>
								<HotelCard name={result.name} amenities={result.amenities} location={result.address} minPrice={result.minPrice} rating={result.rating} />
							</Grid>
						))}
					</Grid>
				) : (
					<Typography variant="body1" color="text.secondary">
						No results found. Please try a different search.
					</Typography>
				)}
			</Container>
		</Box>
	);
}

export default Search;
