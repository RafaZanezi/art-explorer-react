import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Collection from './components/Collection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className='app'>
            <Collection />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;