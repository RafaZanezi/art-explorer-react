import AppBar from "@mui/material/AppBar"
import Dialog from "@mui/material/Dialog"
import Link from "@mui/material/Link"
import Slide from "@mui/material/Slide"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"
import "../components/Details.css"
import { CollectionObject } from "../models/CollectionObject"

interface DetailsProps {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
    details?: CollectionObject;
}

const Details = ({ isOpen, onClose, children, details }: DetailsProps) => {
    if (!isOpen) return null;

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={onClose}
            slots={{ transition: Slide }}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    {children}
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {details ? details.title : "Details"}
                    </Typography>
                </Toolbar>
            </AppBar>

            <div className="container-details">
                <img className="banner" src={
                    details?.primaryImage || details?.primaryImageSmall || "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"
                } alt={details?.title ?? "Details"} />

            </div>
                <div className="details">
                    <Typography variant="body1">
                        {`${details?.title || "No title available"}`}
                    </Typography>
                    <Typography variant="body1">
                        {`${details?.artistDisplayName || "Unknown artist"}`}
                    </Typography>
                    <Typography variant="body1">
                        {`(${details?.objectBeginDate} - ${details?.objectEndDate})`}
                    </Typography>
                    <Typography variant="body1">
                        {`${details?.medium}`}
                    </Typography>
                    <Typography variant="body1">
                        {`Department: ${details?.department || "Unknown department"}`}
                    </Typography>
                    <Link href={details?.objectWikidata_URL} color="inherit" target="_blank">
                        View more
                    </Link>
                </div>
        </Dialog>
    )
}

export default Details;