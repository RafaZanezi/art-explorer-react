import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { fetchDepartments } from "../api/api";
import { Department } from "../models/Departments";
import "../components/SearchInputs.css";
import Button from "@mui/material/Button";

type SearchInputsProps = {
    handleDeptChange: (deptId: string) => void;
    handleArtistChange: (artist: string) => void;
};

const SearchInputs = ({ handleDeptChange, handleArtistChange }: SearchInputsProps) => {
    const [artist, setArtist] = useState<string>("");
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const departments = await fetchDepartments();
                setDepartments(departments.departments);
            } catch (error) {
                console.error("Erro ao buscar departamentos:", error);
            }
        };

        loadDepartments();
    }, []);

    return (
        <div className="search-inputs">
            <TextField className="text-field" label="Artist or Culture" variant="outlined" onChange={
                (event) => {
                    const newInputValue = event.target.value;
                    setArtist(newInputValue || '');
                }
            } />
            <Button variant="contained" onClick={() => handleArtistChange(artist)}>
                Search
            </Button>

            <Autocomplete
                disablePortal
                options={departments.map((dept) => dept.displayName)}
                onChange={(_event, value: string | null) => {
                    const selectedDept = departments.find(dept => dept.displayName === value)?.departmentId;
                    handleDeptChange(selectedDept || '');
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Department" />}
            />
        </div>
    )
}

export default SearchInputs;