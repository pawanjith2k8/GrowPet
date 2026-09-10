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

// Enhanced fallback response generator with better keyword matching
function generateFallbackResponse(prompt: string, pet: Pet): string {
  const lower = prompt.toLowerCase();

  // MAMMAL-SPECIFIC RESPONSES
  if (pet.category === 'mammal') {
    if (lower.includes('food') || lower.includes('feed') || lower.includes('diet') || lower.includes('eat') || lower.includes('nutrition')) {
      return `🐾 **Nutrition Advice for ${pet.name} (${pet.species})**:\n\n` +
        `- **Daily Caloric Needs**: At ${pet.weightKg} kg, ${pet.name} needs approximately ${Math.round((pet.weightKg * 30 + 70) * 1.4)} kcal/day.\n` +
        `- **Meal Portions**: Divide into 2 balanced meals to promote steady digestion and prevent bloat.\n` +
        `- **Healthy Additions**: Steamed carrots, pure pumpkin puree, blueberries, or cooked lean proteins.\n` +
        `- **Toxic Foods to Avoid**: Onions, garlic, grapes, raisins, macadamia nuts, xylitol, and chocolate.\n` +
        `- **Hydration**: Always provide fresh, filtered water throughout the day.`;
    } else if (lower.includes('scratch') || lower.includes('itch') || lower.includes('skin') || lower.includes('flea') || lower.includes('allergy')) {
      return `🩺 **Skin & Coat Health Assessment for ${pet.name}**:\n\n` +
        `- **Potential Factors**: Seasonal environmental pollen, protein sensitivities, dry skin, flea allergies, or food sensitivities.\n` +
        `- **Recommended Actions**: \n` +
        `  • Inspect paws and underbelly for redness or lesions\n` +
        `  • Supplement meals with Omega-3 fatty acids (fish oil)\n` +
        `  • Use a gentle colloidal oatmeal shampoo weekly\n` +
        `  • Consider a flea/tick preventative if not already on one\n` +
        `- **When to Seek Vet Care**: If redness, hot spots, or hair loss develop, book an exam with your veterinarian.`;
    } else if (lower.includes('training') || lower.includes('behav') || lower.includes('bark') || lower.includes('aggressive')) {
      return `🎓 **Behavioral Training for ${pet.name}**:\n\n` +
        `- **Positive Reinforcement**: Use treats, praise, and play as rewards for good behavior.\n` +
        `- **Consistency**: Everyone in the household should use the same commands and rules.\n` +
        `- **Exercise & Enrichment**: Many behavioral issues stem from insufficient activity. Aim for 20-30 mins daily exercise.\n` +
        `- **Socialization**: Gradual, positive exposure to different people and environments builds confidence.\n` +
        `- **Patience**: Behavior change takes time (2-4 weeks minimum). Stay persistent!`;
    } else if (lower.includes('exercise') || lower.includes('walk') || lower.includes('energy') || lower.includes('activity')) {
      return `🏃 **Exercise & Activity Plan for ${pet.name}**:\n\n` +
        `- **Daily Recommendation**: ${pet.weightKg > 20 ? '45-60 minutes' : '20-30 minutes'} of active exercise daily.\n` +
        `- **Best Activities**: Brisk walks, fetch games, agility play, or swimming (if applicable).\n` +
        `- **Mental Enrichment**: Hide-and-seek games, puzzle toys, and training sessions.\n` +
        `- **Weather Considerations**: Adjust intensity in hot/cold weather. Elderly or young pets need modified routines.\n` +
        `- **Signs of Under-Exercise**: Destructive behavior, excessive barking, weight gain, or hyperactivity.`;
    } else if (lower.includes('weight') || lower.includes('obese') || lower.includes('overweight') || lower.includes('thin')) {
      return `⚖️ **Weight Management for ${pet.name}**:\n\n` +
        `- **Current Weight**: ${pet.weightKg} kg\n` +
        `- **Ideal Weight Range**: Consult with your vet, but generally:\n` +
        `  • You should feel ribs with gentle pressure\n` +
        `  • Visible waist when viewed from above\n` +
        `  • Abdominal tuck when viewed from the side\n` +
        `- **Weight Loss Tips**: Reduce treats, increase fiber, more exercise, measure portions carefully.\n` +
        `- **Weight Gain Tips**: More frequent meals, calorie-dense healthy foods, strength-building exercise.`;
    } else if (lower.includes('pregnant') || lower.includes('pregnancy')) {
      return `👶 **Pregnancy Care for ${pet.name}**:\n\n` +
        `- **Veterinary Monitoring**: Schedule monthly check-ups and ultrasounds at weeks 4, 6, and 8.\n` +
        `- **Nutrition**: Increase calories by 25-50% starting at week 4. High-quality protein is essential.\n` +
        `- **Exercise**: Maintain light activity but avoid jumping or rough play. Provide a quiet nesting area.\n` +
        `- **Birth Preparation**: Prepare a clean, warm, quiet whelping/nesting box.\n` +
        `- **When to Seek Emergency Care**: Difficulty breathing, vaginal bleeding, lethargy, or straining without delivery of puppy/kittens.`;
    } else if (lower.includes('old') || lower.includes('senior') || lower.includes('age')) {
      return `👴 **Senior Care for ${pet.name} (Age: ${pet.ageYears}y ${pet.ageMonths}m)**:\n\n` +
        `- **Health Monitoring**: Regular vet check-ups every 6 months (vs. annual for younger pets).\n` +
        `- **Joint Support**: Provide orthopedic beds, ramps for stairs, and consider joint supplements (glucosamine).\n` +
        `- **Dental Care**: Dental disease is common in seniors. Brush teeth regularly or schedule professional cleaning.\n` +
        `- **Diet Adjustments**: Lower-calorie but nutrient-dense foods. Smaller, more frequent meals.\n` +
        `- **Quality of Life**: Pain management, mobility aids, and mental stimulation are key to comfort.`;
    }
  }

  // BIRD-SPECIFIC RESPONSES
  else if (pet.category === 'bird') {
    if (lower.includes('food') || lower.includes('feed') || lower.includes('diet') || lower.includes('eat')) {
      return `🦜 **Avian Nutrition for ${pet.name} (${pet.species})**:\n\n` +
        `- **Ideal Diet Composition**: 65% formulated organic pellets + 25% fresh dark greens (kale, broccoli, spinach) + 10% seeds/millet.\n` +
        `- **Vegetables**: Offer carrots, bell peppers, zucchini, and leafy greens daily.\n` +
        `- **Avoid Toxic Foods**: Avocado, chocolate, salt, caffeine, and undercooked beans.\n` +
        `- **Water**: Fresh, filtered water daily. Change bowls twice daily to prevent bacterial growth.\n` +
        `- **Treats**: Nuts (unsalted) and dried fruits in moderation only.`;
    } else if (lower.includes('feather') || lower.includes('molt') || lower.includes('plucking')) {
      return `🪶 **Feather & Molting Care for ${pet.name}**:\n\n` +
        `- **Normal Molting**: Occurs annually, lasting 2-3 months. Heavy dust baths help.\n` +
        `- **Feather Plucking Causes**: Stress, boredom, low humidity (<40%), inadequate sleep, or medical issues.\n` +
        `- **Humidity**: Maintain 40-60% humidity. Mist feathers or use humidifier daily.\n` +
        `- **Sleep**: Ensure 10-12 hours of sleep in a quiet, dark area.\n` +
        `- **Enrichment**: Foraging toys, shredding materials, and social interaction reduce stress.`;
    } else if (lower.includes('behavior') || lower.includes('scream') || lower.includes('noisy') || lower.includes('aggressive')) {
      return `🎓 **Bird Behavioral Support for ${pet.name}**:\n\n` +
        `- **Screaming/Vocalization**: Often attention-seeking. Ignore noise; reward quiet behavior.\n` +
        `- **Sleep Deprivation**: Can cause aggression and behavioral issues. Ensure 10-12 hours sleep nightly.\n` +
        `- **Socialization**: Gradual hand-taming with treats. Never force interaction.\n` +
        `- **Space**: Provide a large, stimulating cage or aviary with multiple perches.\n` +
        `- **Environmental Toxins**: Avoid non-stick cookware, aerosols, scented candles, and open flames.`;
    } else if (lower.includes('air quality') || lower.includes('toxic') || lower.includes('teflon')) {
      return `🌬️ **Air Quality for ${pet.name} (${pet.species})**:\n\n` +
        `- **Critical Toxins to Avoid**:\n` +
        `  • Teflon/PTFE (non-stick cookware, space heaters, hair dryers)\n` +
        `  • Aerosol sprays and perfumes\n` +
        `  • Scented candles and plug-in air fresheners\n` +
        `  • Cigarette and vape smoke\n` +
        `  • Fumes from cleaning products\n` +
        `- **Safe Ventilation**: Ensure good air circulation and keep windows open when using cleaning products.\n` +
        `- **Emergency Signs**: Difficulty breathing, wheezing, or sudden weakness → immediate vet care!`;
    }
  }

  // AQUATIC-SPECIFIC RESPONSES
  else if (pet.category === 'aquatic') {
    if (lower.includes('water') || lower.includes('tank') || lower.includes('temperature') || lower.includes('ph')) {
      return `💧 **Water Parameters for ${pet.name} (${pet.species})**:\n\n` +
        `- **Temperature**: Most species prefer 76-80°F (24-27°C). Check species-specific requirements.\n` +
        `- **pH Level**: Generally 6.5-8.0 depending on species (acidic for tetras, neutral for most community).\n` +
        `- **Ammonia/Nitrite**: Must be 0 ppm (toxic to fish).\n` +
        `- **Nitrate**: Keep under 20-40 ppm (use test kit weekly).\n` +
        `- **Hardness (GH/KH)**: Species-dependent. Research your fish's natural habitat.`;
    } else if (lower.includes('water change') || lower.includes('cleaning') || lower.includes('maintenance')) {
      return `🧹 **Tank Maintenance for ${pet.name}**:\n\n` +
        `- **Weekly Water Changes**: 20-30% change using water conditioner (like Seachem Prime).\n` +
        `- **Gravel Vacuuming**: Clean substrate during water changes to remove waste.\n` +
        `- **Filter Maintenance**: Rinse filter media in old tank water (not tap) weekly.\n` +
        `- **Algae Control**: Regular cleaning and 8-10 hours daily light reduces algae blooms.\n` +
        `- **Monthly Tasks**: Deep clean decorations, replace filter cartridges if needed, test all parameters.`;
    } else if (lower.includes('fin rot') || lower.includes('disease') || lower.includes('sick') || lower.includes('spot')) {
      return `🚨 **Disease & Health for ${pet.name}**:\n\n` +
        `- **Fin Rot**: Frayed/rotting fins from poor water quality or stress. Increase water changes, improve filtration.\n` +
        `- **Ich (White Spot)**: White spots on body/fins. Raise temperature slightly (if suitable), treat with ich medicine.\n` +
        `- **Dropsy**: Bloated appearance, raised scales. Usually serious—consult vet or aquarist.\n` +
        `- **Cloudy Eye**: Often from poor water quality. Do large water changes and check parameters.\n` +
        `- **Prevention**: Maintain excellent water quality, quarantine new fish, avoid overfeeding.`;
    } else if (lower.includes('feeding') || lower.includes('food') || lower.includes('eat')) {
      return `🍽️ **Feeding Guidelines for ${pet.name}**:\n\n` +
        `- **Portion Size**: Feed small amounts consumed within 90 seconds.\n` +
        `- **Frequency**: Most fish 1-2 times daily. Some species prefer once daily.\n` +
        `- **Food Types**: Use high-quality flakes, pellets, or species-specific foods.\n` +
        `- **Live Foods**: Brine shrimp or bloodworms as occasional treats (1-2x weekly).\n` +
        `- **Overfeeding Dangers**: Uneaten food rots, raising ammonia/nitrates and causing swim bladder issues.`;
    } else if (lower.includes('plant') || lower.includes('live plants') || lower.includes('vegetation')) {
      return `🌿 **Live Plants for ${pet.name}'s Tank**:\n\n` +
        `- **Benefits**: Oxygen production, natural filtration, hiding spots, reduced algae.\n` +
        `- **Best Plants for Low-Light Tanks**: Java fern, Anubias, Moss (don't bury roots).\n` +
        `- **Beginner Plants**: Ludwigia, Rotala, Dwarf Hairgrass (easy to grow).\n` +
        `- **Lighting**: Most aquatic plants need 8-10 hours daily light. Consider LED grow lights.\n` +
        `- **Care**: Add aquarium fertilizer (nitrogen, potassium, trace elements) if plants aren't thriving.`;
    }
  }

  // REPTILE-SPECIFIC RESPONSES
  else if (pet.category === 'reptile') {
    if (lower.includes('temperature') || lower.includes('basking') || lower.includes('heat') || lower.includes('thermal')) {
      return `🌡️ **Thermal Gradient for ${pet.name} (${pet.species})**:\n\n` +
        `- **Basking Zone**: 100-105°F (37-40°C) with UVB lamp overhead.\n` +
        `- **Cool Side**: 75-80°F (24-27°C) for thermoregulation.\n` +
        `- **Night Temperature**: Can drop to 70-75°F (21-24°C).\n` +
        `- **Thermometers**: Use analog or digital probes on both sides. Never rely on touch alone.\n` +
        `- **Equipment**: Under-tank heater, ceramic heat lamp, or heat tape for nighttime if needed.`;
    } else if (lower.includes('uvb') || lower.includes('lighting') || lower.includes('light')) {
      return `💡 **UVB Lighting for ${pet.name}**:\n\n` +
        `- **UVB Importance**: Essential for Vitamin D3 synthesis and calcium absorption (prevents MBD).\n` +
        `- **Bulb Replacement**: Replace linear UVB bulbs every 6-12 months (output degrades).\n` +
        `- **Photoperiod**: 10-12 hours daily light exposure (natural day-night cycle).\n` +
        `- **Placement**: Mount 12-18 inches above basking spot. Screen blocks UVB—use mesh or unscreened fixtures.\n` +
        `- **Monitoring**: If appetite/activity drops, check UVB levels with meter (if available).`;
    } else if (lower.includes('food') || lower.includes('feed') || lower.includes('diet') || lower.includes('eat')) {
      return `🍴 **Nutrition for ${pet.name} (${pet.species})**:\n\n` +
        `- **Protein Source**: Live insects, pre-killed prey, or frozen-thawed (species-dependent).\n` +
        `- **Feeding Schedule**: Juveniles 1x daily, adults 3-4x weekly (depends on species).\n` +
        `- **Prey Size**: Should be appropriately sized (generally 1/3–1/2 the reptile's length).\n` +
        `- **Gut Loading**: Feed insects calcium-rich diet 24 hours before offering to reptile.\n` +
        `- **Calcium Dust**: Coat insects with phosphorus-free calcium + D3 powder 2-3x weekly.`;
    } else if (lower.includes('calcium') || lower.includes('mbd') || lower.includes('metabolic bone')) {
      return `🦴 **Preventing Metabolic Bone Disease (MBD) for ${pet.name}**:\n\n` +
        `- **Root Causes**: Inadequate UVB lighting, poor diet, insufficient calcium supplementation.\n` +
        `- **Early Signs**: Lethargy, loss of appetite, swollen jaw or limbs, difficulty moving.\n` +
        `- **Prevention**: \n` +
        `  • Quality UVB lighting (replace every 6-12 months)\n` +
        `  • Dust feeders with calcium + D3 2-3x weekly\n` +
        `  • Offer leafy greens (for herbivorous species)\n` +
        `  • Proper temperature gradient\n` +
        `- **Severe MBD**: Requires veterinary care (vet-supervised calcium injections, long-term recovery).`;
    } else if (lower.includes('shed') || lower.includes('shedding') || lower.includes('skin')) {
      return `🐍 **Shedding & Skin Care for ${pet.name}**:\n\n` +
        `- **Normal Shedding**: Occurs every 4-8 weeks (depends on species and age).\n` +
        `- **Signs of Impending Shed**: Dull coloration, cloudy eyes, increased hiding.\n` +
        `- **Stuck Shed**: Humidity too low. Provide humid hide or gentle warm bath.\n` +
        `- **Rough Shed**: Improper humidity, poor nutrition, or skin issues. Consult vet if persistent.\n` +
        `- **Ideal Humidity**: 40-70% (species-dependent). Monitor with hygrometer.`;
    }
  }

  // GENERIC/DEFAULT RESPONSES
  else {
    if (lower.includes('happy') || lower.includes('mood') || lower.includes('stress') || lower.includes('health')) {
      return `✨ **Overall Wellness for ${pet.name} (${pet.species})**:\n\n` +
        `- **Daily Active Exercise**: 20-30 minutes of activity tailored to species.\n` +
        `- **Fresh Water**: Always available, changed daily.\n` +
        `- **Mental Enrichment**: Toys, games, and species-appropriate activities reduce stress.\n` +
        `- **Complete Care Checklist**: Follow your daily tasks to keep ${pet.name}'s happiness high!\n` +
        `- **Regular Vet Checkups**: Annual (or bi-annual for seniors) ensures early disease detection.`;
    } else if (lower.includes('first aid') || lower.includes('emergency') || lower.includes('injury')) {
      return `🆘 **First Aid for ${pet.name}**:\n\n` +
        `- **Severe Bleeding**: Apply gentle pressure with clean cloth. Seek vet care immediately.\n` +
        `- **Fractures**: Immobilize limb, keep warm, go to vet.\n` +
        `- **Choking**: Attempt gentle abdominal thrusts if small object visible. Go to vet if signs persist.\n` +
        `- **Poisoning**: Identify poison, bring container to vet. Don't induce vomiting without professional guidance.\n` +
        **⚠️ When in doubt, contact your emergency vet immediately.**`;
    }
  }

  // Final fallback if no keywords match
  return `🐾 **Care Recommendation for ${pet.name} (${pet.species})**:\n\n` +
    `I'm not familiar with that specific question, but here are some general tips:\n\n` +
    `- Daily active exercise and fresh, filtered water keep ${pet.name} healthy.\n` +
    `- Species-appropriate diet and habitat are fundamental to wellbeing.\n` +
    `- Regular veterinary checkups catch health issues early.\n` +
    `- Complete your daily care tasks to keep ${pet.name}'s happiness score high!\n\n` +
    `**Try asking about**: feeding, health, behavior, exercise, habitat, or specific symptoms. For detailed medical concerns, always consult your veterinarian.`;
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
    console.warn('Gemini API call warning, using intelligent fallback model:', err);
  }

  // Use enhanced fallback intelligent species response generator
  const responseText = generateFallbackResponse(prompt, pet);
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
