import React from 'react';
import { render } from 'react-dom';
import '@models/Post';
import './babel';
import './styles/styles.css';
import './styles/card.scss';

const App = () => (
    <div className="container">
        <h1>Webpack course</h1>

        <div className="logo" />

        <pre />

        <div className="card">
            <h2>SCSS</h2>
        </div>
    </div>
);

render(<App />, document.getElementById('app'));
