import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CollectionObject } from '../models/CollectionObject';
import FavoriteButton from './FavoriteButton';

type CardCollectionProps = {
    item: CollectionObject;
    toggleFavorite?: (objectID: number | string) => void;
    favorites?: { [key: number]: boolean };
    handleModalOpen?: (item: CollectionObject) => void;
};

const CardCollection = ({ item, toggleFavorite, favorites, handleModalOpen }: CardCollectionProps) => {
    return (
        <Card key={item.objectID} sx={{ width: 300 }}>
            <CardMedia
                sx={{ height: 150 }}
                image={item.primaryImage || item.primaryImageSmall || "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"}
                title={item.title || "Untitled"}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {item.title || "Untitled"}
                </Typography>

            </CardContent>
            {toggleFavorite && handleModalOpen && favorites &&
                <CardActions>
                    <FavoriteButton
                        objectID={item.objectID}
                        isFavorite={favorites[item.objectID] || false}
                        toggleFavorite={toggleFavorite}
                    />
                    <IconButton aria-label="more info" onClick={() => handleModalOpen(item)}>
                        <AddIcon />
                    </IconButton>
                </CardActions>
            }
        </Card>
    );
}

export default CardCollection;