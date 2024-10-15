import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/wallpapers/search?query=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const categories = [
    "Nature",
    "Abstract",
    "Animals",
    "Cities",
    "Space",
    "Technology",
  ];

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              Wallpaper Gallery
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {categories.map((category) => (
                  <li key={category} className="nav-item">
                    <button
                      className="nav-link"
                      onClick={() => {
                        onSelectCategory(category);
                      }}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
              
              {/* New Upload button */}
              <Link to="/upload">
                <button className="nav-link">Upload Wallpaper</button>
              </Link>

              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search Wallpapers"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {showSearchResults && (
                  <ul className="list-group position-absolute">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item">
                          <a href={`/wallpaper/${result.id}`} className="search-result-link">
                            <span>{result.title}</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <p className="no-results-message">
                          No Wallpapers Found
                        </p>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
