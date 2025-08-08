import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FavoritesDrawer from '../components/FavoritesDrawer';
import { CollectionObject } from '../models/CollectionObject';

const mockFavorites: CollectionObject[] = [
    {
        objectID: 1,
        title: 'Art 1',
        primaryImage: 'img1.jpg',
        primaryImageSmall: '',
        additionalImages: [],
        constituents: [],
        artistDisplayName: '',
        artistDisplayBio: '',
        objectBeginDate: 0,
        objectEndDate: 0,
        medium: '',
        department: '',
        objectWikidata_URL: ''
    },
    {
        objectID: 2,
        title: 'Art 2',
        primaryImage: 'img2.jpg',
        primaryImageSmall: '',
        additionalImages: [],
        constituents: [],
        artistDisplayName: '',
        artistDisplayBio: '',
        objectBeginDate: 0,
        objectEndDate: 0,
        medium: '',
        department: '',
        objectWikidata_URL: ''
    },
];

describe('FavoritesDrawer', () => {
    it('renders drawer when open is true', () => {
        render(
            <FavoritesDrawer
                favorites={mockFavorites}
                open={true}
                toggleDrawer={jest.fn()}
            />
        );
        expect(screen.getByText('My Favorites')).toBeInTheDocument();
        expect(screen.getByText('Art 1')).toBeInTheDocument();
        expect(screen.getByText('Art 2')).toBeInTheDocument();
    });

    it('does not render drawer when open is false', () => {
        render(
            <FavoritesDrawer
                favorites={mockFavorites}
                open={false}
                toggleDrawer={jest.fn()}
            />
        );
        expect(screen.queryByText('My Favorites')).not.toBeInTheDocument();
    });

    it('calls toggleDrawer(false) when drawer is closed', () => {
        const toggleDrawer = jest.fn();
        render(
            <FavoritesDrawer
                favorites={mockFavorites}
                open={true}
                toggleDrawer={toggleDrawer}
            />
        );
        
        const backdrop = document.querySelector('.MuiBackdrop-root');
        if (backdrop) {
            fireEvent.click(backdrop);
        } else {
            const drawer = screen.getByRole('presentation');
            fireEvent.keyDown(drawer, { key: 'Escape', code: 'Escape', keyCode: 27 });
        }
        
        expect(toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('renders no cards if favorites is empty', () => {
        render(
            <FavoritesDrawer
                favorites={[]}
                open={true}
                toggleDrawer={jest.fn()}
            />
        );
        expect(screen.getByText('My Favorites')).toBeInTheDocument();

        expect(screen.queryByText('Art 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Art 2')).not.toBeInTheDocument();
    });
});