import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";
import { fetchCollections, fetchObjectDetails } from "../api/api";
import "../components/Collection.css";
import { CollectionObject } from "../models/CollectionObject";
import SearchInputs from "./SearchInputs";

const Collection = () => {
  const [data, setData] = useState<{ objectIDs: number[] }>();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const [paginatedData, setPaginatedData] = useState<CollectionObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setData(undefined);
    setPaginatedData([]);
    setLoading(true);

    const loadData = async () => {
      try {
        const result = await fetchCollections({ filters });
        setData(result);
      } catch (error) {
        setError("Erro ao buscar coleções: " + error);
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  useMemo(() => {
    const loadDetails = async () => {
      try {
        if (data) {
          const collection = data.objectIDs.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

          if (collection?.length) {
            const objectDetailsPromises = collection.map((item: any) => fetchObjectDetails(item));
            setPaginatedData(await Promise.all(objectDetailsPromises));
            return;
          }

          setPaginatedData([]);
        }
      } catch (error) {
        setError("Erro ao buscar detalhes dos objetos: " + error);
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [data, pageNumber]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setLoading(true);
    setPageNumber(value);
  };

  return (
    <>
      <SearchInputs
        handleDeptChange={(departmentId) => {
          setLoading(true);
          setFilters({ departmentId });
        }}
        handleArtistChange={(artist) => {
          setLoading(true);
          setFilters({ artist });
        }} />

      {paginatedData && (
        <div className="collection-container">
          {loading && <CircularProgress />}

          {paginatedData?.map(item => {
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
                <CardActions>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="more info">
                    <AddIcon />
                  </IconButton>
                </CardActions>
              </Card>
            )
          })}

          <Pagination
            count={data?.objectIDs ? Math.ceil(data.objectIDs.length / pageSize) : 0}
            page={pageNumber}
            onChange={handleChange}
          />
        </div>
      )}
    </>
  );
}

export default Collection;