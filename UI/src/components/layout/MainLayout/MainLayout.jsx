import { Box } from "@mui/material";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
function MainLayout({ children }) {
	return (
		<Box>
			<Navbar />

			<Box>{children}</Box>

			{/* Footer */}
			<Box sx={{ marginTop: 6 }}>
				<Footer />
			</Box>
		</Box>
	);
}

export default MainLayout;
