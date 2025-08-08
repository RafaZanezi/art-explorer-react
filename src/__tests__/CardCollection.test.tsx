import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardCollection from '../components/CardCollection';
import { CollectionObject } from '../models/CollectionObject';

const mockItem: CollectionObject = {
    objectID: 1,
    title: 'Test Art',
    primaryImage: 'test-image.jpg',
    primaryImageSmall: 'test-image-small.jpg',
    additionalImages: [],
    constituents: [],
    artistDisplayName: 'Test Artist',
    artistDisplayBio: 'Test Bio',
    objectBeginDate: 2000,
    objectEndDate: 2020,
    medium: 'Oil on canvas',
    department: 'European Paintings',
    objectWikidata_URL: 'https://test.url'
};

describe('CardCollection', () => {
    it('renders with default image and title when no image or title is provided', () => {
        const item = { ...mockItem, title: '', primaryImage: '', primaryImageSmall: '' };
        render(<CardCollection item={item} />);
        expect(screen.getByText('Untitled')).toBeInTheDocument();
        const media = screen.getByRole('img');
        expect(media).toBeInTheDocument();
    });

    it('renders with provided title and image', () => {
        const item = { ...mockItem, title: 'Mona Lisa', primaryImage: 'test-image.jpg' };
        render(<CardCollection item={item} />);
        expect(screen.getByText('Mona Lisa')).toBeInTheDocument();
        const media = screen.getByRole('img');
        expect(media).toBeInTheDocument();
    });

    it('does not render CardActions if toggleFavorite, favorites, or handleModalOpen are missing', () => {
        render(<CardCollection item={mockItem} />);
        expect(screen.queryByLabelText('more info')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('add to favorites')).not.toBeInTheDocument();
    });

    it('renders FavoriteButton and AddIcon when all props are provided', () => {
        const toggleFavorite = jest.fn();
        const handleModalOpen = jest.fn();
        const favorites = { 1: true };
        render(
            <CardCollection
                item={mockItem}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                handleModalOpen={handleModalOpen}
            />
        );
        expect(screen.getByLabelText('more info')).toBeInTheDocument();
        expect(screen.getByLabelText('add to favorites')).toBeInTheDocument();
    });

    it('calls handleModalOpen when AddIcon is clicked', () => {
        const handleModalOpen = jest.fn();
        const toggleFavorite = jest.fn();
        render(
            <CardCollection
                item={mockItem}
                toggleFavorite={toggleFavorite}
                favorites={{ 1: false }}
                handleModalOpen={handleModalOpen}
            />
        );
        fireEvent.click(screen.getByLabelText('more info'));
        expect(handleModalOpen).toHaveBeenCalledWith(mockItem);
    });

    it('calls toggleFavorite when favorite button is clicked', () => {
        const toggleFavorite = jest.fn();
        const handleModalOpen = jest.fn();
        render(
            <CardCollection
                item={mockItem}
                toggleFavorite={toggleFavorite}
                favorites={{ 1: false }}
                handleModalOpen={handleModalOpen}
            />
        );
        fireEvent.click(screen.getByLabelText('add to favorites'));
        expect(toggleFavorite).toHaveBeenCalledWith(mockItem.objectID);
    });

    it('shows favorite icon when item is favorited', () => {
        const toggleFavorite = jest.fn();
        const handleModalOpen = jest.fn();
        render(
            <CardCollection
                item={mockItem}
                toggleFavorite={toggleFavorite}
                favorites={{ 1: true }}
                handleModalOpen={handleModalOpen}
            />
        );
        expect(screen.getByLabelText('add to favorites')).toBeInTheDocument();
    });

    it('renders Card with correct styling', () => {
        render(<CardCollection item={mockItem} />);
        const card = document.querySelector('.MuiCard-root');
        expect(card).toBeInTheDocument();
    });

    it('renders CardMedia with correct height', () => {
        render(<CardCollection item={mockItem} />);
        const media = screen.getByRole('img');
        expect(media).toHaveStyle('height: 150px');
    });

    it('renders "Untitled" if title is null', () => {
        const item = { ...mockItem, title: null as any };
        render(<CardCollection item={item} />);
        expect(screen.getByText('Untitled')).toBeInTheDocument();
    });

    it('renders default image if both primaryImage and primaryImageSmall are missing', () => {
        const item = { ...mockItem, primaryImage: '', primaryImageSmall: '' };
        render(<CardCollection item={item} />);
        const media = screen.getByRole('img');
        expect(media).toBeInTheDocument();
    });

    it('does not crash if favorites prop is empty object', () => {
        const toggleFavorite = jest.fn();
        const handleModalOpen = jest.fn();
        render(
            <CardCollection
                item={mockItem}
                toggleFavorite={toggleFavorite}
                favorites={{}}
                handleModalOpen={handleModalOpen}
            />
        );
        expect(screen.getByLabelText('add to favorites')).toBeInTheDocument();
    });
});