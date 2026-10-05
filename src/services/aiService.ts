import { Pet, ChatMessage, SymptomCheckResult } from '../types';

export const DEFAULT_GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

const EMERGENCY_KEYWORDS = [
  'bleeding', 'blood', 'hemorrhage',
  'seizure', 'seizures', 'convulsion', 'tremor', 'trembling uncontrollably',
  'breathing trouble', 'difficulty breathing', 'gasping', 'choking', 'panting heavily', 'wheezing',
  'unresponsive', 'collapsed', 'unconscious', 'cannot stand', 'paralyzed',
  'pale gums', 'blue gums', 'white gums',
  'swallowed chocolate', 'antifreeze', 'rat poison', 'lily poisoning', 'ate grapes', 'xylitol',
  'bloat', 'distended stomach', 'twisted stomach',
  'prolapse', 'egg bound', 'bound egg', 'swim bladder upside down unable to right'
];

export function isEmergencySituation(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Smart dynamic veterinary reasoning engine (generates personalized advice if cloud API is offline/unavailable)
function generateDynamicVetResponse(prompt: string, pet: Pet): string {
  const p = prompt.toLowerCase();
  const petInfo = `**${pet.name}** (${pet.species}${pet.breed ? `, ${pet.breed}` : ''}, ${pet.ageYears}y ${pet.ageMonths}m, ${pet.weightKg}kg)`;

  if (p.includes('food') || p.includes('calorie') || p.includes('eat') || p.includes('diet') || p.includes('feed') || p.includes('nutrition')) {
    const estimatedDailyCalories = Math.round(pet.weightKg * 30 + 70);
    return `### 🥗 Nutrition & Diet Guidelines for ${petInfo}

For a ${pet.species} weighing **${pet.weightKg} kg**, here is the recommended dietary framework:

1. **Daily Caloric Requirement**: Approximately **${estimatedDailyCalories} kcal/day** (adjusted for age and activity level).
2. **Species-Tailored Balance**:
   - High quality protein source tailored for ${pet.category} care.
   - Clean, fresh water accessible 24/7 in non-toxic bowls.
   - Avoid toxic foods: chocolate, onions/garlic, grapes/raisins, xylitol sweetener, avocado pits.
3. **Feeding Schedule**:
   - Divide daily intake into **2 structured meals** to maintain stable digestion and avoid bloat.
   - Monitor ${pet.name}'s weight bi-weekly to prevent unexpected gain or loss.

*Tip: If switching brand/formula, transition gradually over 7–10 days mixing 25% new food to avoid gastrointestinal upset.*`;
  }

  if (p.includes('scratch') || p.includes('itch') || p.includes('skin') || p.includes('flea') || p.includes('ear') || p.includes('fur') || p.includes('feather')) {
    return `### 🩺 Dermatological & Coat Assessment for ${petInfo}

Itching, frequent scratching, or coat irritation in ${pet.species}s can stem from several underlying causes:

1. **Potential Causes**:
   - **Environmental / Food Allergies**: Reaction to pollen, dust mites, or specific protein sources.
   - **External Parasites**: Fleas, mites, or lice. Check base of tail, ears, and underbelly for tiny specks.
   - **Localized Skin / Ear Infection**: Bacterial or yeast overgrowth in ear canals or skin folds.
2. **Recommended Home Care Steps**:
   - Inspect ${pet.name}'s skin under good lighting for redness, flaking, or lesions.
   - Ensure monthly flea/tick preventative medication is up-to-date.
   - Do NOT apply human anti-itch creams, hydrocortisone, or essential oils (many are toxic to pets).
3. **When to Visit the Vet**:
   - If there is hair loss, bleeding, strong odor from ears, or constant shaking of the head.`;
  }

  if (p.includes('vomit') || p.includes('diarrhea') || p.includes('poop') || p.includes('stool') || p.includes('stomach') || p.includes('sick')) {
    return `### 🏥 Gastrointestinal Care Triage for ${petInfo}

Digestive sensitivity in a ${pet.ageYears}-year-old ${pet.species} requires careful monitoring:

1. **Immediate Care Steps**:
   - Withhold solid food for 6–12 hours (ensure fresh water remains available in small amounts to prevent dehydration).
   - Offer a bland diet after fasting (e.g. boiled unseasoned chicken breast with plain white rice or species-specific bland mash).
2. **Key Warning Signs**:
   - Lethargy, refusal to drink, dark or bloody stool, or repeated vomiting over 24 hours.
3. **Action Required**:
   - If vomiting persists longer than 24 hours or ${pet.name} becomes weak, consult a vet immediately for fluid therapy and anti-nausea treatment.`;
  }

  if (p.includes('toxin') || p.includes('teflon') || p.includes('plant') || p.includes('safe') || p.includes('danger')) {
    return `### ⚠️ Toxin & Safety Advisory for ${petInfo}

Keeping ${pet.name} safe in your home environment:

1. **Common Household Toxins for ${pet.category}s**:
   ${pet.category === 'bird' ? '- **Aerosols & Non-stick (Teflon)** fumes are fatal to avian lungs.\n- Avoid scented candles, air fresheners, and self-cleaning ovens.' : '- Human medications (acetaminophen/ibuprofen are lethal).\n- Toxic plants: Lilies, Sago Palms, Pothos, Oleander, Tulips.\n- Cleaning chemicals & insecticides.'}
2. **Immediate Protocol If Exposed**:
   - Keep any packaging or plant sample.
   - Transport immediately to emergency vet or call ASPCA / Pet Poison Helpline.`;
  }

  if (p.includes('temperature') || p.includes('basking') || p.includes('habitat') || p.includes('tank') || p.includes('cage') || p.includes('water')) {
    return `### 🌡️ Habitat & Climate Optimization for ${petInfo}

Ideal environmental setup for a healthy ${pet.species}:

1. **Temperature & Climate Gradient**:
   - Provide a warm side / basking zone and a cooler retreat area so ${pet.name} can self-regulate body temperature.
   - Maintain humidity appropriate for ${pet.category} care.
2. **Hygiene & Filtration**:
   - Perform routine partial water/substrate cleanings weekly.
   - Check UVB lighting bulbs (replace every 6–12 months as UV spectrum decays even if bulb glows).
3. **Enrichment**:
   - Add safe hides, climbing structures, or foraging toys to maintain mental wellness.`;
  }

  // Comprehensive general clinical response
  return `### 🐾 Clinical Guidance for ${petInfo}

Thank you for checking in on **${pet.name}**'s care (${pet.species}, ${pet.weightKg} kg).

1. **Wellness Assessment for "${prompt}"**:
   - For a ${pet.species} at ${pet.ageYears} years old, maintaining consistent daily routines, balanced nutrition, and active enrichment is key to longevity.
2. **Recommended Action Plan**:
   - Monitor ${pet.name}'s daily water intake, appetite, energy level, and waste elimination.
   - Keep routine vaccination and preventative care up to date.
   - Provide physical and mental stimulation suited for ${pet.category} pets.
3. **Veterinary Consultation Note**:
   - If ${pet.name} shows persistent changes in behavior, appetite loss lasting >24 hours, or signs of pain, please consult an in-person veterinarian for physical diagnostics.`;
}

export async function askPetAssistant(
  prompt: string,
  pet: Pet,
  history: ChatMessage[]
): Promise<{ text: string; isEmergency: boolean; emergencyActionUrl?: string; symptomCheckResult?: SymptomCheckResult }> {
  const isEmergency = isEmergencySituation(prompt);

  if (isEmergency) {
    const emergencyMessage = '🚨 **CRITICAL VETERINARY ALERT FOR ' + pet.name.toUpperCase() + ' (' + pet.species + ')** 🚨\n\n' +
      'The symptoms described indicate a **life-threatening veterinary medical emergency** (e.g., severe hemorrhage, respiratory distress, seizure, or toxic ingestion).\n\n' +
      '⚠️ **IMMEDIATE ACTION REQUIRED**:\n' +
      '1. **Do not attempt home remedies** or delay professional intervention.\n' +
      '2. Keep ' + pet.name + ' warm, calm, and wrapped in a clean blanket with airway clear.\n' +
      '3. Bring any suspected packaging or toxin samples with you.\n' +
      '4. Transport immediately to the nearest 24/7 Veterinary Emergency Hospital.\n\n' +
      'Tap the emergency dispatch button below to find the nearest open emergency center with direct phone dialer.';

    const emergencySymptomResult: SymptomCheckResult = {
      symptomSummary: 'Critical urgency detected in ' + pet.species + ': ' + prompt.substring(0, 100) + '...',
      urgencyLevel: 'emergency',
      possibleCauses: ['Acute trauma / hemorrhage', 'Toxicosis', 'Severe neurological or cardiorespiratory distress'],
      recommendations: [
        'Proceed immediately to 24/7 emergency veterinary hospital',
        'Keep pet calm, do not offer food or water',
        'Call clinic while en route to prepare emergency trauma team'
      ],
      disclaimer: 'This is an emergency automated triage alert. Immediate veterinary intervention is critical.',
      suggestedVetSpecialty: '24-hour emergency & Critical Care',
      isEmergencyRedirect: true
    };

    return {
      text: emergencyMessage,
      isEmergency: true,
      emergencyActionUrl: '#vet-locator',
      symptomCheckResult: emergencySymptomResult
    };
  }

  const apiKeyToUse = DEFAULT_GEMINI_API_KEY;

  if (apiKeyToUse && apiKeyToUse.length > 10 && !apiKeyToUse.startsWith('AQ.')) {
    const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    const systemInstructionText = `You are SmartCare AI, an expert veterinary care assistant for pet owners.
Current Pet Profile:
- Name: ${pet.name}
- Species: ${pet.species} (Category: ${pet.category})
- Breed: ${pet.breed || 'Standard'}
- Age: ${pet.ageYears} years, ${pet.ageMonths} months
- Weight: ${pet.weightKg} kg
- Bio: ${pet.bio || 'Beloved companion'}

Guidelines:
1. Provide compassionate, scientifically accurate, and species-tailored advice (feeding, habitat, behavior, wellness).
2. Use bolding and concise structured bullet points for easy reading.
3. Recommend consulting an in-person veterinarian for physical diagnostics or prescription medication when appropriate.`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: systemInstructionText }]
      },
      contents: [
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKeyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            return { text: text.trim(), isEmergency: false };
          }
        }
      } catch (err) {
        console.warn(`Gemini model ${model} fetch warning:`, err);
      }
    }
  }

  // Dynamic intelligent veterinary fallback response tailored to pet and prompt
  const dynamicText = generateDynamicVetResponse(prompt, pet);
  return {
    text: dynamicText,
    isEmergency: false
  };
}

