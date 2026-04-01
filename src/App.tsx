import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { Home } from './pages/home';
import { Government } from './pages/government';
import { Food } from './pages/food';
import { Travel } from './pages/travel';
import { Service } from './pages/service';
import { Culture } from './pages/culture';
import { User } from './pages/user';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Home />} />
          <Route path="government" element={<Government />} />
          <Route path="food" element={<Food />} />
          <Route path="travel" element={<Travel />} />
          <Route path="service" element={<Service />} />
          <Route path="culture" element={<Culture />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
