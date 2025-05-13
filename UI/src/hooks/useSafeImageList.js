export const useSafeImageList = (images) => {
	return Array.isArray(images) && images.length > 0 ? images : [{ filename: "" }];
};
