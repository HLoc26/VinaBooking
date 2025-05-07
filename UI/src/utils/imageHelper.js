// utils/imageHelper.js
export function getImageUrl({ type = "room", filename = "default.jpg", basePath = "/uploads" }) {
	return `${basePath}/${type}/${filename}`;
}
