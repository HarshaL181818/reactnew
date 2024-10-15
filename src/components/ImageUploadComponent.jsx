import React, { useState } from 'react';

function ImageUploadComponent() {
  const [imageName, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const unsafeCategories = ['Nudity', 'Violence', 'Drugs', 'Blood', 'Hate'];

  const checkImageSafety = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://13.201.1.105:8080/api/files/check-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Basic ' + btoa('harshal:1234'),
        },
      });

      if (response.ok) {
        const moderationResults = await response.json();
        const detectedCategories = moderationResults.detectedCategories || [];

        // Check if any unsafe categories are detected
        const isSafe = !detectedCategories.some(category => unsafeCategories.includes(category));

        if (!isSafe) {
          alert('The image contains unsafe content and cannot be uploaded.');
        }

        return isSafe;
      } else {
        const errorText = await response.text();
        alert(`Error checking image: ${errorText}`);
        return false;
      }
    } catch (error) {
      console.error('Error checking image safety:', error);
      alert('An error occurred while checking the image.');
      return false;
    }
  };

  const handleUpload = async () => {
    if (!imageFile || !imageName || !description) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    setIsUploading(true);

    // Check image safety with Rekognition
    const isSafe = await checkImageSafety(imageFile);

    if (!isSafe) {
      setIsUploading(false); // Reset uploading state
      return; // Stop if image is unsafe
    }

    const formData = new FormData();
    formData.append('title', imageName);
    formData.append('description', description);
    formData.append('file', imageFile);

    try {
      const response = await fetch('http://13.201.1.105:8080/api/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Basic ' + btoa('harshal:1234'),
        },
      });

      if (response.ok) {
        const savedWallpaper = await response.json();
        alert('Image uploaded successfully!');
        console.log('Saved Wallpaper:', savedWallpaper);

        setImageName('');
        setDescription('');
        setImageFile(null);
      } else {
        const errorText = await response.text();
        alert(`Failed to upload image: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image.');
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  return (
    <div style={{ marginTop: '80px', padding: '20px' }}>
      <h2>Upload New Wallpaper</h2>
      <input
        type="text"
        placeholder="Image Name"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
        disabled={isUploading}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isUploading}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        disabled={isUploading}
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default ImageUploadComponent;
