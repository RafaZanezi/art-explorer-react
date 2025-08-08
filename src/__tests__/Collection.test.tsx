import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Collection from '../components/Collection';
import { fetchCollections, fetchObjectDetails } from '../api/api';

jest.mock('../api/api');
const mockedFetchCollections = fetchCollections as jest.MockedFunction<typeof fetchCollections>;
const mockedFetchObjectDetails = fetchObjectDetails as jest.MockedFunction<typeof fetchObjectDetails>;

jest.mock('../components/CardCollection', () => {
    return function MockCardCollection({ item, toggleFavorite, favorites, handleModalOpen }: any) {
        return (
            <div data-testid={`card-${item.objectID}`}>
                <span>{item.title}</span>
                <button onClick={() => toggleFavorite(item.objectID)}>
                    {favorites[item.objectID] ? 'Remove from favorites' : 'Add to favorites'}
                </button>
                <button onClick={() => handleModalOpen(item)}>View details</button>
            </div>
        );
    };
});

jest.mock('../components/Details', () => {
    return function MockDetails({ isOpen, onClose, children }: any) {
        return isOpen ? (
            <div data-testid="details-modal">
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        ) : null;
    };
});

jest.mock('../components/FavoritesDrawer', () => {
    return function MockFavoritesDrawer({ open, toggleDrawer, favorites }: any) {
        return open ? (
            <div data-testid="favorites-drawer">
                <button onClick={() => toggleDrawer(false)}>Close drawer</button>
                {Object.entries(favorites || {})
                    .filter(([key, value]) => value === true)
                    .map(([objectID]) => (
                        <div key={`favorite-${objectID}`}>
                            Favorite Item {objectID}
                        </div>
                    ))
                }
            </div>
        ) : null;
    };
});

jest.mock('../components/SearchInputs', () => {
    return function MockSearchInputs({ handleDeptChange, handleArtistChange }: any) {
        return (
            <div>
                <button onClick={() => handleDeptChange('1')}>Search by department</button>
                <button onClick={() => handleArtistChange('Picasso')}>Search by artist</button>
            </div>
        );
    };
});

const mockObjectData = {
    objectID: 1,
    title: 'Test Artwork',
    artist: 'Test Artist',
    department: 'Test Department'
};

const mockCollectionData = {
    objectIDs: [1]
};

