import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // UPDATED PROMPT: Agricultural Pathology Focus
    const prompt = `
      You are an expert agricultural pathologist and botanist. 
      Analyze the provided image of a plant leaf or crop. Identify the crop and any diseases, pests, or nutrient deficiencies present. If the plant is healthy, indicate that.
      
      You MUST return a JSON object exactly matching this structure, filling in the data based on your visual analysis:
      {
        "summary": {
          "crop_name": "e.g., Tomato, Maize, Unknown",
          "disease_name": "e.g., Early Blight, Aphids, or 'Healthy'",
          "status": "Infected, Pest Infestation, or Healthy",
          "confidence": "e.g., 94%",
          "severity": "High, Medium, Low, or None",
          "badge": "e.g., High Risk (or 'Healthy' if no issue)"
        },
        "breakdown": {
          "immediate_action": { 
            "title": "Immediate Action", 
            "description": "The very first practical step the farmer should take right now (e.g., isolate plant, prune leaves)." 
          },
          "organic_treatment": { 
            "title": "Organic Treatment", 
            "description": "Actionable non-chemical treatment recommendations (e.g., neem oil, Bacillus subtilis)." 
          },
          "chemical_treatment": { 
            "title": "Chemical Treatment", 
            "description": "Specific chemical fungicides/pesticides if applicable, or state 'Not required'." 
          },
          "prevention": { 
            "title": "Future Prevention", 
            "description": "Cultural practices to prevent this in the future (e.g., crop rotation, wider spacing)." 
          }
        }
      }
    `;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check if the error is a timeout or network fetch failure
    if (error.message?.includes('fetch failed') || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'The connection to the AI service timed out. Please check your internet connection and try again.' }, 
        { status: 504 }
      );
    }

    // Generic fallback error
    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing the crop. Please try again.' }, 
      { status: 500 }
    );
  }
}