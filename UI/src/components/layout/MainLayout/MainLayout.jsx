import { Box } from "@mui/material";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
function MainLayout({ children }) {
	return (		<Box
			sx={{
				backgroundImage: "url('/images/vietnam-background.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundAttachment: "fixed",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Navbar />

			<Box sx={{ 
				backgroundColor: "rgba(255, 255, 255, 0.85)",
				flexGrow: 1,
				margin: "0 auto", 
				padding: 2,
				width: "100%",
				maxWidth: "1200px",
				minHeight: "calc(100vh - 64px - 200px)" // Navbar height and footer approximate height
			}}>
				{children}
			</Box>

			{/* Footer */}
			<Box sx={{ marginTop: 6 }}>
				<Footer />
			</Box>
		</Box>
	);
}

export default MainLayout;
