import Sidebar from './Sidebar';
import Notification from './Notification';
import AppRouter from '../router';

const App = () => {
  return (
    <>
      <Sidebar />
      <Notification />
      <main className="main">
        <AppRouter />
      </main>
    </>
  );
};

export default App;
