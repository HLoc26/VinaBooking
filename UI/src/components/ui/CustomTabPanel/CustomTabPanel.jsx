import Box from "@mui/material/Box";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
			{value === index && <Box sx={{ p: 3, display: "flex", alignItems: "center", flexDirection: "column" }}>{children}</Box>}
		</div>
	);
}

export default CustomTabPanel;
