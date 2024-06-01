import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const Uploader = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageList, setImageList] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('date', selectedDate);

        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log(response.data);

        // Update image list
        const newImage = {
          date: selectedDate,
          image: URL.createObjectURL(selectedImage)
        };
        setImageList([...imageList, newImage]);
        // Clear selectedImage state for next upload
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {selectedImage && (
        <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" className="max-w-xs mb-4" />
      )}
      <div>
        <label className="block mb-2">Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
      </div>
      <div className="flex items-center justify-center">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 rounded px-3 py-2 mr-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      {/* Display list of uploaded images */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Uploaded Images:</h2>
        <ul>
          {imageList.map((image, index) => (
            <li key={index} className="flex items-center mb-2">
              <img src={image.image} alt={`Image ${index}`} className="w-20 h-20 mr-2" />
              <span>{new Date(image.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Uploader;
