// utils/imageHelper.js
export function getImageUrl({ type = "room", filename = "default.jpg", basePath = `${import.meta.env.VITE_STATIC_PATH}/uploads` }) {
	return `${basePath}/${type}/${filename}`;
}
