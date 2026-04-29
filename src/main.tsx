// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import { initVanillaTodo } from './exercises/1-vanilla-todo'

const rootElement = document.getElementById('root')!;

// Czyścimy root i przygotowujemy miejsce dla vanilla todo
rootElement.innerHTML = '<div id="vanilla-root"></div>';

// Uruchamiamy nasze Todo
initVanillaTodo();