import * as React from "react";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function NavigationButtons({ activeTab, setActiveTab, tabLabels }) {
	const handlePreviousTab = () => {
		if (activeTab > 0) {
			setActiveTab(activeTab - 1);
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	const handleNextTab = () => {
		if (activeTab < tabLabels.length - 1) {
			setActiveTab(activeTab + 1);
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	};

	return (
		<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 4 }}>
			{activeTab > 0 ? (
				<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handlePreviousTab}>
					{tabLabels[activeTab - 1]}
				</Button>
			) : (
				<Box />
			)}
			{activeTab < tabLabels.length - 1 ? (
				<Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={handleNextTab}>
					{tabLabels[activeTab + 1]}
				</Button>
			) : (
				<Box />
			)}
		</Box>
	);
}

export default NavigationButtons;
