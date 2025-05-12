import { useState } from "react";
import { IconButton, Tooltip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite } from "../../../features/favourite/favoritesSlice";
import { useNavigate } from "react-router-dom";

const FavoriteButton = ({ accommodation, onRemove, ...props }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const favList = useSelector((state) => state.favourites.accomms);
	const isLoadingGlobal = useSelector((state) => state.favourites.loading);
	const isFavourite = favList.some((a) => a.id === accommodation.id);

	const { isLoggedIn } = useSelector((state) => state.auth);

	const [openLoginModal, setOpenLoginModal] = useState(false);

	const handleClick = () => {
		console.log(isLoggedIn);
		if (!isLoggedIn) {
			setOpenLoginModal(true);
			return;
		}
		if (isLoadingGlobal) return;

		if (isFavourite) {
			dispatch(removeFavourite(accommodation));
			onRemove?.(); // optional chaining
		} else {
			dispatch(addFavourite(accommodation));
		}
	};

	const handleCloseModal = () => {
		setOpenLoginModal(false);
	};

	return (
		<>
			<Tooltip title={isFavourite ? "Remove from favorites" : "Add to favorites"} placement="top">
				<span>
					<IconButton onClick={handleClick} disabled={isLoadingGlobal} color={isFavourite ? "secondary" : "default"} {...props}>
						{isLoadingGlobal ? <CircularProgress size={24} /> : isFavourite ? <Favorite /> : <FavoriteBorder />}
					</IconButton>
				</span>
			</Tooltip>

			<Dialog open={openLoginModal} onClose={handleCloseModal}>
				<DialogTitle>Login Required</DialogTitle>
				<DialogContent>
					<DialogContentText>You need to be logged in to add this accommodation to your favorites.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button onClick={() => navigate("/login", { state: { from: location.pathname + location.search } })} variant="contained" color="primary">
						Login
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default FavoriteButton;
