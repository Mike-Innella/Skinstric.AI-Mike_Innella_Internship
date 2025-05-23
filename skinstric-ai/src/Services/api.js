import axios from "axios";

/**
 * API Service - Skinstric.AI
 * All logs here are for verification and debugging only.
 */

// Phase 1: Submit Name and Location
export const submitPhaseOne = async (data) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔵 [API1] Submitting registration:`, data);
    const response = await fetch(
      "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(`[${timestamp}] ✅ [API1] Success:`, result);
    return result;
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ [API1] Failed:`, error);
    throw error;
  }
};

// Phase 2: Upload Image and Get Demographic Predictions
export const submitFinalImage = async (payload) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🟢 [API2] Submitting image payload:`, { image: payload.image ? "base64 present" : "no image" });
    const response = await fetch(
      "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: payload.image,
        }),
      }
    );

    const result = await response.json();
    console.log(`[${timestamp}] ✅ [API2] Raw response:`, result);
    if (result && result.race && result.age && result.gender) {
      console.log(`[${timestamp}] 🟢 [API2] Demographic breakdown:`, {
        race: result.race,
        age: result.age,
        gender: result.gender
      });
    } else {
      console.warn(`[${timestamp}] 🟢 [API2] No demographic data in response:`, result);
    }
    return result;
  } catch (err) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ [API2] Failed:`, err);
    throw err;
  }
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
