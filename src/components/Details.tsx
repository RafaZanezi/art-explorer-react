import AppBar from "@mui/material/AppBar"
import Dialog from "@mui/material/Dialog"
import Slide from "@mui/material/Slide"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"
import { CollectionObject } from "../models/CollectionObject"
import "../components/Details.css"

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
            <img className="banner" src={details ? details.primaryImage : ""} alt={details ? details.title : "Details"} />
            
        
        </Dialog>
    )
}

export default Details;