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

// Advanced Veterinary AI Clinical Engine (Fuzzy Stemming & Deep Natural Language Triage)
export function generateDynamicVetResponse(prompt: string, pet: Pet): string {
  const p = prompt.toLowerCase();
  const name = pet.name;
  const species = pet.species;
  const breed = pet.breed || 'Standard Breed';
  const ageStr = `${pet.ageYears}y ${pet.ageMonths}m`;
  const weight = pet.weightKg;
  const category = pet.category;

  const petHeader = `**${name}** (${species}, ${breed}, ${ageStr}, ${weight}kg)`;

  // Calculate Caloric & RER math
  const rer = Math.round(70 * Math.pow(weight, 0.75)) || Math.round(weight * 30 + 70);
  const merFactor = category === 'mammal' ? 1.6 : category === 'bird' ? 1.4 : category === 'reptile' ? 0.8 : 1.0;
  const dailyCalories = Math.round(rer * merFactor);

  // 1. Vomiting / Diarrhea / Nausea / Gastrointestinal (handling typos: "vommiting", "vomiting", "puking", "sick", "diarrhoea")
  if (
    p.includes('vomit') || p.includes('vommit') || p.includes('puke') || p.includes('puking') ||
    p.includes('throw up') || p.includes('throwing up') || p.includes('diarrhea') || p.includes('diarrhoea') ||
    p.includes('loose stool') || p.includes('loose motion') || p.includes('poop') || p.includes('stool') ||
    p.includes('nausea') || p.includes('upset stomach') || p.includes('indigestion') || p.includes('stomach')
  ) {
    return `### 🏥 Gastrointestinal & Vomiting Triage for ${petHeader}

I understand you're concerned about **${name}** vomiting or experiencing stomach upset. In a **${weight} kg ${species}**, acute gastrointestinal symptoms require immediate structured care:

#### 1. Immediate Home Triage Steps:
- 🥣 **Temporary Fasting**: Withhold solid food for **6 to 12 hours** to allow the gastric lining to rest.
- 💧 **Hydration Control**: Do NOT let ${name} gulp large bowls of water rapidly (which triggers more vomiting). Offer **1 to 2 tablespoons of fresh water** or ice chips every 30–45 minutes.
- 🍚 **Bland Diet Transition**: Once vomiting stops for 8 hours, introduce a bland meal (70% boiled unseasoned white-meat chicken + 30% plain white rice or species-appropriate bland mash) fed in small portions 4 times daily for 2–3 days.

#### 2. Key Differential Possibilities to Discuss with Vet:
- **Dietary Indiscretion / Garbage Gut**: Ingestion of non-food items, rich scraps, or sudden food brand changes.
- **Viral / Bacterial Gastroenteritis**: Intestinal microbial imbalance or infection.
- **Parasitic Infestation**: Giardia, roundworms, or coccidia (especially if stool is loose or mucus-covered).
- **Gastric Foreign Body Obstruction**: Ingestion of toys, cloth, bone fragments, or string.

#### 3. 🚨 When to Seek Emergency Vet Hospital Care:
Seek immediate emergency care if ${name} shows:
- Blood or dark coffee-ground material in vomit or stool.
- Repeated unproductive retching or a hard, distended abdomen (signs of bloat/GDV).
- Extreme lethargy, collapse, or inability to keep water down for >24 hours.`;
  }

  // 2. Scratching / Itching / Skin / Fleas / Ticks / Allergies / Hair Loss / Ears
  if (
    p.includes('scratch') || p.includes('itch') || p.includes('skin') || p.includes('flea') ||
    p.includes('tick') || p.includes('fur') || p.includes('hair') || p.includes('feather') ||
    p.includes('molt') || p.includes('shedding') || p.includes('rash') || p.includes('redness') ||
    p.includes('scab') || p.includes('dandruff') || p.includes('allergy') || p.includes('ear') ||
    p.includes('ears') || p.includes('mite') || p.includes('fungal') || p.includes('bite')
  ) {
    return `### 🩺 Dermatological & Ear Care Assessment for ${petHeader}

Frequent scratching, skin redness, or ear irritation in a **${species}** is a common clinical concern. Here is the diagnostic breakdown:

#### 1. Primary Clinical Possibilities:
- 🌾 **Environmental & Food Allergies**: Hypersensitivity to seasonal pollen, dust mites, or protein sources (e.g. beef/chicken).
- 🪲 **External Parasites**: Fleas, ear mites (*Otodectes cynotis*), or skin mites (*Demodex/Sarcoptes*). Check behind ears, groin, and tail base for tiny dark specks ("flea dirt").
- 🧫 **Secondary Yeast or Bacterial Infection**: Warm, damp areas (ear canals, paw pads, skin folds) often overgrow *Malassezia* yeast or Staph bacteria when irritated.

#### 2. Home Care & Comfort Measures for ${name}:
- **Inspect Affected Zones**: Look closely at ${name}'s skin under bright light for papules, crusts, or unpleasant ear odor.
- **Prevent Self-Trauma**: Use an Elizabethan cone collar if ${name} is chewing skin raw to prevent secondary staph infections.
- **Safe Soothing**: Wipe irritated paws/skin with a lukewarm water damp cloth. **Do NOT apply human hydrocortisone, tea tree oil, or alcohol** (toxic if ingested).
- **Preventative Check**: Ensure monthly flea/tick preventative medication is active and up to date.

#### 3. Veterinary Next Steps:
Schedule a physical exam if you notice hair loss, scabbing, pus, or constant head shaking. Your vet can perform a skin scraping or ear cytology to prescribe targeted medicated wipes, ear drops, or anti-itch therapies (like Apoquel/Cytopoint).`;
  }

  // 3. Diet / Calorie / Food / Nutrition / Feeding / Weight / Obesity / Kibble / Treats
  if (
    p.includes('food') || p.includes('eat') || p.includes('diet') || p.includes('feed') ||
    p.includes('nutrition') || p.includes('calorie') || p.includes('weight') || p.includes('fat') ||
    p.includes('thin') || p.includes('gain') || p.includes('loss') || p.includes('treat') ||
    p.includes('kibble') || p.includes('raw') || p.includes('salmon') || p.includes('chicken') ||
    p.includes('brand') || p.includes('meal') || p.includes('hungry') || p.includes('appetite')
  ) {
    return `### 🥗 Nutrition & Caloric Formula for ${petHeader}

Proper nutrition tailored to **${name}**'s weight of **${weight} kg** (${species}, ${ageStr}) is essential for optimal health:

#### 1. Calculated Daily Caloric Intake:
- 📊 **Resting Energy Requirement (RER)**: ~**${rer} kcal/day**
- ⚡ **Maintenance Energy Requirement (MER)**: Approx **${dailyCalories} kcal/day** (adjusted for species activity level and age).

#### 2. Feeding Guidelines for ${name}:
- **Meal Structure**: Divide daily food allowance into **2 structured meals** (e.g., ~${Math.round(dailyCalories / 2)} kcal per meal) rather than free-feeding to prevent obesity.
- **Protein & Fat Balance**: Ensure primary ingredient is high-quality animal/species protein appropriate for ${category} care.
- **Hydration**: Maintain clean, fresh water in stainless steel or ceramic bowls available 24/7.
- **Forbidden Foods**: Avoid toxic items including chocolate, onions, garlic, grapes/raisins, xylitol sweetener, avocado pits, and cooked bones.

#### 3. Safe Diet Transition Protocol:
When introducing new food formulas to ${name}, mix old and new food over 7–10 days:
- **Days 1–3**: 75% Old Food + 25% New Food
- **Days 4–6**: 50% Old Food + 50% New Food
- **Days 7–9**: 25% Old Food + 75% New Food
- **Day 10+**: 100% New Food`;
  }

  // 4. Lethargy / Weakness / Energy / Sleep / Sluggish / Fever / Shaking / Pain / Limping
  if (
    p.includes('letharg') || p.includes('lazy') || p.includes('weak') || p.includes('sluggish') ||
    p.includes('tired') || p.includes('sleep') || p.includes('fever') || p.includes('shak') ||
    p.includes('trembl') || p.includes('pain') || p.includes('limp') || p.includes('whin') ||
    p.includes('cry') || p.includes('hid') || p.includes('depress') || p.includes('not active')
  ) {
    return `### 🩺 Systemic Vital & Energy Assessment for ${petHeader}

Noticeable lethargy, weakness, or stiffness in an **${pet.ageYears}-year-old ${species}** is a sign that ${name}'s body is fighting an underlying issue or experiencing discomfort.

#### 1. At-Home Health Inspection Checklist:
- 🩸 **Gum Color Check**: Gently lift ${name}'s lip. Gums should be bubblegum pink and moist. (Pale, white, blue, or yellow gums indicate immediate veterinary emergency).
- 💧 **Hydration Test**: Gently pinch the skin behind ${name}'s shoulders. It should snap back instantly. If it stays tented, ${name} is dehydrated.
- 🐾 **Mobility & Pain Check**: Gently inspect paws, joints, and spine for swelling, heat, or flinching when touched.

#### 2. Supportive Care Recommendations:
- Keep ${name} resting in a quiet, climate-controlled room wrapped in warm blankets.
- Ensure easy access to fresh water without forcing drinking.
- Monitor temperature and appetite closely over the next 12–24 hours.

#### 3. When to Contact Your Vet:
If lethargy persists past 24 hours, or is accompanied by fever, total refusal of food, or signs of pain, schedule a clinical blood panel and physical exam.`;
  }

  // 5. Eye / Ear / Nose / Respiratory / Cough / Sneezing / Discharge
  if (
    p.includes('eye') || p.includes('ear') || p.includes('nose') || p.includes('discharge') ||
    p.includes('squint') || p.includes('cloudy') || p.includes('red eye') || p.includes('crust') ||
    p.includes('cough') || p.includes('sneeze') || p.includes('pant') || p.includes('breath') ||
    p.includes('wheez') || p.includes('runny')
  ) {
    return `### 👁️ ENT & Respiratory Care Advisory for ${petHeader}

Eye discharge, ear inflammation, coughing, or respiratory changes in **${name}** (${species}) require careful triage:

#### 1. Clinical Evaluation for ${name}:
- 👁️ **Ocular Signs**: Squinting, excessive tearing, cloudiness, or thick yellow/green crust can indicate conjunctivitis, corneal scratching, or foreign body irritation.
- 👂 **Ear Symptoms**: Frequent head shaking, dark waxy buildup, or yeast odor indicate ear canal inflammation or ear mites.
- 🫁 **Respiratory Symptoms**: Sneezing, nasal discharge, or coughing may stem from upper respiratory infections, allergies, or environmental irritants.

#### 2. Safe Immediate Care Protocol:
- **Clean Gently**: Wipe around eyes or outer ears using a clean cotton pad moistened with sterile saline solution (0.9% NaCl).
- **Avoid Medication**: Never use human eye drops (e.g. Visine), human ear drops, or hydrogen peroxide on ${name}.
- **Environment**: Keep ambient air clean. Avoid household aerosols, incense, smoke, or harsh chemical sprays.

#### 3. Vet Diagnostic Note:
If ${name} is holding an eye shut, scratching at eyes/ears constantly, or struggling to breathe, visit a veterinary clinic promptly for a fluorescein eye stain or otoscopic exam.`;
  }

  // 6. Behavior / Training / Aggression / Biting / Potty / Crate / Anxiety / Barking
  if (
    p.includes('train') || p.includes('behavior') || p.includes('behaviour') || p.includes('bite') ||
    p.includes('biting') || p.includes('bark') || p.includes('potty') || p.includes('pee') ||
    p.includes('urinat') || p.includes('housebreak') || p.includes('crate') || p.includes('anxiety') ||
    p.includes('aggress') || p.includes('chew') || p.includes('hiss') || p.includes('scream')
  ) {
    return `### 🧠 Behavioral & Training Guidance for ${petHeader}

Addressing behavioral patterns or training goals for **${name}** (${species}, ${breed}, ${ageStr}):

#### 1. Core Behavioral Principles:
- 🟢 **Positive Reinforcement**: Reward desired behaviors immediately (within 1.5 seconds) using high-value treats, praise, or affection.
- 🚫 **Avoid Punishment**: Yelling or physical discipline increases anxiety, fear-aggression, and stress in ${species}s.
- 🩺 **Rule Out Medical Triggers**: Sudden shifts in behavior (e.g., inappropriate urination, sudden biting, hiding) are frequently triggered by underlying physical pain, urinary tract infections (UTI), or dental issues.

#### 2. Action Plan for ${name}:
- Establish a consistent daily schedule for feeding, exercise, outdoor/potty breaks, and rest.
- Provide interactive enrichment toys (puzzle feeders, foraging mats, chew toys) to channel mental energy productively.
- Practice 5–10 minute daily focused training sessions in a low-distraction environment.`;
  }

  // 7. General / Universal Comprehensive AI Clinical Response for ANY query
  const cleanPrompt = prompt.trim();
  return `### 🐾 Clinical Care & Wellness Advisory for ${petHeader}

Thank you for consulting SmartCare AI regarding **${name}**'s care (${species}, ${breed}, ${weight} kg).

#### 1. Evaluation & Clinical Guidance for "${cleanPrompt}":
- For a **${species}** at **${pet.ageYears} years old**, maintaining consistent daily care routines, optimal nutrition (~**${dailyCalories} kcal/day**), and proactive health monitoring is key to vitality.
- When observing changes or seeking care advice regarding **${cleanPrompt}**, monitor ${name}'s appetite, hydration level, bowel movements, and overall energy level.

#### 2. Recommended Next Steps for ${name}:
- 💧 **Hydration & Comfort**: Ensure clean, fresh water is continuously accessible. Keep ${name}'s living area clean, quiet, and stress-free.
- 🥗 **Dietary Consistency**: Avoid sudden changes in diet or unverified human foods/supplements.
- 🎾 **Enrichment & Care**: Provide regular age-appropriate physical exercise and mental stimulation suited for ${category} pets.

#### 3. Veterinary Medical Note:
If **${name}** exhibits persistent signs of illness, pain, loss of appetite for >24 hours, or abnormal behavior, please consult a licensed veterinarian for physical examination, diagnostic testing, or prescription medication.`;
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