import * as React from "react";
import { Box, Stack } from "@mui/material";
import AppImage from "../../components/ui/Image/Image";

function ImageGallery({ images, selectedImage, setSelectedImage }) {
	return (
		<Box mt={3}>
			<Box>
				<AppImage type="accommodation" filename={images[selectedImage].filename} alt="Accommodation" style={{ width: "100%", maxHeight: 500, objectFit: "cover", borderRadius: 8 }} />
			</Box>
			<Stack direction="row" spacing={1} mt={1} sx={{ overflowX: "auto", py: 1 }}>
				{images.map((img, idx) => (
					<Box
						key={idx}
						onClick={() => setSelectedImage(idx)}
						sx={{
							border: selectedImage === idx ? "2px solid #1976d2" : "2px solid transparent",
							borderRadius: 1,
							cursor: "pointer",
							flex: "0 0 auto",
						}}
					>
						<AppImage
							type="accommodation"
							filename={img.filename}
							alt={`Thumb ${img.id}`}
							style={{
								width: 100,
								height: 70,
								objectFit: "cover",
								borderRadius: 4,
							}}
						/>
					</Box>
				))}
			</Stack>
		</Box>
	);
}

export default ImageGallery;
