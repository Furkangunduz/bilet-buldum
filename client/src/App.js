import { Route, Routes } from "react-router-dom";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/TCDD_bot" element={<Home />} />
        <Route exact path="/TCDD_bot/search" element={<Search />} />
      </Routes>
      <Footer />
    </>)
}

export default App;
