// Health condition definitions with specific dietary restrictions
export const HEALTH_CONDITIONS = {
  cancer: {
    id: 'cancer',
    name: 'Cancer',
    icon: '🎗️',
    description: 'Avoid processed foods, seed oils, and inflammatory ingredients',
    avoidIngredients: [
      // Seed oils - highly inflammatory
      'canola oil', 'rapeseed oil', 'soybean oil', 'soy oil',
      'corn oil', 'cottonseed oil', 'safflower oil', 'sunflower oil',
      'grapeseed oil', 'rice bran oil', 'vegetable oil',
      
      // Processed sugars
      'high fructose corn syrup', 'corn syrup', 'glucose-fructose',
      
      // Preservatives and additives
      'sodium benzoate', 'potassium benzoate', 'sodium nitrite', 
      'sodium nitrate', 'bha', 'bht', 'tbhq',
      
      // Artificial ingredients
      'artificial flavor', 'artificial colour', 'artificial sweetener',
      'aspartame', 'sucralose', 'acesulfame',
      
      // Other problematic
      'monosodium glutamate', 'msg', 'carrageenan',
      'partially hydrogenated', 'hydrogenated oil', 'trans fat'
    ],
    nutrientLimits: {
      sugar_100g: { max: 10, unit: 'g', label: 'Added Sugar' },
      sodium_100g: { max: 300, unit: 'mg', label: 'Sodium' },
      saturated_fat_100g: { max: 5, unit: 'g', label: 'Saturated Fat' }
    },
    recommendations: [
      'Choose whole, unprocessed foods',
      'Look for organic options when possible',
      'Avoid foods with long ingredient lists',
      'Choose healthy fats like olive oil, avocado oil'
    ]
  },
  
  diabetes: {
    id: 'diabetes',
    name: 'Diabetes',
    icon: '🩸',
    description: 'Monitor sugar, carbs, and glycemic impact',
    avoidIngredients: [
      'high fructose corn syrup', 'corn syrup', 'glucose-fructose',
      'maltodextrin', 'dextrose', 'sucrose', 'fructose',
      'cane sugar', 'brown sugar', 'honey', 'agave nectar',
      'white flour', 'enriched flour'
    ],
    nutrientLimits: {
      sugar_100g: { max: 5, unit: 'g', label: 'Sugar' },
      carbohydrates_100g: { max: 15, unit: 'g', label: 'Carbohydrates' },
      energy_100g: { max: 200, unit: 'kcal', label: 'Calories' }
    },
    recommendations: [
      'Choose low-glycemic foods',
      'Monitor total carbohydrate intake',
      'Look for high fiber content',
      'Avoid sugary drinks and desserts'
    ]
  },
  
  lactoseIntolerant: {
    id: 'lactoseIntolerant',
    name: 'Lactose Intolerance',
    icon: '🥛',
    description: 'Avoid milk and dairy products containing lactose',
    avoidIngredients: [
      'milk', 'whole milk', 'skim milk', '2% milk',
      'cream', 'heavy cream', 'whipping cream',
      'butter', 'buttermilk',
      'cheese', 'cheddar', 'mozzarella', 'parmesan',
      'yogurt', 'ice cream',
      'whey', 'casein', 'lactose',
      'milk powder', 'dried milk', 'milk solids'
    ],
    nutrientLimits: {},
    recommendations: [
      'Look for lactose-free alternatives',
      'Try plant-based milks (almond, oat, soy)',
      'Check for "dairy-free" labels',
      'Lactase enzyme supplements may help'
    ]
  },
  
  celiac: {
    id: 'celiac',
    name: 'Celiac / Gluten Sensitivity',
    icon: '🌾',
    description: 'Avoid gluten from wheat, barley, and rye',
    avoidIngredients: [
      'wheat', 'whole wheat', 'wheat flour', 'enriched flour',
      'barley', 'rye', 'malt', 'malt extract', 'malt flavoring',
      'brewer\'s yeast', 'wheat starch', 'triticale',
      'spelt', 'kamut', 'farro', 'durum',
      'semolina', 'bulgur', 'couscous',
      'modified food starch', 'hydrolyzed vegetable protein'
    ],
    nutrientLimits: {},
    recommendations: [
      'Look for certified gluten-free products',
      'Check for cross-contamination warnings',
      'Safe grains: rice, quinoa, corn',
      'Read labels carefully for hidden gluten'
    ]
  },
  
  heartDisease: {
    id: 'heartDisease',
    name: 'Heart Disease',
    icon: '❤️',
    description: 'Low sodium, low saturated fat, avoid trans fats',
    avoidIngredients: [
      'partially hydrogenated', 'hydrogenated oil', 'trans fat',
      'palm oil', 'coconut oil',
      'lard', 'beef fat', 'pork fat',
      'sodium nitrite', 'sodium nitrate'
    ],
    nutrientLimits: {
      sodium_100g: { max: 200, unit: 'mg', label: 'Sodium' },
      saturated_fat_100g: { max: 3, unit: 'g', label: 'Saturated Fat' },
      cholesterol_100g: { max: 20, unit: 'mg', label: 'Cholesterol' }
    },
    recommendations: [
      'Choose lean proteins',
      'Increase omega-3 fatty acids',
      'Limit processed and fried foods',
      'Use heart-healthy oils like olive oil'
    ]
  },
  
  highBloodPressure: {
    id: 'highBloodPressure',
    name: 'High Blood Pressure',
    icon: '🩺',
    description: 'Low sodium, monitor caffeine',
    avoidIngredients: [
      'salt', 'sea salt', 'sodium chloride',
      'sodium benzoate', 'sodium nitrite', 'sodium nitrate',
      'monosodium glutamate', 'msg',
      'baking soda', 'sodium bicarbonate'
    ],
    nutrientLimits: {
      sodium_100g: { max: 150, unit: 'mg', label: 'Sodium' },
      saturated_fat_100g: { max: 3, unit: 'g', label: 'Saturated Fat' }
    },
    recommendations: [
      'Aim for less than 1500mg sodium per day',
      'Increase potassium-rich foods',
      'Limit alcohol consumption',
      'Choose fresh over processed foods'
    ]
  },
  
  generalHealth: {
    id: 'generalHealth',
    name: 'General Healthy Eating',
    icon: '🥗',
    description: 'Balanced diet, avoid highly processed foods',
    avoidIngredients: [
      'high fructose corn syrup', 'corn syrup',
      'partially hydrogenated', 'hydrogenated oil',
      'artificial flavor', 'artificial colour',
      'msg', 'monosodium glutamate'
    ],
    nutrientLimits: {
      sugar_100g: { max: 15, unit: 'g', label: 'Sugar' },
      sodium_100g: { max: 400, unit: 'mg', label: 'Sodium' },
      saturated_fat_100g: { max: 7, unit: 'g', label: 'Saturated Fat' }
    },
    recommendations: [
      'Choose whole, minimally processed foods',
      'Read ingredient labels carefully',
      'Balance macronutrients',
      'Stay hydrated and exercise regularly'
    ]
  }
}

export const getConditionById = (id) => HEALTH_CONDITIONS[id]

export const getAllConditions = () => Object.values(HEALTH_CONDITIONS)
