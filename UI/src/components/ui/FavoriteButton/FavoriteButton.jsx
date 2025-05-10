import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite } from "../../../features/favourite/favoritesSlice";

const FavoriteButton = ({ accommodation, onRemove, ...props }) => {
	const dispatch = useDispatch();

	const favList = useSelector((state) => state.favourites.accomms);
	const isLoadingGlobal = useSelector((state) => state.favourites.loading);

	const isFavourite = favList.some((a) => a.id === accommodation.id);

	const handleClick = () => {
		if (isLoadingGlobal) return;
		if (isFavourite) {
			dispatch(removeFavourite(accommodation));
			onRemove();
		} else {
			dispatch(addFavourite(accommodation));
		}
	};

	return (
		<Tooltip title={isFavourite ? "Remove from favorites" : "Add to favorites"} placement="top">
			<span>
				<IconButton onClick={handleClick} disabled={isLoadingGlobal} color={isFavourite ? "secondary" : "default"} {...props}>
					{isLoadingGlobal ? <CircularProgress size={24} /> : isFavourite ? <Favorite /> : <FavoriteBorder />}
				</IconButton>
			</span>
		</Tooltip>
	);
};

export default FavoriteButton;
