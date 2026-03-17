import { useState, useEffect } from 'react';
import { ThemeStudio } from './components/ThemeStudio';
import { Home } from './components/Home';
import { ScaleContainer } from './components/ScaleContainer';
import './App.css';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const handler = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

function App() {
  const hash = useHashRoute();

  // 渲染内容
  const renderContent = () => {
    // Studio 路由
    if (hash === '#/studio') {
      return <ThemeStudio />;
    }
    // 首页
    return <Home />;
  };

  return (
    <ScaleContainer
      designWidth={1920}
      designHeight={1080}
      mode="contain"
    >
      {renderContent()}
    </ScaleContainer>
  );
}

export default App;
