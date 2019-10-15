import React from 'react';

const AppContext = React.createContext({
    folders: [],
    notes: [],
    deleteNote: () => {},
    addFolder: () => {},
    addNote: () => {},
});

export default AppContext;