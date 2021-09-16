import { useState } from 'react';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import Notification from './Notification';
import AppRouter from '../router';

const App = () => {

  const [ isOpen, setIsOpen ] = useState(false);
  const handleOpenDrawer = () => setIsOpen(prev => !prev);

  return (
    <>
      <Appbar  handleOpenDrawer={handleOpenDrawer} />
      <Sidebar handleOpenDrawer={handleOpenDrawer} isOpen={isOpen} />
      <Notification />
      <main className="main">
        <AppRouter />
      </main>
    </>
  );
};

export default App;
