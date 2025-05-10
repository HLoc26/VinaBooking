// components/AppImage.jsx
import React, { useState } from "react";
import { getImageUrl } from "../../../utils/imageHelper";

function AppImage({ type, filename, alt = "", style = {} }) {
	const [error, setError] = useState(false);
	const imageUrl = getImageUrl({ type, filename: error ? "default.jpg" : filename });

	return <img src={imageUrl} alt={alt} style={style} onError={() => setError(true)} loading="lazy" />;
}

export default AppImage;
