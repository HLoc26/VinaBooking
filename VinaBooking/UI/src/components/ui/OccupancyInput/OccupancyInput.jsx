import * as React from "react";
import { Box, Typography, Button, Menu, MenuItem, IconButton, Divider } from "@mui/material";
import * as Icon from "@mui/icons-material";
//  { Add, Remove, Group, ChildCare, MeetingRoom }

function OccupancyInput({ value = { adults: 1, children: 0, rooms: 1 }, onChange }) {
	const [inputValue, setInputValue] = React.useState(value);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleIncrement = (field) => {
		setInputValue((prev) => {
			const updatedValue = { ...prev, [field]: Math.min(prev[field] + 1, 30) };
			onChange && onChange(updatedValue);
			return updatedValue;
		});
	};

	const handleDecrement = (field) => {
		setInputValue((prev) => {
			const updatedValue = { ...prev, [field]: Math.max(0, prev[field] - 1) };
			onChange && onChange(updatedValue);
			return updatedValue;
		});
	};

	return (
		<>
			<Button
				id="occupancy-button"
				aria-controls={open ? "occupancy-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				variant="outlined"
				sx={{
					borderRadius: 3,
					padding: "8px 16px",
					textTransform: "none",
					fontSize: "1rem",
					fontWeight: 500,
					display: "flex",
					alignItems: "center",
					justifyContent: "start",
					gap: 1,
				}}
			>
				<Icon.CoPresent />
				{`${inputValue.adults} Adults, ${inputValue.children} Children, ${inputValue.rooms} Rooms`}
			</Button>
			<Menu id="occupancy-menu" anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ mt: 1 }}>
				{["adults", "children", "rooms"].map((field, index) => (
					<div key={field}>
						<MenuItem disableRipple disableTouchRipple sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, px: 3 }}>
							{field == "adults" && <Icon.Group />}
							{field == "children" && <Icon.ChildCare />}
							{field == "rooms" && <Icon.MeetingRoom />}
							<Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Typography>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 5 }}>
								<IconButton onClick={() => handleDecrement(field)} size="small" sx={{ borderRadius: "50%" }}>
									<Icon.Remove />
								</IconButton>
								<Typography sx={{ minWidth: 20, textAlign: "center" }}>{inputValue[field]}</Typography>
								<IconButton onClick={() => handleIncrement(field)} size="small" sx={{ borderRadius: "50%" }}>
									<Icon.Add />
								</IconButton>
							</Box>
						</MenuItem>
						{index < 2 && <Divider />}
					</div>
				))}
				<MenuItem>
					<Button onClick={handleClose} fullWidth variant="contained" color="primary" sx={{ borderRadius: 3 }}>
						Done
					</Button>
				</MenuItem>
			</Menu>
		</>
	);
}

export default OccupancyInput;
