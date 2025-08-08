import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchInputs from "../components/SearchInputs";
import { fetchDepartments } from "../api/api";
import { Department } from "../models/Departments";

jest.mock("../api/api", () => ({
    fetchDepartments: jest.fn(),
}));

const mockDepartments: { departments: Department[] } = {
    departments: [
        { departmentId: "1", displayName: "Paintings" },
        { departmentId: "2", displayName: "Sculptures" },
    ],
};

describe("SearchInputs", () => {
    beforeEach(() => {
        (fetchDepartments as jest.Mock).mockResolvedValue(mockDepartments);
    });

    it("renders artist input and department autocomplete", async () => {
        render(
            <SearchInputs handleDeptChange={jest.fn()} handleArtistChange={jest.fn()} />
        );
        expect(screen.getByLabelText(/Artist or Culture/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
        await waitFor(() => {
            expect(fetchDepartments).toHaveBeenCalled();
        });
    });

    it("calls handleArtistChange with correct value when Search button is clicked", async () => {
        const handleArtistChange = jest.fn();
        render(
            <SearchInputs handleDeptChange={jest.fn()} handleArtistChange={handleArtistChange} />
        );
        const input = screen.getByLabelText(/Artist or Culture/i);
        fireEvent.change(input, { target: { value: "Picasso" } });
        fireEvent.click(screen.getByRole("button", { name: /Search/i }));
        expect(handleArtistChange).toHaveBeenCalledWith("Picasso");
    });

    it("calls handleDeptChange with correct departmentId when department is selected", async () => {
        const handleDeptChange = jest.fn();
        render(
            <SearchInputs handleDeptChange={handleDeptChange} handleArtistChange={jest.fn()} />
        );
        await waitFor(() => {
            expect(fetchDepartments).toHaveBeenCalled();
        });
        const autocomplete = screen.getByLabelText(/Department/i);
        fireEvent.change(autocomplete, { target: { value: "Paintings" } });
        fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
        fireEvent.keyDown(autocomplete, { key: "Enter" });
        await waitFor(() => {
            expect(handleDeptChange).toHaveBeenCalledWith("1");
        });
    });

    it("handles empty department selection gracefully", async () => {
        const handleDeptChange = jest.fn();
        render(
            <SearchInputs handleDeptChange={handleDeptChange} handleArtistChange={jest.fn()} />
        );
        await waitFor(() => {
            expect(fetchDepartments).toHaveBeenCalled();
        });
        
        const autocomplete = screen.getByLabelText(/Department/i);
        
        fireEvent.change(autocomplete, { target: { value: "Paintings" } });
        fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
        fireEvent.keyDown(autocomplete, { key: "Enter" });
        
        fireEvent.change(autocomplete, { target: { value: "" } });
        fireEvent.keyDown(autocomplete, { key: "Escape" }); // Clear the autocomplete
        
        await waitFor(() => {
            expect(handleDeptChange).toHaveBeenCalledWith("");
        });
    });

    it("shows error in console if fetchDepartments fails", async () => {
        (fetchDepartments as jest.Mock).mockRejectedValue(new Error("API error"));
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        render(
            <SearchInputs handleDeptChange={jest.fn()} handleArtistChange={jest.fn()} />
        );
        await waitFor(() => {
            expect(errorSpy).toHaveBeenCalledWith(
                "Erro ao buscar departamentos:",
                expect.any(Error)
            );
        });
        errorSpy.mockRestore();
    });
});