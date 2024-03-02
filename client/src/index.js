import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TaskProvider } from './Components/TaskContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DndProvider backend={HTML5Backend}>
  <React.StrictMode>
    <AuthProvider>\
      <TaskProvider >
      <App />
      </TaskProvider>
    </AuthProvider>
  </React.StrictMode>
  </DndProvider>
);

reportWebVitals();

