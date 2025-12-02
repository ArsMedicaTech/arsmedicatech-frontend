import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// 🟦 Import i18n (ajout pour la traduction)
import './i18n/i18n'; 

// 🟪 Sentry (suivi des erreurs)
import * as Sentry from '@sentry/react';
import { SENTRY_DSN } from './env_vars';

// Vérification de la clé Sentry
if (!SENTRY_DSN) {
  console.warn('⚠️ SENTRY_DSN environment variable is not set — Sentry disabled.');
} else {
  Sentry.init({
    dsn: SENTRY_DSN,
    sendDefaultPii: true, // collecter les infos utilisateur de base
  });
}

// Rendre React disponible globalement (utilisé pour les plugins)
window.React = React;

// Point d’entrée principal : monter le composant racine
ReactDOM.render(<App />, document.getElementById('root'));