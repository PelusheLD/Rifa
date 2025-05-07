import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Configurar font-awesome CDN
const fontAwesomeCss = document.createElement('link');
fontAwesomeCss.rel = 'stylesheet';
fontAwesomeCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesomeCss);

// Configurar Google Fonts
const googleFonts = document.createElement('link');
googleFonts.rel = 'stylesheet';
googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(googleFonts);

// Configurar meta tags
const metaTitle = document.createElement('title');
metaTitle.textContent = 'Rifas Online - Gestión de Rifas';
document.head.appendChild(metaTitle);

const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Plataforma de gestión de rifas online. Participa en nuestras rifas con los premios más exclusivos.';
document.head.appendChild(metaDescription);

// Render app
createRoot(document.getElementById("root")!).render(<App />);
