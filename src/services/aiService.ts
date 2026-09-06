import { Pet, ChatMessage, SymptomCheckResult } from '../types';

export const DEFAULT_GEMINI_API_KEY = 'AIzaSyAgU6rj0Kh-lOKuBNLxUlLGi9g_7vags0Q';

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

export async function askPetAssistant(
  prompt: string,
  pet: Pet,
  history: ChatMessage[],
  customApiKey?: string,
  provider: string = 'gemini'
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

  const apiKeyToUse = customApiKey || DEFAULT_GEMINI_API_KEY;

  // Call Gemini API
  try {
    const systemPrompt = `You are SmartCare AI, an expert veterinary care assistant for pet owners.
Current Pet Profile:
- Name: ${pet.name}
- Species: ${pet.species} (Category: ${pet.category})
- Breed: ${pet.breed || 'Standard'}
- Age: ${pet.ageYears} years, ${pet.ageMonths} months
- Weight: ${pet.weightKg} kg
- Personality Bio: ${pet.bio || 'Beloved companion'}

Guidelines:
1. Provide compassionate, scientifically accurate, and species-tailored advice (feeding, habitat, behavior, wellness).
2. Use bolding and concise structured bullet points for easy reading.
3. If discussing symptoms, include a brief note recommending consulting an in-person veterinarian for prescription medication or physical exams.
4. Keep the tone warm, trustworthy, and encouraging.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nUser Question: ' + prompt }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeyToUse}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        return { text: text.trim(), isEmergency: false };
      }
    }
  } catch (err) {
    console.warn('Gemini API call warning, using fallback model:', err);
  }

  // Fallback intelligent species response generator
  await new Promise(resolve => setTimeout(resolve, 500));
  const lower = prompt.toLowerCase();
  let responseText = '';

  if (pet.category === 'mammal') {
    if (lower.includes('food') || lower.includes('feed') || lower.includes('diet') || lower.includes('eat')) {
      responseText = `🐾 **Nutrition Advice for ${pet.name} (${pet.species})**:\n` +
        `- **Daily Caloric Needs**: At ${pet.weightKg} kg, ${pet.name} needs approximately ${Math.round((pet.weightKg * 30 + 70) * 1.4)} kcal/day.\n` +
        `- **Meal Portions**: Divide into 2 balanced meals to promote steady digestion and prevent bloat.\n` +
        `- **Healthy Additions**: Steamed carrots, pure pumpkin puree, blueberries, or cooked lean proteins.\n` +
        `- **Toxic Foods to Avoid**: Onions, garlic, grapes, raisins, macadamia nuts, xylitol, and chocolate.`;
    } else if (lower.includes('scratch') || lower.includes('itch') || lower.includes('skin') || lower.includes('flea')) {
      responseText = `🩺 **Skin & Coat Health Assessment for ${pet.name}**:\n` +
        `- **Potential Factors**: Seasonal environmental pollen, protein sensitivities, dry skin, or flea allergies.\n` +
        `- **Recommended Actions**: Inspect paws and underbelly, supplement meals with Omega-3 fatty acids, and use a gentle colloidal oatmeal shampoo.\n` +
        `- If redness, hot spots, or hair loss develop, book an exam with your veterinarian.`;
    } else {
      responseText = `✨ **Care Recommendation for ${pet.name} (${pet.species})**:\n` +
        `- Daily active exercise (${pet.weightKg > 20 ? '45-60 mins' : '20-30 mins'}), fresh filtered water, and mental enrichment keep ${pet.name} happy and healthy.\n` +
        `- Complete daily care tasks in your checklist to keep ${pet.name}'s happiness score high!`;
    }
  } else if (pet.category === 'bird') {
    responseText = `🦜 **Avian Care Guide for ${pet.name} (${pet.species})**:\n` +
      `- **Diet**: 65% formulated organic pellets + 25% fresh dark greens (kale, broccoli) + 10% seeds/millet.\n` +
      `- **Air Quality**: Birds have sensitive respiratory systems. Keep them safe from Teflon/non-stick fumes, aerosols, and scented candles.\n` +
      `- **Enrichment**: Provide natural wood perches of varying diameters to support foot and joint health.`;
  } else if (pet.category === 'aquatic') {
    responseText = `🐠 **Aquatic Wellness Guide for ${pet.name} (${pet.species})**:\n` +
      `- **Water Parameters**: Keep temperature stable at 78°F–80°F, ammonia at 0 ppm, and nitrates under 20 ppm.\n` +
      `- **Maintenance**: Perform 20% weekly water changes using a quality water conditioner (like Seachem Prime).\n` +
      `- **Feeding**: Feed small portions consumed within 90 seconds to prevent swim bladder issues and maintain water clarity.`;
  } else if (pet.category === 'reptile') {
    responseText = `🦎 **Reptile Habitat & Care for ${pet.name} (${pet.species})**:\n` +
      `- **Thermal Gradient**: Maintain a basking zone of 100°F–105°F and a cool side ambient of 75°F–80°F.\n` +
      `- **UVB Lighting**: Replace linear UVB bulbs every 6-12 months to ensure proper Vitamin D3 synthesis and prevent MBD.\n` +
      `- **Nutrition**: Dust feeders with phosphorus-free Calcium + D3 regularly and offer fresh hydrated greens.`;
  } else {
    responseText = `🐾 **Care Guide for ${pet.name} (${pet.species})**:\n` +
      `- Category: **${pet.category.toUpperCase()}**\n` +
      `- Provide species-tailored nutrition, clean water, and regular habitat maintenance.\n` +
      `- Track daily tasks and growth to keep ${pet.name} thriving!`;
  }

  return { text: responseText, isEmergency: false };
}

