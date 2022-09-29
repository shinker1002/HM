import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import View from './pages/View';
import Graph from './pages/Graph';

const App = () => { 
  return (
    <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/Register" element={<RegisterPage/>} />
      <Route path="/View/:username" element={<View/>} />
      <Route path="/Graph/:username" element={<Graph/>} />
    </Routes>
  );
};

export default App;
