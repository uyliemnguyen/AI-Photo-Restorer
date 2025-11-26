import { GoogleGenAI, Modality } from "@google/genai";
import { RestorationOptions } from "../types";
import { MODEL_NAME } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Constructs a high-fidelity system prompt based on selected restoration options.
 */
const buildPrompt = (options: RestorationOptions): string => {
  const baseInstructions = [
    "ROLE: You are a forensic image restoration expert specialized in preserving historical accuracy.",
    "TASK: Restore the attached image to high definition while maintaining absolute fidelity to the original subject.",
    "CRITICAL CONSTRAINTS:",
    "1. IDENTITY LOCK: Do NOT alter facial bone structure, eye shape, nose shape, or mouth shape. The output must look EXACTLY like the original person, just clearer.",
    "2. NO HALLUCINATIONS: Do not add make-up, change the age, or alter the facial expression. Do not add objects that are not in the source.",
    "3. TEXTURE PRESERVATION: Keep realistic skin texture (pores, slight imperfections). Do not make the skin look like smooth plastic or wax.",
    "4. STRUCTURAL INTEGRITY: The composition and aspect ratio must remain identical.",
  ];

  const specificTasks: string[] = ["EXECUTE THE FOLLOWING RESTORATIONS:"];

  if (options.colorize) {
    specificTasks.push("- COLORIZATION: If the image is B&W, add subtle, realistic colors. Use low saturation for a vintage but restored look. If color exists, correct fading.");
  }

  if (options.denoise) {
    specificTasks.push("- DENOISE: Remove grain and ISO noise without losing fine details.");
  }

  if (options.fixScratches) {
    specificTasks.push("- REPAIR: Inpaint scratches, creases, and dust spots seamlessly.");
  }

  if (options.sharpenFace) {
    specificTasks.push("- FACE ENHANCEMENT: Apply super-resolution to faces strictly to recover definition lost to blur. Do not reshape features. Focus on sharpening the iris and eyelashes while keeping the original gaze.");
  }

  if (options.upscale) {
    specificTasks.push("- UPSCALE: Increase the apparent resolution and detail density by 2x. Ensure lines are sharp and textures are high-definition. Return a higher resolution image if possible.");
  }

  // Final instruction to trigger generation
  specificTasks.push("Return only the restored image.");

  return [...baseInstructions, "", ...specificTasks].join("\n");
};

/**
 * Calls Gemini API to restore the image.
 */
export const restoreImage = async (file: File, options: RestorationOptions): Promise<string> => {
  try {
    const base64Data = await fileToBase64(file);
    const prompt = buildPrompt(options);
    const mimeType = file.type;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image from the response
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
      const base64ImageBytes = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }

    throw new Error("No image data received from Gemini API.");

  } catch (error: any) {
    console.error("Restoration failed:", error);
    throw new Error(error.message || "Failed to restore image. Please try again.");
  }
};