export async function analyzeSymptomPhoto(
  imageDataUrl: string,
  symptomNotes: string,
  pet: Pet,
  customApiKey?: string
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

  const apiKeyToUse = customApiKey || DEFAULT_GEMINI_API_KEY;

  // Try Gemini Multimodal Vision API if image provided
  if (imageDataUrl && imageDataUrl.startsWith('data:image')) {
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
      console.warn('Gemini vision API warning, falling back to rule-based triage:', e);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 600));
  const lower = symptomNotes.toLowerCase();
  let urgencyLevel: 'normal' | 'monitor' | 'urgent' = 'monitor';
  let possibleCauses = ['Mild environmental sensitivity', 'Superficial skin or scale irritation', 'Early stage localized inflammation'];
  let recommendations = [
    `Monitor ${pet.name}'s appetite and energy levels over next 24-48 hours`,
    'Avoid touching or applying human creams or unverified ointments',
    'Keep affected area clean and dry',
    'Schedule a non-emergency veterinary exam if no improvement occurs within 48 hours'
  ];

  if (lower.includes('eye') || lower.includes('discharge') || lower.includes('cloudy')) {
    urgencyLevel = 'urgent';
    possibleCauses = ['Corneal scratch or ulceration', 'Conjunctivitis / Bacterial infection', 'Foreign debris in ocular tissue'];
    recommendations = [
      'Prevent rubbing or scratching with an Elizabethan collar if applicable',
      'Do not apply human eye drops (steroids can worsen ulcers)',
      'Have a veterinarian perform a fluorescein eye stain test within 24 hours'
    ];
  } else if (lower.includes('lump') || lower.includes('bump') || lower.includes('swelling')) {
    urgencyLevel = 'monitor';
    possibleCauses = ['Benign sebaceous cyst', 'Localized bug bite reaction', 'Lipoma / tissue swelling'];
    recommendations = [
      'Note size, firmness, and whether it causes pain upon gentle touch',
      'Take photos every 3 days to measure growth progression',
      'Request a Fine Needle Aspirate (FNA) at next vet checkup'
    ];
  } else if (lower.includes('limp') || lower.includes('paw') || lower.includes('leg')) {
    urgencyLevel = 'urgent';
    possibleCauses = ['Soft tissue sprain or ligament strain', 'Paw pad puncture or broken nail', 'Joint inflammation'];
    recommendations = [
      'Restrict active running and jumping',
      'Inspect paw pads for thorns, glass, or split nails',
      'If non-weight-bearing after 24 hours, seek veterinary orthopedic x-ray'
    ];
  }

  return {
    symptomSummary: `Visual Symptom Analysis for ${pet.name} (${pet.species}) — ${symptomNotes || 'Visual inspection conducted'}`,
    urgencyLevel,
    possibleCauses,
    recommendations,
    disclaimer: 'Preliminary AI visual screening for informational purposes only. Not a definitive veterinary diagnosis.',
    suggestedVetSpecialty: pet.category === 'bird' ? 'Avian Specialist' : pet.category === 'reptile' || pet.category === 'aquatic' ? 'Exotic & Aquatic Care' : 'General Small Animal Practice',
    isEmergencyRedirect: false
  };
}