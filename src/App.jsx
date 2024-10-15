import "./App.css";
import React, { useState } from "react"; // Ensure useState is imported
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust the path to your Navbar
import Home from "./components/Home"; // Ensure this is the correct path
import ImageUploadComponent from "./components/ImageUploadComponent"; // Ensure this is the correct path

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    // Logic to fetch or filter wallpapers based on the selected category can be added here
  };

  return (
    <BrowserRouter>
      <Navbar onSelectCategory={handleSelectCategory} />
      <Routes>
        <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
        <Route path="/upload" element={<ImageUploadComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
