export const maxDuration = 60;
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
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // ==========================================
    // ROUTE 1: PLANT.ID (Kindwise API v3)
    // ==========================================
    if (provider === 'plantid') {
      const plantIdResponse = await fetch(
        "https://plant.id/api/v3/identification?details=treatment,description,common_names",
        {
          method: "POST",
          headers: {
            "Api-Key": process.env.PLANT_ID_API_KEY || '',
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: [base64Data],
            health: "all", // This ensures we get BOTH the crop name and the disease assessment
          }),
        }
      );

      if (!plantIdResponse.ok) {
        const errorData = await plantIdResponse.json().catch(() => ({}));
        throw new Error(`Plant.id Error: ${errorData.error || plantIdResponse.statusText}`);
      }

      const plantData = await plantIdResponse.json();
      
      // 1. Parse Plant.id Classification (Top Result)
      const topClassification = plantData.result?.classification?.suggestions?.[0];
      // Use common name if available, otherwise fallback to scientific name
      const cropName = topClassification?.details?.common_names?.[0] || topClassification?.name || "Unknown Plant";
      const classificationConfidence = topClassification?.probability 
        ? (topClassification.probability * 100).toFixed(1) 
        : "Unknown";

      // 2. Parse Plant.id Health Assessment (v3 Structure)
      const isHealthy = plantData.result?.is_healthy?.binary ?? true;
      
      let diseaseName = "Healthy";
      let severity = "None";
      let status = "Healthy";
      
      // Default fallback text
      let immediateActionDesc = isHealthy ? "No action needed." : `Inspect the ${cropName} closely for signs of disease and isolate if necessary.`;
      let organicTreatmentDesc = isHealthy ? "Maintain standard care." : "Check local agricultural guidelines for organic treatments.";
      let chemicalTreatmentDesc = isHealthy ? "Not required." : "Consider targeted fungicides or pesticides.";
      let preventionDesc = "Maintain proper airflow, monitor humidity, and avoid overhead watering.";

      // If a disease is detected, extract the top suggestion
      const diseaseSuggestions = plantData.result?.disease?.suggestions || [];
      
      if (!isHealthy && diseaseSuggestions.length > 0) {
        const topDisease = diseaseSuggestions[0];
        diseaseName = topDisease.name;
        severity = "Action Required";
        status = "Infected";

        // 3. Extract the detailed treatment info returned by Plant.id API
        const details = topDisease.details || {};
        
        if (details.description) {
            immediateActionDesc = details.description;
        }
        
        if (details.treatment) {
            organicTreatmentDesc = details.treatment.biological || organicTreatmentDesc;
            chemicalTreatmentDesc = details.treatment.chemical || chemicalTreatmentDesc;
            preventionDesc = details.treatment.prevention || preventionDesc;
        }
      }

      // Transform Plant.id output into our exact UI schema
      return NextResponse.json({
        summary: {
          crop_name: cropName,
          disease_name: diseaseName,
          status: status,
          confidence: `${classificationConfidence}%`,
          severity: severity,
          badge: isHealthy ? "Healthy" : "High Risk"
        },
        breakdown: {
          immediate_action: { 
            title: "Diagnosis & Description", 
            description: immediateActionDesc 
          },
          organic_treatment: { 
            title: "Organic / Biological Treatment", 
            description: organicTreatmentDesc 
          },
          chemical_treatment: { 
            title: "Chemical Treatment", 
            description: chemicalTreatmentDesc 
          },
          prevention: { 
            title: "Future Prevention", 
            description: preventionDesc 
          }
        }
      });
    }

    // ==========================================
    // ROUTE 2: HUGGING FACE INFERENCE API
    // ==========================================
    if (provider === 'huggingface') {
      const hfResponse = await fetch(
        "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
        {
          headers: { 
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": file.type 
          },
          method: "POST",
          body: arrayBuffer,
        }
      );

      if (!hfResponse.ok) {
        const errorData = await hfResponse.json().catch(() => ({}));
        if (hfResponse.status === 503 && errorData.estimated_time) {
          throw new Error(`The Hugging Face model is currently waking up. Please try again in about ${Math.ceil(errorData.estimated_time)} seconds.`);
        }
        throw new Error(`Hugging Face Error: ${errorData.error || hfResponse.statusText}`);
      }

      const hfData = await hfResponse.json();
      const topResult = hfData[0]; // Gets the highest confidence prediction

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
    // ROUTE 3: GOOGLE GEMINI (Default)
    // ==========================================
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
    console.log("error", error);
    if (error.message?.includes('fetch failed') || error.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Connection to the vision service timed out. Please check your internet connection and try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: error.message || 'An unexpected error occurred while analyzing the crop. Please try again.' }, { status: 500 });
  }
}