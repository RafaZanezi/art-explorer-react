import { render, screen, fireEvent } from "@testing-library/react";
import FavoriteButton from "../components/FavoriteButton";

describe("FavoriteButton", () => {
    const mockToggleFavorite = jest.fn();
    const objectID = 123;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders FavoriteIcon with pink color when isFavorite is true", () => {
        render(
            <FavoriteButton
                objectID={objectID}
                isFavorite={true}
                toggleFavorite={mockToggleFavorite}
            />
        );
        const icon = screen.getByLabelText("add to favorites").querySelector("svg");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("data-testid", "FavoriteIcon");
    });

    it("renders FavoriteIcon without pink color when isFavorite is false", () => {
        render(
            <FavoriteButton
                objectID={objectID}
                isFavorite={false}
                toggleFavorite={mockToggleFavorite}
            />
        );
        const icon = screen.getByLabelText("add to favorites").querySelector("svg");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("data-testid", "FavoriteIcon");
    });

    it("calls toggleFavorite with objectID when clicked", () => {
        render(
            <FavoriteButton
                objectID={objectID}
                isFavorite={false}
                toggleFavorite={mockToggleFavorite}
            />
        );
        const button = screen.getByLabelText("add to favorites");
        fireEvent.click(button);
        expect(mockToggleFavorite).toHaveBeenCalledWith(objectID);
    });

    it("renders correctly with string objectID", () => {
        render(
            <FavoriteButton
                objectID="abc"
                isFavorite={false}
                toggleFavorite={mockToggleFavorite}
            />
        );
        const button = screen.getByLabelText("add to favorites");
        fireEvent.click(button);
        expect(mockToggleFavorite).toHaveBeenCalledWith("abc");
    });
});