import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";

import { Routes, Route,BrowserRouter as Router } from "react-router-dom";
import { useThemeStore } from "./Store/useThemeStore";

import { Toaster } from "react-hot-toast";
import Navbar from "./Component/Navbar";

function App() {
  const { theme } = useThemeStore();

  return (
    <Router>
    <div className="min-h-screen bg-base-200 transition-colors duration-300" data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Toaster />
    </div>
    </Router>
  );
}

export default App;