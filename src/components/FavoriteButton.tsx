import { pink } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";

type FavoriteButtonProps = {
    objectID: number | string;
    isFavorite: boolean;
    toggleFavorite: (objectID: number | string) => void;
};

const FavoriteButton = ({ objectID, isFavorite, toggleFavorite }: FavoriteButtonProps) => {
    return (
        <IconButton onClick={() => toggleFavorite(objectID)} aria-label="add to favorites">
            {isFavorite ? (
                <FavoriteIcon sx={{ color: pink[500] }} />
            ) : (
                <FavoriteIcon />
            )}
        </IconButton>
    );
}

export default FavoriteButton;