import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";

function TabsBar({ activeTab, setActiveTab, tabLabels }) {
	const handleChangeTab = (e, newValue) => {
		setActiveTab(newValue);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`,
		};
	}

	return (
		<Box sx={{ position: "sticky", top: 64, borderBottom: 1, borderColor: "divider", backgroundColor: "white", zIndex: 1001, paddingTop: 2 }}>
			<Tabs value={activeTab} onChange={handleChangeTab}>
				{tabLabels.map((label, index) => (
					<Tab key={index} label={label} {...a11yProps(index)} />
				))}
			</Tabs>
		</Box>
	);
}

export default TabsBar;
