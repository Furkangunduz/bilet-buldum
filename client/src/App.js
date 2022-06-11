import { Route, Routes } from "react-router-dom";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Header from "./components/shared/Header";


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>)
}

export default App;
