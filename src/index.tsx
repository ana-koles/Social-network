import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { addMessageToDialog, addPost, state } from './redux/state';
import { rerenderEntireTree } from './rerender';



/* ReactDOM.render(
    <App
        appState={state}
        addMessageToDialog={addMessageToDialog}
        addPost={addPost}/>,
  document.getElementById('root')
); */

rerenderEntireTree(state);