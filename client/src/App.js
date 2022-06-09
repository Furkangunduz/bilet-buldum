import { Route, Routes } from "react-router-dom";
import Search from "./pages/Search";
import Home from "./pages/Home";


function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<Search />} />
  </Routes>
}

export default App;
