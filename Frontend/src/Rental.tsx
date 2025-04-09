

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Rental = () => {
//   const [selectedCategory, setSelectedCategory] = useState("suv"); // Default category set to 'suv'
//   const [carData, setCarData] = useState({
//     suv: [],
//     sedan: [],
//     hatchback: [],
//     luxury: [],
//   });
//   const [filteredCars, setFilteredCars] = useState([]);
//   const [carMake, setCarMake] = useState("");
//   const [monthlyBudget, setMonthlyBudget] = useState(""); // Changed to string for custom handling
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch car data from API
// const fetchCarData = async () => {
//   setLoading(true);
//   try {
//     const [suvResponse, sedanResponse, hatchbackResponse, luxuryResponse] = await Promise.all([
//       axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/suv"),
//       axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/sedan"),
//       axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/hatchbacks"),
//       axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/luxury"),
//     ]);

//     // Check the response data format to make sure it contains cars
//     console.log("SUV Cars:", suvResponse.data);
//     console.log("Sedan Cars:", sedanResponse.data);
//     console.log("Hatchback Cars:", hatchbackResponse.data);
//     console.log("Luxury Cars:", luxuryResponse.data);

//     // If the structure of the response is different, adjust accordingly
//     setCarData({
//       suv: suvResponse.data.cars || [],
//       sedan: sedanResponse.data.cars || [],
//       hatchback: hatchbackResponse.data.cars || [],
//       luxury: luxuryResponse.data.cars || [],
//     });
//   } catch (error) {
//     console.error("Error fetching car data:", error);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     fetchCarData();
//   }, []);

//   // Re-filter cars whenever any filter or selected category changes
//   useEffect(() => {
//     filterCars();
//   }, [carData, selectedCategory, carMake, monthlyBudget]);

//   // Handle category change (converted to lowercase for consistency)
//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category.toLowerCase()); // Ensure category is in lowercase
//   };

//   // Filter cars based on selected filters
//   const filterCars = () => {
//     console.log("Filtering cars...");

//     // Ensure that currentCategoryCars is an array
//     const currentCategoryCars = selectedCategory === "all"
//       ? [...carData.suv, ...carData.sedan, ...carData.hatchback, ...carData.luxury]
//       : carData[selectedCategory];

//     console.log(`Category: ${selectedCategory}`, currentCategoryCars); // Log current category data

//     // Apply the filters
//     let filtered = currentCategoryCars.filter((car) => {
//       // Convert price to number for comparison if it's a string
//       const carPrice = parseFloat(car.price);

//       const matchesMake = carMake
//         ? car.make.toLowerCase().includes(carMake.toLowerCase()) ||
//           car.model.toLowerCase().includes(carMake.toLowerCase())
//         : true;

//       // Apply the budget filtering
//       let matchesBudget = true;
//       if (monthlyBudget === "custom") {
//         // If it's custom, compare the price with the custom value
//         const customBudget = parseFloat(monthlyBudget);
//         matchesBudget = carPrice > customBudget;
//       } else if (monthlyBudget) {
//         // Else if a predefined budget is selected, check against that
//         const budget = parseFloat(monthlyBudget);
//         matchesBudget = carPrice <= budget;
//       }

//       return matchesMake && matchesBudget;
//     });

//     console.log("Filtered Cars:", filtered); // Log filtered cars

//     setFilteredCars(filtered);
//   };

//   // Handle filter change
//   const handleFilterChange = () => {
//     console.log("Handling filter change...");
//     filterCars();
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setCarMake("");
//     setMonthlyBudget(""); // Reset monthly budget
//     filterCars(); // Reset the filter with the full category data
//   };

//   return (
//     <div className="font-sans">
//       {/* Hero Section */}
//       <section className="text-center py-16 bg-gradient-to-r from-teal-200 to-blue-200">
//         <h2 className="text-4xl font-bold mb-4">CAR LEASING</h2>
//         <p className="text-gray-700 mb-6">Find the best car leasing deals today!</p>
//         <div className="flex justify-center gap-4">
//           {/* Car Make Input */}
//           <input
//             type="text"
//             placeholder="Search by Car Make or Model"
//             className="px-4 py-2 border border-gray-300 rounded-md"
//             value={carMake}
//             onChange={(e) => {
//               setCarMake(e.target.value);
//             }}
//           />

//           {/* Car Type Dropdown */}
//           <select
//             className="px-4 py-2 border border-gray-300 rounded-md"
//             value={selectedCategory}
//             onChange={(e) => handleCategoryChange(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="suv">SUV</option>
//             <option value="sedan">Sedan</option>
//             <option value="hatchback">Hatchback</option>
//             <option value="luxury">Luxury</option>
//           </select>

//           {/* Monthly Budget Dropdown */}
//           <div className="flex flex-col gap-2">
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-md"
//               value={monthlyBudget}
//               onChange={(e) => setMonthlyBudget(e.target.value)}
//             >
//               <option value="">Select Monthly Budget</option>
//               <option value="200">Up to ₹200,000</option>
//               <option value="400">Up to ₹400,000</option>
//               <option value="600">Up to ₹600,000</option>
//               <option value="800">Up to ₹800,000</option>
//               <option value="1000">Up to ₹1,000,000</option>
//               <option value="custom">Custom?</option>
//             </select>

//             {/* Custom Budget Input */}
//             {monthlyBudget === "custom" && (
//               <input
//                 type="number"
//                 placeholder="Enter custom budget"
//                 className="px-4 py-2 border border-gray-300 rounded-md"
//                 onChange={(e) => setMonthlyBudget(e.target.value)}
//               />
//             )}
//           </div>

//           {/* Search and Reset Buttons */}
//           <div className="flex gap-4">
//             <button
//               onClick={handleFilterChange}
//               className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
//             >
//               Search Deals
//             </button>
//             <button
//               onClick={resetFilters}
//               className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Leasing Deals Section */}
//       {loading ? (
//         <div className="text-center text-gray-500">Loading cars...</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredCars.length === 0 ? (
//             <div className="col-span-full text-center text-gray-500">
//               No cars available in this category.
//             </div>
//           ) : (
//             filteredCars.map((car) => (
//               <div
//                 key={car._id}
//                 className="relative bg-white shadow-xl rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl"
//               >
//                 {/* Display the car image from the API endpoint */}
//                 <img
//                   src={`https://car-rental-r8on.onrender.com/api/image/${car.imageId}`} // Assuming car.imageId is the correct field
//                   alt={car.make + " " + car.model}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>

//                 <div className="p-6 relative z-10">
//                   <h3 className="text-xl font-semibold text-gray-800">{car.make} {car.model}</h3>
//                   <p className="text-gray-500 text-sm">Price: ₹{car.price}</p>
//                   <div className="flex items-center space-x-2 mt-2">
//                     <span className="text-yellow-500">
//                       {'★'.repeat(Math.round(car.rating))} 
//                     </span>
//                     <span className="text-gray-500">({car.rating})</span>
//                   </div>
//                   <button
//                     className="mt-4 text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     onClick={() => navigate(`/car/${car._id}`)}
//                   >
//                     View Deal
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-6 text-center">
//         <p>&copy; 2024 Car Leasing. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Rental;


//woking above



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Rental = () => {
  const [selectedCategory, setSelectedCategory] = useState("suv"); // Default category set to 'suv'
  const [carData, setCarData] = useState({
    suv: [],
    sedan: [],
    hatchback: [],
    luxury: [],
  });
  const [filteredCars, setFilteredCars] = useState([]);
  const [carMake, setCarMake] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(""); // Changed to string for custom handling
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [customBudget, setCustomBudget] = useState("");

  // Fetch car data from API
const fetchCarData = async () => {
  setLoading(true);
  try {
    const [suvResponse, sedanResponse, hatchbackResponse, luxuryResponse] = await Promise.all([
      axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/suv"),
      axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/sedan"),
      axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/hatchbacks"),
      axios.get("https://car-rental-r8on.onrender.com/api/car/get-car-by-type/luxury"),
    ]);

    // Check the response data format to make sure it contains cars
    console.log("SUV Cars:", suvResponse.data);
    console.log("Sedan Cars:", sedanResponse.data);
    console.log("Hatchback Cars:", hatchbackResponse.data);
    console.log("Luxury Cars:", luxuryResponse.data);

    // If the structure of the response is different, adjust accordingly
    setCarData({
      suv: suvResponse.data.cars || [],
      sedan: sedanResponse.data.cars || [],
      hatchback: hatchbackResponse.data.cars || [],
      luxury: luxuryResponse.data.cars || [],
    });
  } catch (error) {
    console.error("Error fetching car data:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCarData();
  }, []);

  // Re-filter cars whenever any filter or selected category changes
  useEffect(() => {
    filterCars();
  }, [carData, selectedCategory, carMake, monthlyBudget]);

  // Handle category change (converted to lowercase for consistency)
  const handleCategoryChange = (category) => {
    setSelectedCategory(category.toLowerCase()); // Ensure category is in lowercase
  };

  // Filter cars based on selected filters
  const filterCars = () => {
    console.log("Filtering cars...");

    // Ensure that currentCategoryCars is an array
    const currentCategoryCars = selectedCategory === "all"
      ? [...carData.suv, ...carData.sedan, ...carData.hatchback, ...carData.luxury]
      : carData[selectedCategory];

    console.log(`Category: ${selectedCategory}`, currentCategoryCars); // Log current category data

    // Apply the filters
    let filtered = currentCategoryCars.filter((car) => {
      // Convert price to number for comparison if it's a string
      const carPrice = parseFloat(car.price);

      const matchesMake = carMake
        ? car.make.toLowerCase().includes(carMake.toLowerCase()) ||
          car.model.toLowerCase().includes(carMake.toLowerCase())
        : true;

      // Apply the budget filtering
      let matchesBudget = true;
      if (monthlyBudget === "custom" && customBudget) {
      // If it's custom, compare the price with the custom value
      const customBudgetValue = parseInt(customBudget);
      matchesBudget = carPrice <= customBudgetValue; // Correct the comparison for custom budget
      } else if (monthlyBudget) {
        // Else if a predefined budget is selected, check against that
        const budgetValue = parseInt(monthlyBudget);
        matchesBudget = carPrice <= budgetValue;
      }

      return matchesMake && matchesBudget;
    });

    console.log("Filtered Cars:", filtered); // Log filtered cars

    setFilteredCars(filtered);
  };

  // Handle filter change
  const handleFilterChange = () => {
    console.log("Handling filter change...");
    filterCars();
  };

  // Reset filters
  const resetFilters = () => {
    setCarMake("");
    setMonthlyBudget(""); // Reset monthly budget
    filterCars(); // Reset the filter with the full category data
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-teal-200 to-blue-200">
        <h2 className="text-4xl font-bold mb-4">CAR LEASING</h2>
        <p className="text-gray-700 mb-6">Find the best car leasing deals today!</p>
        <div className="flex justify-center gap-4">
          {/* Car Make Input */}
          <input
            type="text"
            placeholder="Search by Car Make or Model"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={carMake}
            onChange={(e) => {
              setCarMake(e.target.value);
            }}
          />

          {/* Car Type Dropdown */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="hatchback">Hatchback</option>
            <option value="luxury">Luxury</option>
          </select>

          {/* Monthly Budget Dropdown */}
          <div className="flex flex-col gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
            >
              <option value="">Select Monthly Budget</option>
              <option value="20000">Up to ₹200,000</option>
              <option value="40000">Up to ₹400,000</option>
              <option value="60000">Up to ₹600,000</option>
              <option value="80000">Up to ₹800,000</option>
              <option value="100000">Up to ₹1,000,000</option>
              <option value="custom">Custom?</option>
            </select>

              {/* Custom Budget Input */}
              {monthlyBudget === "custom" && (
                <input
                  type="number"
                  placeholder="Enter custom budget"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  value={customBudget}  // Ensure the value is tied to monthlyBudget
                  onChange={(e) => setCustomBudget(e.target.value)} // Update the state with the typed value
                />
              )}

          </div>

          {/* Search and Reset Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleFilterChange}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Search Deals
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Leasing Deals Section */}
      {loading ? (
        <div className="text-center text-gray-500">Loading cars...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No cars available in this category.
            </div>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car._id}
                className="relative bg-white shadow-xl rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Display the car image from the API endpoint */}
                <img
                  src={`https://car-rental-r8on.onrender.com/api/image/${car.imageId}`} // Assuming car.imageId is the correct field
                  alt={car.make + " " + car.model}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>

                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-semibold text-gray-800">{car.make} {car.model}</h3>
                  <p className="text-gray-500 text-sm">Price: ₹{car.price}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-yellow-500">
                      {'★'.repeat(Math.round(car.rating))} 
                    </span>
                    <span className="text-gray-500">({car.rating})</span>
                  </div>
                  <button
                    className="mt-4 text-white bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => navigate(`/car/${car._id}`)}
                  >
                    View Deal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2024 Car Leasing. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Rental;
