import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Tables from "./components/Tables/Tables.jsx";
import ProfileEdit from "./components/ProfileEdit/ProfileEdit.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/test" element={<p>Other path</p>} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/profile" element={<ProfileEdit></ProfileEdit>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
