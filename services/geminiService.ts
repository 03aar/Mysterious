import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LocationData } from "../types";
import { TEXT_MODEL_NAME, IMAGE_MODEL_NAME, LOCATION_SYSTEM_INSTRUCTION } from "../constants";

// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const locationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The evocative name of the location." },
    shortDescription: { type: Type.STRING, description: "A 2-sentence summary of what the player sees immediately." },
    visualAtmosphere: { type: Type.STRING, description: "Description of the color palette, architecture, and mood." },
    lore: { type: Type.STRING, description: "A paragraph explaining the history or mystery of this place." },
    sensoryDetails: {
      type: Type.OBJECT,
      properties: {
        sound: { type: Type.STRING },
        smell: { type: Type.STRING },
        lighting: { type: Type.STRING },
      },
      required: ["sound", "smell", "lighting"]
    },
    hiddenSecrets: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "List of 2-3 secrets or hidden interactions." 
    },
    potentialLoot: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3 unique items found here."
    },
    dangerLevel: { 
      type: Type.STRING, 
      enum: ["Low", "Medium", "High", "Extreme"] 
    },
    visualPrompt: { 
      type: Type.STRING, 
      description: "A highly detailed, comma-separated prompt optimized for an AI image generator to visualize this location. Include camera angle, lighting style, and key elements." 
    }
  },
  required: ["name", "shortDescription", "visualAtmosphere", "lore", "sensoryDetails", "hiddenSecrets", "potentialLoot", "dangerLevel", "visualPrompt"]
};

export const generateLocationText = async (theme?: string): Promise<LocationData> => {
  if (!apiKey) throw new Error("API Key missing");

  const userPrompt = theme 
    ? `Create a mysterious location based on the theme: "${theme}".` 
    : "Create a completely random, unique mysterious location.";

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: LOCATION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: locationSchema,
        temperature: 0.9, // High creativity
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");

    return JSON.parse(text) as LocationData;
  } catch (error) {
    console.error("Text generation failed:", error);
    throw error;
  }
};

export const generateLocationImage = async (visualPrompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    // Using gemini-2.5-flash-image for generation via generateContent
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
            { text: visualPrompt }
        ]
      },
      config: {
          // No responseMimeType for image models usually, but let's keep it clean
      }
    });

    // Iterate to find image part
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};