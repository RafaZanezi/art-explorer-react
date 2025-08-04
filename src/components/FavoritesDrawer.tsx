import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { CollectionObject } from '../models/CollectionObject';
import CardCollection from './CardCollection';
import { Box } from '@mui/system';

type FavoriteDrawerProps = {
  favorites: CollectionObject[];
  open: boolean;
  toggleDrawer: (open: boolean) => void;
};

const FavoritesDrawer = ({ favorites, open, toggleDrawer }: FavoriteDrawerProps) => {
  return (
    <Drawer
      slotProps={{
        paper: {
          sx: {
            padding: 2,
            gap: 2,
            width: 300,
            overflowY: 'auto',
          },
        },
      }}
      open={open}
      onClose={() => toggleDrawer(false)}
    >
      <Box
        sx={{
          width: 320,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h5">
          My Favorites
        </Typography>

        {favorites.map((item) => (
          <CardCollection
            key={item.objectID}
            item={item}
          />
        ))}
      </Box>
    </Drawer>
  );
};

export default FavoritesDrawer;