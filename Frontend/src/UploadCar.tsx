// import React from 'react'

// const UploadCar = () => {
//   return (
//     <div>
//       <form action="/api/image/upload" method="post" encType="multipart/form-data">
//         <input type="file" name="image" />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   )
// }

// export default UploadCar

import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadCar = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    status: "Available", // Default status is Available
    type: "sedan", // Default type is sedan
    price: "",
    description: "",
    location: "",
    contact: "",
    features: [],
    imageId: "",
  });

    const [userId, setUserId] = useState(null); // Track userId
    const navigate = useNavigate();
      const fetchUserDetails = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      if (!token) {
        console.error("No token found");
        navigate("/login"); // Redirect to login if no token is found
        return;
      }

      try {
        const response = await axios.get('https://car-rental-r8on.onrender.com/api/auth/user/details', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token as 'Bearer <token>'
          },
        });

        console.log(response.data);

        if (response.data && response.data.id) {
          setUserId(response.data.id); // Set userId to state if response is valid
        } else {
          console.error("Failed to fetch user data");
          navigate("/login"); // Redirect if user data is not found or token is invalid
        }
      } catch (error) {
        console.error(error.response?.data || error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Redirect to login if unauthorized or token expired
          navigate("/login");
        }
      }
    };
    useEffect(() => {
      fetchUserDetails(); // Call fetchUserDetails on component mount
      console.log(userId);
      }, []);
  
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Simulate getting the user id from the logged-in session or token
  const soldBy = userId; // Example, replace with actual user id logic

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Set rating if not provided
  const finalFormData = { 
    ...formData,
    rating: rating || "4.5", // Ensure a default rating if not set
    condition: formData.condition || "Good",
  };

  if (!image) {
    alert("Please upload an image.");
    return;
  }

  try {
    setUploading(true);
    
    // Step 1: Upload the image
    const imageFormData = new FormData();
    imageFormData.append("image", image);
    const imageResponse = await axios.post(
      "https://car-rental-r8on.onrender.com/api/image/upload",
      imageFormData
    );

    if (imageResponse.data.success) {
      const imageId = imageResponse.data.file.id;

      // Add imageId to form data
      finalFormData.imageId = imageId;
      finalFormData.soldBy = soldBy; // Assuming soldBy comes from your session or auth logic

      // Step 2: Register the car with the image ID and soldBy
      await axios.post("https://car-rental-r8on.onrender.com/api/car/register", finalFormData);

      alert("Car listed successfully!");
      setUploading(false);
    }
  } catch (error) {
    alert("Error uploading car: " + error.message);
    setUploading(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Upload Your Car</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700">Car Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Car Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Mileage</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Condition</label>
            <select
              name="condition"
              value={formData.condition || 'Good'}  // Default to "Good" if condition is not set
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Car Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="suv">SUV</option>
              <option value="sedan">Sedan</option>
              <option value="hatchbacks">Hatchbacks</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="Available">Available</option>
              <option value="Not-Available">Not-Available</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Car Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Features (Comma Separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={(e) => {
                const featuresArray = e.target.value.split(",").map((item) => item.trim());
                setFormData({ ...formData, features: featuresArray });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className={`mt-4 w-full py-2 bg-blue-500 text-white rounded-lg ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Car"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCar;
