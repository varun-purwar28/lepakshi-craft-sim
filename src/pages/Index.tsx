import { useEffect } from 'react';
import { initializeData } from '@/lib/localStorage';
import Home from './Home';

const Index = () => {
  useEffect(() => {
    initializeData();
  }, []);

  return <Home />;
};

export default Index;
