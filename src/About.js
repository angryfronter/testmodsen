import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './searchbar.css'

import headerImage from './книги.jpeg';
import { About } from './About';

const BookSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSort, setSelectedSort] = useState('relevance');
    const [books, setBooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    const API_KEY = 'AIzaSyC8taHKaCdgjUkwP235hZdIMCf16_E49hs';

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    };

    const performSearch = async () => {
        try {
            setLoading(true);
            setStartIndex(0);
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                    searchTerm
                )}&startIndex=0&maxResults=30&orderBy=${selectedSort}&key=${API_KEY}`
            );
            setBooks(response.data.items || []);
            setTotalBooks(response.data.totalItems || 0);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                    searchTerm
                )}&startIndex=${startIndex + 30}&maxResults=30&orderBy=${selectedSort}&key=${API_KEY}`
            );
            setBooks((prevBooks) => [...prevBooks, ...(response.data.items || [])]);
            setStartIndex(startIndex + 30);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        performSearch();
    }, []);

    return (
        <div className="container">
            <div className="header">
                <img src={headerImage} alt="Header" className="header-image" />
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Enter search term..."
                />
                <button className="btn btn-primary" onClick={performSearch}>
                    Search
                </button>
            </div>
            <div className="filter-bar">
                <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                >
                    <option value="all">All</option>
                    <option value="art">Art</option>
                    <option value="biography">Biography</option>
                    <option value="computers">Computers</option>
                    <option value="history">History</option>
                    <option value="medical">Medical</option>
                    <option value="poetry">Poetry</option>
                </select>
                <select
                    value={selectedSort}
                    onChange={(event) => setSelectedSort(event.target.value)}
                >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                </select>
            </div>
            <div className="book-list">
                <p>Found {totalBooks} books</p>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    books.map((book) => (
                        <Link key={book.id} to={`/books/${book.id}`}>
                            <div className="card">
                                <img
                                    src={
                                        book.volumeInfo.imageLinks?.thumbnail ||
                                        'https://via.placeholder.com/128x192.png?text=No+Image'
                                    }
                                    alt={book.volumeInfo.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{book.volumeInfo.title}</h5>
                                    <p className="card-text">
                                        Category: {book.volumeInfo.categories?.[0] || 'Unknown'}
                                    </p>
                                    <p className="card-text">
                                        Authors: {book.volumeInfo.authors?.join(', ') || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            {books.length < totalBooks && (
                <button className="btn btn-primary" onClick={handleLoadMore}>
                    Load more
                </button>
            )}
        </div>
    );
};

export default BookSearchPage;

