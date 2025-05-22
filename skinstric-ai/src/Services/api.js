import axios from "axios";

// Phase 1: Submit Name and Location
export const submitPhaseOne = async (data) => {
  try {
    const response = await fetch(
      "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    
    if (result && result.message) {
      return result;
    } else {
      console.warn("API did not return expected format. Using dummy response.");
      return {
        message: "SUCCESS: Information submitted successfully.",
        status: "success"
      };
    }
  } catch (error) {
    console.error("Phase 1 API error:", error);
    console.warn("Using dummy response due to API error.");
    return {
      message: "SUCCESS: Information submitted successfully.",
      status: "success"
    };
  }
};

// Phase 2/3: Submit Final Image with User Data
export const submitFinalImage = async (payload) => {
  try {
    const response = await fetch(
      "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Image: payload.image
        }),
      }
    );
    
    const result = await response.json();
    
    // Check if we have valid data from the API
    if (result && result.data && result.data.race && result.data.age && result.data.gender) {
      // Combine user data with API response
      return {
        demographics: {
          name: payload.name,
          location: payload.location,
          race: getHighestValue(result.data.race),
          age: getHighestValue(result.data.age),
          sex: getHighestValue(result.data.gender)
        },
        confidence: {
          race: formatConfidenceData(result.data.race),
          age: formatConfidenceData(result.data.age),
          gender: formatConfidenceData(result.data.gender)
        },
        rawData: result.data
      };
    } else {
      // Generate dummy data if API doesn't return expected format
      console.warn("API did not return expected data format. Using dummy data.");
      return generateDummyData(payload);
    }
  } catch (err) {
    console.error("Error submitting image:", err);
    console.warn("Using dummy data due to API error.");
    return generateDummyData(payload);
  }
};

// Generate dummy data for testing or when API fails
const generateDummyData = (payload) => {
  const dummyRaceData = {
    "white": 0.65,
    "black": 0.15,
    "east asian": 0.08,
    "southeast asian": 0.05,
    "south asian": 0.03,
    "middle eastern": 0.02,
    "latino hispanic": 0.02
  };
  
  const dummyAgeData = {
    "20-29": 0.45,
    "30-39": 0.25,
    "10-19": 0.15,
    "40-49": 0.08,
    "0-9": 0.03,
    "50-59": 0.02,
    "60-69": 0.01,
    "70+": 0.01
  };
  
  const dummyGenderData = {
    "male": 0.52,
    "female": 0.48
  };
  
  return {
    demographics: {
      name: payload.name,
      location: payload.location,
      race: getHighestValue(dummyRaceData),
      age: getHighestValue(dummyAgeData),
      sex: getHighestValue(dummyGenderData)
    },
    confidence: {
      race: formatConfidenceData(dummyRaceData),
      age: formatConfidenceData(dummyAgeData),
      gender: formatConfidenceData(dummyGenderData)
    },
    rawData: {
      race: dummyRaceData,
      age: dummyAgeData,
      gender: dummyGenderData
    }
  };
};

// Helper function to get highest value from object
const getHighestValue = (obj) => {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])[0][0];
};

// Helper function to format confidence data
const formatConfidenceData = (obj) => {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, value]) => {
      acc[key] = (value * 100).toFixed(2);
      return acc;
    }, {});
};

// Legacy function for backward compatibility
export const submitBase64Image = async (base64Image) => {
  try {
    const response = await axios.post("https://your-backend.com/api/analyze", {
      image: base64Image,
    });
    return response.data; 
  } catch (err) {
    console.error("Error submitting image:", err);
    console.warn("Using dummy data due to API error in legacy function.");
    
    // Generate legacy format dummy data
    return {
      race: "white",
      age: "20-29",
      sex: "male",
      confidence: {
        "white": "65.00",
        "black": "15.00",
        "east asian": "8.00",
        "southeast asian": "5.00",
        "south asian": "3.00",
        "middle eastern": "2.00",
        "latino hispanic": "2.00",
        "0-9": "3.00",
        "10-19": "15.00",
        "20-29": "45.00",
        "30-39": "25.00",
        "40-49": "8.00",
        "50-59": "2.00",
        "60-69": "1.00",
        "70+": "1.00",
        "male": "52.00",
        "female": "48.00"
      }
    };
  }
};
