import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const provider = formData.get('provider') as string || 'gemini';

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // ==========================================
    // ROUTE 1: HUGGING FACE INFERENCE API
    // ==========================================
    if (provider === 'huggingface') {
      const hfResponse = await fetch(
        "https://api-inference.huggingface.co/models/dima806/plant_diseases_classification",
        {
          headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
          method: "POST",
          body: arrayBuffer,
        }
      );

      if (!hfResponse.ok) {
        throw new Error("Hugging Face API failed to respond.");
      }

      const hfData = await hfResponse.json();
      console.log("hugging face data response", hfData);
      const topResult = hfData[0]; // Gets the highest confidence prediction

      // HF returns labels like "Tomato___Early_blight". We must parse this.
      let cropName = "Unknown Plant";
      let diseaseName = topResult.label;

      if (diseaseName.includes('___')) {
        const parts = diseaseName.split('___');
        cropName = parts[0].replace(/_/g, ' ');
        diseaseName = parts[1].replace(/_/g, ' ');
      }

      const isHealthy = diseaseName.toLowerCase().includes('healthy');
      const confidencePercent = (topResult.score * 100).toFixed(1);

      // Transform HF output into our exact UI schema
      return NextResponse.json({
        summary: {
          crop_name: cropName,
          disease_name: diseaseName,
          status: isHealthy ? "Healthy" : "Infected",
          confidence: `${confidencePercent}%`,
          severity: isHealthy ? "None" : "Needs Review",
          badge: isHealthy ? "Healthy" : "Action Required"
        },
        breakdown: {
          immediate_action: { title: "Immediate Action", description: isHealthy ? "No action needed." : `Isolate the ${cropName} plant to prevent potential spread.` },
          organic_treatment: { title: "Organic Treatment", description: isHealthy ? "Maintain standard watering schedules." : `Consult local ag-extension for organic remedies specific to ${diseaseName}.` },
          chemical_treatment: { title: "Chemical Treatment", description: isHealthy ? "Not required." : `Fungicide or pesticide may be required depending on ${diseaseName} severity.` },
          prevention: { title: "Future Prevention", description: "Ensure proper spacing, crop rotation, and avoid overhead watering." }
        }
      });
    }

    // ==========================================
    // ROUTE 2: GOOGLE GEMINI (Default)
    // ==========================================
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

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

    const imagePart = { inlineData: { data: base64Data, mimeType: file.type } };
    const result = await model.generateContent([prompt, imagePart]);
    return NextResponse.json(JSON.parse(result.response.text()));

  } catch (error: any) {
    if (error.message?.includes('fetch failed') || error.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Connection to the vision service timed out. Please check your internet connection and try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred while analyzing the crop. Please try again.' }, { status: 500 });
  }
}