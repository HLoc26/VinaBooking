import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	ids: [], // lưu danh sách id các accommodation được đánh dấu yêu thích
};

const favoritesSlice = createSlice({
	name: "favorites",
	initialState,
	reducers: {
		toggleFavorite: (state, action) => {
			const id = action.payload;
			if (state.ids.includes(id)) {
				// Nếu đã có, thì bỏ yêu thích
				state.ids = state.ids.filter((favId) => favId !== id);
			} else {
				// Nếu chưa có, thì thêm vào
				state.ids.push(id);
			}
		},
	},
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
