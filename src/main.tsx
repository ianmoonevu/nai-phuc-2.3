import {useEffect, useState, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { DataProvider } from './context/DataContext.tsx';
import './index.css';
import { ContentProvider } from './context/ContentContext';
function ContentRoot() {
  const [revision, setRevision] = useState(0);
  useEffect(() => { const restore = () => setRevision(v => v + 1); window.addEventListener('hoki-content-restored', restore); return () => window.removeEventListener('hoki-content-restored', restore); }, []);
  return <DataProvider key={revision}><ContentProvider><App /></ContentProvider></DataProvider>;
}

// Enable native browser scroll restoration so F5 reload retains exact scroll position
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'auto';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentRoot />
  </StrictMode>,
);