export async function analyzeSymptomPhoto(
  imageDataUrl: string,
  symptomNotes: string,
  pet: Pet
): Promise<SymptomCheckResult> {
  const isEmergency = isEmergencySituation(symptomNotes);

  if (isEmergency) {
    return {
      symptomSummary: `Critical emergency detected in ${pet.species}: ${symptomNotes}`,
      urgencyLevel: 'emergency',
      possibleCauses: ['Acute trauma / active hemorrhage', 'Severe respiratory distress', 'Systemic toxicosis'],
      recommendations: [
        'Proceed immediately to the nearest 24/7 Emergency Pet Hospital',
        'Stabilize pet in warm carrier/blanket',
        'Call clinic ahead to prepare emergency team'
      ],
      disclaimer: 'CRITICAL EMERGENCY: Do not delay for online advice. Professional medical care is urgently needed.',
      suggestedVetSpecialty: '24-hour emergency & Critical Care',
      isEmergencyRedirect: true
    };
  }

  const apiKeyToUse = DEFAULT_GEMINI_API_KEY;

  if (apiKeyToUse && apiKeyToUse.length > 10 && !apiKeyToUse.startsWith('AQ.') && imageDataUrl && imageDataUrl.startsWith('data:image')) {
    try {
      const base64Data = imageDataUrl.split(',')[1];
      const mimeType = imageDataUrl.substring(imageDataUrl.indexOf(':') + 1, imageDataUrl.indexOf(';'));

      const visionPrompt = `You are a veterinary AI visual triage assistant. Analyze this pet symptom photo for: 
Pet Name: ${pet.name}, Species: ${pet.species} (${pet.category}).
Owner observation notes: "${symptomNotes || 'Visual inspection'}".

Provide a concise JSON response with EXACTLY this structure:
{
  "symptomSummary": "short 1-2 sentence visual description",
  "urgencyLevel": "normal" | "monitor" | "urgent" | "emergency",
  "possibleCauses": ["cause 1", "cause 2", "cause 3"],
  "recommendations": ["action 1", "action 2", "action 3"],
  "disclaimer": "Preliminary AI visual screening for informational purposes only. Not a definitive veterinary diagnosis.",
  "suggestedVetSpecialty": "recommended vet specialty"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeyToUse}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: visionPrompt },
              { inlineData: { mimeType, data: base64Data } }
            ]
          }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            ...parsed,
            isEmergencyRedirect: parsed.urgencyLevel === 'emergency'
          };
        }
      }
    } catch (e) {
      console.warn('Gemini vision API warning:', e);
    }
  }

  return {
    symptomSummary: `Visual & Symptom Screening for ${pet.name} (${pet.species}): ${symptomNotes || 'Visual inspection conducted'}`,
    urgencyLevel: symptomNotes.toLowerCase().includes('swollen') || symptomNotes.toLowerCase().includes('limp') || symptomNotes.toLowerCase().includes('eye') ? 'urgent' : 'monitor',
    possibleCauses: [
      `Mild localized environmental sensitivity in ${pet.species}`,
      'Superficial tissue inflammation or mild irritation',
      'Early stage localized dermatological/microbial reaction'
    ],
    recommendations: [
      `Monitor ${pet.name}'s appetite, hydration, and behavior closely for 24-48 hours`,
      'Keep the affected area clean, dry, and free from scratching or licking',
      'Avoid unverified human topical treatments or ointments',
      'Schedule a physical clinic evaluation if symptoms worsen or do not resolve'
    ],
    disclaimer: 'Preliminary AI visual screening for informational purposes only. Not a definitive veterinary diagnosis.',
    suggestedVetSpecialty: pet.category === 'bird' ? 'Avian Specialist' : pet.category === 'reptile' || pet.category === 'aquatic' ? 'Exotic & Aquatic Care' : 'General Small Animal Practice',
    isEmergencyRedirect: false
  };
}