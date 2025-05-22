import axios from "axios";

// Phase 1: Submit Name and Location
export const submitPhaseOne = async (name, location) => {
  try {
    const response = await axios.post(
      "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne",
      { name, location }
    );
    return response.data;
  } catch (error) {
    console.error("Phase 1 API error:", error);
    throw error;
  }
};

// Phase 2: Upload Base64 Image
export const submitBase64Image = async (base64Image) => {
  try {
    const response = await axios.post("https://your-backend.com/api/analyze", {
      image: base64Image,
    });
    return response.data; 
  } catch (err) {
    console.error("Error submitting image:", err);
    throw err;
  }
};
