import { render, screen, fireEvent } from "@testing-library/react";
import Details from "../components/Details";
import { CollectionObject } from "../models/CollectionObject";

const mockDetails: CollectionObject = {
    title: "Mona Lisa",
    artistDisplayName: "Leonardo da Vinci",
    objectBeginDate: 1503,
    objectEndDate: 1506,
    medium: "Oil on poplar",
    department: "Paintings",
    primaryImage: "https://example.com/monalisa.jpg",
    primaryImageSmall: "https://example.com/monalisa-small.jpg",
    objectWikidata_URL: "https://www.wikidata.org/wiki/Q12418",
    objectID: 0,
    additionalImages: [],
    constituents: [],
    artistDisplayBio: ""
};

describe("Details component", () => {
    it("renders nothing when isOpen is false", () => {
        const { container } = render(<Details isOpen={false} onClose={() => {}} />);
        expect(container.firstChild).toBeNull();
    });

    it("renders dialog when isOpen is true", () => {
        render(<Details isOpen={true} onClose={() => {}} />);
        expect(screen.getByText("Details")).toBeInTheDocument();
    });

    it("renders details data correctly", () => {
        render(<Details isOpen={true} onClose={() => {}} details={mockDetails} />);
        
        const titleElements = screen.getAllByText(mockDetails.title);
        expect(titleElements.length).toBeGreaterThan(0);
        
        expect(screen.getByText(mockDetails.artistDisplayName)).toBeInTheDocument();
        expect(screen.getByText(`(${mockDetails.objectBeginDate} - ${mockDetails.objectEndDate})`)).toBeInTheDocument();
        expect(screen.getByText(mockDetails.medium)).toBeInTheDocument();
        expect(screen.getByText(`Department: ${mockDetails.department}`)).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("src", mockDetails.primaryImage);
        expect(screen.getByRole("link", { name: /view more/i })).toHaveAttribute("href", mockDetails.objectWikidata_URL);
    });

    it("renders fallback image if no image is provided", () => {
        const detailsNoImage = { ...mockDetails, primaryImage: "", primaryImageSmall: "" };
        render(<Details isOpen={true} onClose={() => {}} details={detailsNoImage} />);
        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            expect.stringContaining("no-image-available-icon")
        );
    });

    it("calls onClose when dialog is closed", () => {
        const onClose = jest.fn();
        render(<Details isOpen={true} onClose={onClose} details={mockDetails} />);
        
        const dialog = screen.getByRole('dialog');
        fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27 });
        
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("renders children inside the Toolbar", () => {
        render(
            <Details isOpen={true} onClose={() => {}}>
                <span data-testid="custom-child">Child</span>
            </Details>
        );
        expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("renders default values when details is undefined", () => {
        render(<Details isOpen={true} onClose={() => {}} />);
        expect(screen.getByText("Details")).toBeInTheDocument();
        expect(screen.getByText("No title available")).toBeInTheDocument();
        expect(screen.getByText("Unknown artist")).toBeInTheDocument();
        expect(screen.getByText("(undefined - undefined)")).toBeInTheDocument();
        expect(screen.getByText("Department: Unknown department")).toBeInTheDocument();
    });
});