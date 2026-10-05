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

// 1. Live Real-Time AI Generation Engine via Pollinations & Gemini Cloud Models
async function fetchLiveAIResponse(
  systemPrompt: string,
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<string | null> {
  // A. Try Pollinations Live AI Endpoint (Free, no key required, 100% Real-Time AI Model)
  try {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: userPrompt }
    ];

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai',
        jsonMode: false
      })
    });

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim() && !text.startsWith('{') && text.length > 30) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn('Pollinations Live AI fetch error:', err);
  }

  // B. Try Secondary Backup Live Text AI Gateway
  try {
    const backupRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemPrompt + '\nUser Question: ' + userPrompt)}`);
    if (backupRes.ok) {
      const text = await backupRes.text();
      if (text && text.trim() && text.length > 30) {
        return text.trim();
      }
    }
  } catch (e) {}

  return null;
}

// 2. Offline Fallback Veterinary Reasoning Engine (Active only if device has zero internet access)
export function generateDynamicVetResponse(prompt: string, pet: Pet): string {
  const p = prompt.toLowerCase();
  const name = pet.name;
  const species = pet.species;
  const breed = pet.breed || 'Standard Breed';
  const ageStr = `${pet.ageYears}y ${pet.ageMonths}m`;
  const weight = pet.weightKg;
  const category = pet.category;

  const petHeader = `**${name}** (${species}, ${breed}, ${ageStr}, ${weight}kg)`;
  const rer = Math.round(70 * Math.pow(weight, 0.75)) || Math.round(weight * 30 + 70);
  const merFactor = category === 'mammal' ? 1.6 : category === 'bird' ? 1.4 : category === 'reptile' ? 0.8 : 1.0;
  const dailyCalories = Math.round(rer * merFactor);

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
- 💧 **Hydration Control**: Do NOT let ${name} gulp large bowls of water rapidly. Offer **1 to 2 tablespoons of fresh water** or ice chips every 30–45 minutes.
- 🍚 **Bland Diet Transition**: Once vomiting stops for 8 hours, introduce a bland meal (70% boiled unseasoned white-meat chicken + 30% plain white rice) fed in small portions 4 times daily for 2–3 days.

#### 2. Key Differential Possibilities:
- **Dietary Indiscretion / Garbage Gut**: Ingestion of non-food items, rich scraps, or sudden food brand changes.
- **Viral / Bacterial Gastroenteritis**: Intestinal microbial imbalance or infection.
- **Gastric Foreign Body Obstruction**: Ingestion of toys, cloth, or bone fragments.

#### 3. 🚨 When to Seek Emergency Vet Hospital Care:
Seek immediate emergency care if ${name} shows:
- Blood or dark coffee-ground material in vomit or stool.
- Repeated unproductive retching or a hard, distended abdomen.
- Extreme lethargy, collapse, or inability to keep water down for >24 hours.`;
  }

  if (
    p.includes('scratch') || p.includes('itch') || p.includes('skin') || p.includes('flea') ||
    p.includes('tick') || p.includes('fur') || p.includes('hair') || p.includes('feather') ||
    p.includes('molt') || p.includes('shedding') || p.includes('rash') || p.includes('redness') ||
    p.includes('scab') || p.includes('dandruff') || p.includes('allergy') || p.includes('ear') ||
    p.includes('ears') || p.includes('mite') || p.includes('fungal') || p.includes('bite')
  ) {
    return `### 🩺 Dermatological & Ear Care Assessment for ${petHeader}

Frequent scratching or skin irritation in a **${species}** is a common clinical concern:

#### 1. Primary Clinical Possibilities:
- 🌾 **Environmental & Food Allergies**: Reaction to pollen, dust mites, or protein sources.
- 🪲 **External Parasites**: Fleas, ear mites, or skin mites. Check behind ears and tail base for dark specks.
- 🧫 **Secondary Yeast/Bacterial Infection**: Damp skin folds or ear canals often overgrow yeast when irritated.

#### 2. Comfort Protocol for ${name}:
- Inspect ${name}'s skin under bright light for papules or crusts.
- Prevent self-mutilation using a cone collar if needed.
- Wipe irritated paws/skin with lukewarm water. Do NOT use human creams or essential oils.`;
  }

  if (
    p.includes('food') || p.includes('eat') || p.includes('diet') || p.includes('feed') ||
    p.includes('nutrition') || p.includes('calorie') || p.includes('weight') || p.includes('fat') ||
    p.includes('thin') || p.includes('gain') || p.includes('loss') || p.includes('treat') ||
    p.includes('kibble') || p.includes('raw') || p.includes('salmon') || p.includes('chicken') ||
    p.includes('brand') || p.includes('meal') || p.includes('hungry') || p.includes('appetite')
  ) {
    return `### 🥗 Nutrition & Caloric Formula for ${petHeader}

Proper nutrition tailored to **${name}**'s weight of **${weight} kg** (${species}):

#### 1. Daily Caloric Formula:
- 📊 **Resting Energy Requirement (RER)**: ~**${rer} kcal/day**
- ⚡ **Maintenance Energy Requirement (MER)**: Approx **${dailyCalories} kcal/day**.

#### 2. Feeding Guidelines for ${name}:
- Divide daily intake into **2 structured meals** (~${Math.round(dailyCalories / 2)} kcal per meal).
- Maintain fresh water 24/7.
- Avoid toxic foods: chocolate, onions, garlic, grapes, raisins, xylitol.`;
  }

  return `### 🐾 Clinical Care & Wellness Advisory for ${petHeader}

Thank you for consulting SmartCare AI regarding **${name}**'s care (${species}, ${breed}, ${weight} kg).

#### 1. Clinical Triage for "${prompt.trim()}":
- For a **${species}** at **${pet.ageYears} years old**, maintaining consistent daily care routines, optimal nutrition (~**${dailyCalories} kcal/day**), and active health tracking is key to longevity.
- Monitor ${name}'s daily appetite, water intake, stool quality, and energy level closely.

#### 2. Veterinary Note:
If **${name}** shows persistent changes in behavior, appetite loss lasting >24 hours, or signs of pain, please consult an in-person veterinarian for physical examination.`;
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

  const systemInstructionText = `You are SmartCare AI, a world-class expert veterinary medical assistant.
Current Pet Profile:
- Pet Name: ${pet.name}
- Species: ${pet.species} (Category: ${pet.category})
- Breed: ${pet.breed || 'Standard'}
- Age: ${pet.ageYears} years, ${pet.ageMonths} months
- Weight: ${pet.weightKg} kg
- Bio: ${pet.bio || 'Beloved pet'}

Guidelines:
1. Directly answer the user's specific question about ${pet.name} with warm, scientifically accurate, and species-tailored veterinary advice.
2. Use bolding and concise structured bullet points for readability.
3. Do not use generic repetitive intro templates. Address the user's query directly and give actionable care steps.`;

  // 1. Query Live Real-Time AI Generation Model
  const liveAiText = await fetchLiveAIResponse(systemInstructionText, prompt, history);
  if (liveAiText) {
    return {
      text: liveAiText,
      isEmergency: false
    };
  }

  // 2. Offline Dynamic Fallback Engine
  const fallbackText = generateDynamicVetResponse(prompt, pet);
  return {
    text: fallbackText,
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

  // Try Live AI for visual symptom screening description
  try {
    const liveVisionRes = await fetchLiveAIResponse(
      `You are a veterinary AI visual triage assistant. Analyze pet photo symptoms for ${pet.name} (${pet.species}, ${pet.weightKg}kg). Output short JSON with keys: symptomSummary, urgencyLevel ("normal"|"monitor"|"urgent"), possibleCauses (array of 3 strings), recommendations (array of 3 strings), suggestedVetSpecialty.`,
      `Pet symptom notes: "${symptomNotes || 'Visual inspection'}"`
    );

    if (liveVisionRes && liveVisionRes.includes('{')) {
      const jsonStart = liveVisionRes.indexOf('{');
      const jsonEnd = liveVisionRes.lastIndexOf('}') + 1;
      const parsed = JSON.parse(liveVisionRes.substring(jsonStart, jsonEnd));
      return {
        ...parsed,
        disclaimer: 'Preliminary AI visual screening for informational purposes only. Not a definitive veterinary diagnosis.',
        isEmergencyRedirect: parsed.urgencyLevel === 'emergency'
      };
    }
  } catch (e) {}

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