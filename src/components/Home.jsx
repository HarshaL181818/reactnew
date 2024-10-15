import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import unplugged from "../assets/unplugged.png";

const Home = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://13.201.1.105:8080/api/wallpapers`, {
          auth: {
            username: 'harshal',
            password: '1234'
          }
        });
        setWallpapers(response.data);
        setErrorMessage('');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Unauthorized access - please log in.");
        } else {
          setErrorMessage("Error fetching wallpapers. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  const handleImageClick = (url, event) => {
    event.stopPropagation(); // Prevents the Link from triggering
    console.log("Image clicked:", url); // Debugging line
    setSelectedImage(url); // Set the selected image for the modal
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // Close the modal
  };

  return (
    <div className="grid" style={{ marginTop: "64px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", padding: "20px" }}>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          {wallpapers.length === 0 ? (
            <h2 className="text-center" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              No Wallpapers Available
            </h2>
          ) : (
            wallpapers.map((wallpaper) => {
              const { id, name, description, imageUrl } = wallpaper; // Use imageUrl instead of imageData and imageType
              return (
                <div className="card mb-3" style={{ width: "250px", height: "360px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "stretch" }} key={id}>


                    <img 
                      src={imageUrl ? imageUrl : unplugged} 
                      alt={name} 
                      style={{ width: "100%", height: "150px", objectFit: "cover", padding: "5px", margin: "0", borderRadius: "10px 10px 10px 10px" }} 
                      onClick={(event) => handleImageClick(imageUrl, event)} // Handle image click
                    />
                    <div className="card-body" style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px" }}>
                      <h5 className="card-title" style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>
                        {name.toUpperCase()}
                      </h5>
                      <p>{description}</p>
                    </div>
                </div>
              );
            })
          )}
        </>
      )}
      
      {/* Modal for displaying the selected image
       */}
      {selectedImage && (
        <div className="modal" style={modalStyles}>
          <span style={closeButtonStyles} onClick={handleCloseModal}>&times;</span>
          <img 
            src={selectedImage} 
            alt="Selected" 
            style={imageStyles} 
            onLoad={() => console.log("Image loaded:", selectedImage)} // Debugging line
            onError={() => {
              console.error("Error loading image:", selectedImage);
              setSelectedImage(null); // Reset on error
            }}
          />
        </div>
      )}
    </div>
  );
};

// Styles for the modal
const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const closeButtonStyles = {
  position: "absolute",
  top: "20px",
  right: "30px",
  color: "white",
  fontSize: "40px",
  cursor: "pointer"
};

const imageStyles = {
  maxWidth: "90%",
  maxHeight: "90%"
};

export default Home;