describe('Collection Component', () => {
    beforeEach(() => {
        mockedFetchCollections.mockResolvedValue(mockCollectionData);
        mockedFetchObjectDetails.mockResolvedValue(mockObjectData);
        localStorage.clear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        render(<Collection />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders collection data after loading', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Test Artwork')).toBeInTheDocument();
    });

    it('displays error message when API fails', async () => {
        mockedFetchCollections.mockRejectedValue(new Error('API Error'));
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByText(/Erro ao buscar coleções/)).toBeInTheDocument();
        });
    });

    it('opens favorites drawer when favorites button is clicked', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const favoritesButton = screen.getByLabelText('add to favorites');
        fireEvent.click(favoritesButton);
        
        expect(screen.getByTestId('favorites-drawer')).toBeInTheDocument();
    });

    it('toggles favorite status for an item', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const favoriteButton = screen.getByText('Add to favorites');
        fireEvent.click(favoriteButton);
        
        expect(localStorage.getItem('favorite-1')).toBe('true');
        expect(screen.getByText('Remove from favorites')).toBeInTheDocument();
    });

    it('opens modal when view details is clicked', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const detailsButton = screen.getByText('View details');
        fireEvent.click(detailsButton);
        
        expect(screen.getByTestId('details-modal')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const detailsButton = screen.getByText('View details');
        fireEvent.click(detailsButton);
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(screen.queryByTestId('details-modal')).not.toBeInTheDocument();
    });

    it('filters by department when search is triggered', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const deptSearchButton = screen.getByText('Search by department');
        fireEvent.click(deptSearchButton);
        
        await waitFor(() => {
            expect(mockedFetchCollections).toHaveBeenCalledWith({
                filters: { departmentId: '1' }
            });
        });
    });

    it('filters by artist when search is triggered', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const artistSearchButton = screen.getByText('Search by artist');
        fireEvent.click(artistSearchButton);
        
        await waitFor(() => {
            expect(mockedFetchCollections).toHaveBeenCalledWith({
                filters: { artist: 'Picasso' }
            });
        });
    });

    it('handles pagination correctly', async () => {
        const largeMockData = {
            objectIDs: Array.from({ length: 30 }, (_, i) => i + 1)
        };
        
        mockedFetchCollections.mockResolvedValue(largeMockData);
        mockedFetchObjectDetails.mockImplementation((id) => 
            Promise.resolve({ objectID: id, title: `Art ${id}`, artist: `Artist ${id}` })
        );
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });
        
        const pagination = screen.getByRole('navigation');
        expect(pagination).toBeInTheDocument();
    });

    it('loads favorites from localStorage on mount', async () => {
        localStorage.setItem('favorite-1', 'true');
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        await waitFor(() => {
            expect(screen.getByText('Remove from favorites')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('displays empty state when no data is available', async () => {
        mockedFetchCollections.mockResolvedValue({ objectIDs: [] });
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
        
        expect(screen.queryByTestId(/card-/)).not.toBeInTheDocument();
    });

    it('renders pagination with correct page count for large datasets', async () => {
        const largeMockData = { objectIDs: Array.from({ length: 45 }, (_, i) => i + 1) };
        mockedFetchCollections.mockResolvedValue(largeMockData);
        mockedFetchObjectDetails.mockImplementation((id) => 
            Promise.resolve({ objectID: id, title: `Art ${id}`, artist: `Artist ${id}` })
        );
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
        
        expect(screen.getByText('3')).toBeInTheDocument(); // 45 items / 15 per page = 3 pages
    });

    it('changes page when pagination is clicked', async () => {
        const largeMockData = { objectIDs: Array.from({ length: 30 }, (_, i) => i + 1) };
        mockedFetchCollections.mockResolvedValue(largeMockData);
        mockedFetchObjectDetails.mockImplementation((id) => 
            Promise.resolve({ objectID: id, title: `Art ${id}`, artist: `Artist ${id}` })
        );
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
        
        const page2Button = screen.getByText('2');
        fireEvent.click(page2Button);
        
        expect(mockedFetchObjectDetails).toHaveBeenCalledTimes(30);
    });

    it('closes favorites drawer when close button is clicked', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const favoritesButton = screen.getByLabelText('add to favorites');
        fireEvent.click(favoritesButton);
        
        const closeDrawerButton = screen.getByText('Close drawer');
        fireEvent.click(closeDrawerButton);
        
        expect(screen.queryByTestId('favorites-drawer')).not.toBeInTheDocument();
    });

    it('handles empty favorites list in drawer', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const favoritesButton = screen.getByLabelText('add to favorites');
        fireEvent.click(favoritesButton);
        
        const drawer = screen.getByTestId('favorites-drawer');
        expect(drawer).toBeInTheDocument();
        expect(drawer.children).toHaveLength(1); 
    });

    it('persists favorites across component re-renders', async () => {
        localStorage.setItem('favorite-1', 'true');
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        await waitFor(() => {
            expect(screen.getByText('Remove from favorites')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('handles multiple favorites correctly', async () => {
        const multiMockData = { objectIDs: [1, 2, 3] };
        const mockDetails = [
            { objectID: 1, title: 'Art 1', artist: 'Artist 1' },
            { objectID: 2, title: 'Art 2', artist: 'Artist 2' },
            { objectID: 3, title: 'Art 3', artist: 'Artist 3' }
        ];
        
        mockedFetchCollections.mockResolvedValue(multiMockData);
        mockedFetchObjectDetails.mockImplementation((id) => 
            Promise.resolve(mockDetails.find(item => item.objectID === id))
        );
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getAllByTestId(/card-/)).toHaveLength(3);
        });
        
        const favoriteButtons = screen.getAllByText('Add to favorites');
        fireEvent.click(favoriteButtons[0]);
        fireEvent.click(favoriteButtons[1]);
        
        expect(localStorage.getItem('favorite-1')).toBe('true');
        expect(localStorage.getItem('favorite-2')).toBe('true');
    });

    it('renders tooltip correctly on favorites button', async () => {
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        const tooltipButton = screen.getByLabelText('add to favorites');
        expect(tooltipButton).toBeInTheDocument();
        
        expect(tooltipButton).toHaveAttribute('aria-label', 'add to favorites');
    });

    it('handles rapid pagination clicks', async () => {
        const largeMockData = { objectIDs: Array.from({ length: 60 }, (_, i) => i + 1) };
        mockedFetchCollections.mockResolvedValue(largeMockData);
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
        
        const page2Button = screen.getByText('2');
        const page3Button = screen.getByText('3');
        
        fireEvent.click(page2Button);
        fireEvent.click(page3Button);
        
        await waitFor(() => {
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });

    it('preserves favorites when component unmounts and remounts', async () => {
        localStorage.setItem('favorite-1', 'true');
        localStorage.setItem('favorite-2', 'true');
        
        const { unmount } = render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        await waitFor(() => {
            expect(screen.getByText('Remove from favorites')).toBeInTheDocument();
        });
        
        unmount();
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByTestId('card-1')).toBeInTheDocument();
        });
        
        await waitFor(() => {
            expect(screen.getByText('Remove from favorites')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    it('calculates pagination count correctly with different page sizes', async () => {
        const mockData = { objectIDs: Array.from({ length: 23 }, (_, i) => i + 1) };
        mockedFetchCollections.mockResolvedValue(mockData);
        
        render(<Collection />);
        
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument();
        });
        
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.queryByText('3')).not.toBeInTheDocument();
    });
});