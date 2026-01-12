// Evidence-based health condition definitions with severity levels and sources
// Sources: WHO, American Cancer Society, ADA, FDA, Mayo Clinic

export const SEVERITY = {
  CRITICAL: 'critical',  // Avoid completely
  HIGH: 'high',          // Limit strictly
  MODERATE: 'moderate'   // Consume with caution
}

export const HEALTH_CONDITIONS = {
  cancer: {
    id: 'cancer',
    name: 'Cancer',
    icon: '🎗️',
    description: 'Evidence-based dietary guidance for cancer prevention and management',
    avoidIngredients: [
      // CRITICAL - WHO Group 1 & 2 Carcinogens
      { 
        name: 'sodium nitrite', 
        severity: SEVERITY.CRITICAL,
        reason: 'WHO Group 1 carcinogen - forms nitrosamines',
        source: 'WHO IARC'
      },
      { 
        name: 'sodium nitrate', 
        severity: SEVERITY.CRITICAL,
        reason: 'Converts to nitrites, linked to increased cancer risk',
        source: 'WHO IARC'
      },
      { 
        name: 'partially hydrogenated', 
        severity: SEVERITY.CRITICAL,
        reason: 'Trans fats - banned by FDA, inflammatory',
        source: 'FDA'
      },
      { 
        name: 'hydrogenated oil', 
        severity: SEVERITY.CRITICAL,
        reason: 'Trans fats increase cancer and heart disease risk',
        source: 'American Heart Association'
      },
      
      // HIGH - Processed oils linked to inflammation
      { 
        name: 'soybean oil', 
        severity: SEVERITY.HIGH,
        reason: 'High omega-6, promotes inflammation',
        source: 'American Cancer Society'
      },
      { 
        name: 'canola oil', 
        severity: SEVERITY.HIGH,
        reason: 'Highly processed, inflammatory omega-6',
        source: 'American Cancer Society'
      },
      { 
        name: 'corn oil', 
        severity: SEVERITY.HIGH,
        reason: 'High omega-6 fatty acids, inflammatory',
        source: 'American Cancer Society'
      },
      { 
        name: 'cottonseed oil', 
        severity: SEVERITY.HIGH,
        reason: 'Industrial oil, potential pesticide residues',
        source: 'American Cancer Society'
      },
      { 
        name: 'vegetable oil', 
        severity: SEVERITY.HIGH,
        reason: 'Usually soybean oil, inflammatory',
        source: 'American Cancer Society'
      },
      
      // HIGH - Preservatives with cancer concerns
      { 
        name: 'bha', 
        severity: SEVERITY.HIGH,
        reason: 'Possible carcinogen, oxidative stress',
        source: 'National Toxicology Program'
      },
      { 
        name: 'bht', 
        severity: SEVERITY.HIGH,
        reason: 'Potential carcinogen, hormone disruptor',
        source: 'National Toxicology Program'
      },
      { 
        name: 'tbhq', 
        severity: SEVERITY.HIGH,
        reason: 'Linked to tumor development in studies',
        source: 'FDA studies'
      },
      
      // MODERATE - Sugars feed cancer cells
      { 
        name: 'high fructose corn syrup', 
        severity: SEVERITY.MODERATE,
        reason: 'Feeds cancer cells, promotes insulin resistance',
        source: 'American Cancer Society'
      },
      { 
        name: 'artificial sweetener', 
        severity: SEVERITY.MODERATE,
        reason: 'Some linked to cancer in animal studies',
        source: 'Mixed research - use caution'
      },
      { 
        name: 'aspartame', 
        severity: SEVERITY.MODERATE,
        reason: 'Possible carcinogen per WHO (Group 2B)',
        source: 'WHO IARC 2023'
      },
      
      // Pattern matching
      'rapeseed oil', 'safflower oil', 'sunflower oil', 'grapeseed oil',
      'corn syrup', 'artificial flavor', 'artificial colour',
      'monosodium glutamate', 'msg', 'carrageenan'
    ],
    nutrientLimits: {
      sugar_100g: { max: 5, unit: 'g', label: 'Added Sugar', reason: 'Excess sugar feeds cancer cells' },
      sodium_100g: { max: 400, unit: 'mg', label: 'Sodium', reason: 'High sodium linked to stomach cancer' },
      saturated_fat_100g: { max: 3, unit: 'g', label: 'Saturated Fat', reason: 'Inflammatory, increases risk' }
    },
    positiveIngredients: [
      { name: 'olive oil', benefit: 'Anti-inflammatory, rich in antioxidants' },
      { name: 'avocado oil', benefit: 'Healthy fats, anti-cancer properties' },
      { name: 'turmeric', benefit: 'Curcumin has anti-cancer effects' },
      { name: 'green tea extract', benefit: 'Powerful antioxidants' },
      { name: 'garlic', benefit: 'May help prevent certain cancers' }
    ],
    recommendations: [
      '✅ Choose organic when possible to reduce pesticide exposure',
      '✅ Eat a rainbow of fruits and vegetables',
      '✅ Limit processed and ultra-processed foods',
      '✅ Choose grass-fed, hormone-free animal products',
      '❌ Avoid charred or heavily grilled meats',
      '❌ Limit alcohol consumption'
    ],
    sources: [
      'WHO International Agency for Research on Cancer (IARC)',
      'American Cancer Society Nutrition Guidelines',
      'National Cancer Institute Dietary Recommendations'
    ]
  },
  
  diabetes: {
    id: 'diabetes',
    name: 'Diabetes',
    icon: '🩸',
    description: 'Evidence-based blood sugar management and glycemic control',
    avoidIngredients: [
      // CRITICAL - Rapid blood sugar spikes
      { 
        name: 'high fructose corn syrup', 
        severity: SEVERITY.CRITICAL,
        reason: 'Rapid insulin spike, linked to insulin resistance',
        source: 'American Diabetes Association'
      },
      { 
        name: 'maltodextrin', 
        severity: SEVERITY.CRITICAL,
        reason: 'GI of 110 - higher than pure glucose',
        source: 'ADA'
      },
      { 
        name: 'dextrose', 
        severity: SEVERITY.CRITICAL,
        reason: 'Pure glucose, immediate blood sugar spike',
        source: 'ADA'
      },
      
      // HIGH - Hidden sugars and refined carbs
      { 
        name: 'corn syrup', 
        severity: SEVERITY.HIGH,
        reason: 'Rapidly absorbed, spikes blood sugar',
        source: 'ADA'
      },
      { 
        name: 'white flour', 
        severity: SEVERITY.HIGH,
        reason: 'High GI, low fiber, rapid glucose release',
        source: 'ADA Glycemic Index'
      },
      { 
        name: 'rice syrup', 
        severity: SEVERITY.HIGH,
        reason: 'Very high glycemic index',
        source: 'ADA'
      },
      
      // MODERATE - Manage portion sizes
      { 
        name: 'cane sugar', 
        severity: SEVERITY.MODERATE,
        reason: 'Raises blood glucose, count as carbs',
        source: 'ADA'
      },
      { 
        name: 'honey', 
        severity: SEVERITY.MODERATE,
        reason: 'Natural but still raises blood sugar',
        source: 'ADA'
      },
      
      'glucose-fructose', 'sucrose', 'fructose', 'brown sugar',
      'agave nectar', 'maple syrup', 'molasses', 'invert sugar'
    ],
    nutrientLimits: {
      sugar_100g: { max: 5, unit: 'g', label: 'Total Sugars', reason: 'Direct impact on blood glucose' },
      carbohydrates_100g: { max: 15, unit: 'g', label: 'Carbohydrates', reason: 'Converts to glucose' },
      sodium_100g: { max: 400, unit: 'mg', label: 'Sodium', reason: 'Diabetics at higher risk for hypertension' }
    },
    positiveIngredients: [
      { name: 'fiber', benefit: 'Slows glucose absorption, stabilizes blood sugar' },
      { name: 'cinnamon', benefit: 'May improve insulin sensitivity' },
      { name: 'chia seeds', benefit: 'High fiber, omega-3, stabilizes blood sugar' },
      { name: 'vinegar', benefit: 'Lowers post-meal glucose spikes' },
      { name: 'nuts', benefit: 'Low GI, healthy fats, minimal glucose impact' }
    ],
    recommendations: [
      '✅ Focus on low glycemic index foods (GI < 55)',
      '✅ Pair carbs with protein or healthy fat to slow absorption',
      '✅ Choose whole grains over refined grains',
      '✅ Read labels carefully - "sugar-free" may still have carbs',
      '❌ Avoid "fat-free" products (often high in sugar)',
      '❌ Limit fruit juices - opt for whole fruits instead'
    ],
    sources: [
      'American Diabetes Association Standards of Care',
      'International Glycemic Index Database',
      'Mayo Clinic Diabetes Nutrition Guidelines'
    ]
  },
  
  lactoseIntolerant: {
    id: 'lactoseIntolerant',
    name: 'Lactose Intolerance',
    icon: '🥛',
    description: 'Avoid milk and dairy products containing lactose',
    avoidIngredients: [
      { 
        name: 'milk', 
        severity: SEVERITY.HIGH,
        reason: 'Primary lactose source - causes digestive distress',
        source: 'NIH - National Institute of Diabetes and Digestive and Kidney Diseases'
      },
      { 
        name: 'whey', 
        severity: SEVERITY.HIGH,
        reason: 'Dairy byproduct, high in lactose',
        source: 'NIH NIDDK'
      },
      { 
        name: 'lactose', 
        severity: SEVERITY.CRITICAL,
        reason: 'Pure lactose sugar - direct intolerance trigger',
        source: 'NIH NIDDK'
      },
      { 
        name: 'casein', 
        severity: SEVERITY.MODERATE,
        reason: 'Milk protein, may contain residual lactose',
        source: 'American Gastroenterological Association'
      },
      { 
        name: 'milk powder', 
        severity: SEVERITY.HIGH,
        reason: 'Concentrated lactose, common hidden ingredient',
        source: 'NIH NIDDK'
      },
      'whole milk', 'skim milk', '2% milk', 'cream', 'heavy cream', 'whipping cream',
      'butter', 'buttermilk', 'cheese', 'cheddar', 'mozzarella', 'parmesan',
      'yogurt', 'ice cream', 'dried milk', 'milk solids'
    ],
    nutrientLimits: {},
    positiveIngredients: [
      { name: 'lactase enzyme', benefit: 'Breaks down lactose, enables dairy consumption' },
      { name: 'almond milk', benefit: 'Naturally lactose-free, calcium fortified' },
      { name: 'oat milk', benefit: 'Dairy-free alternative with good nutrition' },
      { name: 'aged cheese', benefit: 'Lower lactose due to fermentation (parmesan, cheddar)' },
      { name: 'probiotic cultures', benefit: 'May improve lactose digestion' }
    ],
    recommendations: [
      '✅ Look for "lactose-free" certified products',
      '✅ Try plant-based milks (almond, oat, soy, coconut)',
      '✅ Aged hard cheeses often have minimal lactose',
      '✅ Lactase enzyme supplements before dairy consumption',
      '❌ Watch for hidden dairy in baked goods, sauces',
      '❌ "Non-dairy" doesn\'t always mean lactose-free'
    ],
    sources: [
      'NIH - National Institute of Diabetes and Digestive and Kidney Diseases',
      'American Gastroenterological Association',
      'Mayo Clinic Lactose Intolerance Guidelines'
    ]
  },
  
  celiac: {
    id: 'celiac',
    name: 'Celiac / Gluten Sensitivity',
    icon: '🌾',
    description: 'Avoid gluten from wheat, barley, and rye',
    avoidIngredients: [
      { 
        name: 'wheat', 
        severity: SEVERITY.CRITICAL,
        reason: 'Contains gluten protein - triggers autoimmune response in celiac disease',
        source: 'Celiac Disease Foundation'
      },
      { 
        name: 'barley', 
        severity: SEVERITY.CRITICAL,
        reason: 'Contains hordein gluten protein - damages small intestine',
        source: 'Celiac Disease Foundation'
      },
      { 
        name: 'rye', 
        severity: SEVERITY.CRITICAL,
        reason: 'Contains secalin gluten protein - triggers immune reaction',
        source: 'Celiac Disease Foundation'
      },
      { 
        name: 'malt', 
        severity: SEVERITY.HIGH,
        reason: 'Made from barley, contains gluten, common hidden ingredient',
        source: 'FDA Gluten-Free Labeling'
      },
      { 
        name: 'modified food starch', 
        severity: SEVERITY.HIGH,
        reason: 'May be wheat-based unless specified otherwise',
        source: 'FDA'
      },
      'whole wheat', 'wheat flour', 'enriched flour', 'malt extract', 'malt flavoring',
      'brewer\'s yeast', 'wheat starch', 'triticale', 'spelt', 'kamut', 'farro', 'durum',
      'semolina', 'bulgur', 'couscous', 'hydrolyzed vegetable protein'
    ],
    nutrientLimits: {},
    positiveIngredients: [
      { name: 'quinoa', benefit: 'Complete protein, naturally gluten-free grain alternative' },
      { name: 'rice', benefit: 'Safe gluten-free staple grain' },
      { name: 'corn', benefit: 'Naturally gluten-free, versatile grain' },
      { name: 'buckwheat', benefit: 'Despite name, gluten-free and nutrient-rich' },
      { name: 'certified gluten-free oats', benefit: 'Safe when processed without cross-contamination' }
    ],
    recommendations: [
      '✅ Look for certified gluten-free label (<20ppm gluten)',
      '✅ Check for cross-contamination warnings',
      '✅ Safe grains: rice, quinoa, corn, millet, teff',
      '✅ Read labels - gluten hides in sauces, seasonings',
      '❌ "Wheat-free" doesn\'t mean gluten-free',
      '❌ Oats must be certified gluten-free (cross-contamination risk)'
    ],
    sources: [
      'Celiac Disease Foundation',
      'FDA Gluten-Free Labeling Rules',
      'National Celiac Association'
    ]
  },
  
  heartDisease: {
    id: 'heartDisease',
    name: 'Heart Disease',
    icon: '❤️',
    description: 'Low sodium, low saturated fat, avoid trans fats',
    avoidIngredients: [
      { 
        name: 'partially hydrogenated oil', 
        severity: SEVERITY.CRITICAL,
        reason: 'Trans fats raise LDL cholesterol, increase heart disease risk by 29%',
        source: 'American Heart Association'
      },
      { 
        name: 'hydrogenated oil', 
        severity: SEVERITY.CRITICAL,
        reason: 'Industrial trans fats - FDA banned due to cardiovascular harm',
        source: 'FDA'
      },
      { 
        name: 'palm oil', 
        severity: SEVERITY.HIGH,
        reason: 'High saturated fat (50%) - raises LDL cholesterol',
        source: 'American Heart Association'
      },
      { 
        name: 'sodium nitrite', 
        severity: SEVERITY.HIGH,
        reason: 'Processed meat preservative linked to cardiovascular disease',
        source: 'World Health Organization'
      },
      { 
        name: 'lard', 
        severity: SEVERITY.HIGH,
        reason: 'Animal fat high in saturated fat and cholesterol',
        source: 'AHA Dietary Guidelines'
      },
      'trans fat', 'coconut oil', 'beef fat', 'pork fat', 'sodium nitrate'
    ],
    nutrientLimits: {
      sodium_100g: { max: 200, unit: 'mg', label: 'Sodium', reason: 'Excess sodium increases blood pressure and heart strain' },
      saturated_fat_100g: { max: 3, unit: 'g', label: 'Saturated Fat', reason: 'Raises LDL cholesterol, clogs arteries' },
      cholesterol_100g: { max: 20, unit: 'mg', label: 'Cholesterol', reason: 'Contributes to plaque buildup in arteries' }
    },
    positiveIngredients: [
      { name: 'omega-3', benefit: 'Reduces triglycerides, lowers blood pressure, anti-inflammatory' },
      { name: 'olive oil', benefit: 'Monounsaturated fats improve cholesterol ratio' },
      { name: 'nuts', benefit: 'Lower LDL cholesterol, improve arterial health' },
      { name: 'oats', benefit: 'Beta-glucan fiber reduces LDL cholesterol by 5-10%' },
      { name: 'fish', benefit: 'Omega-3 fatty acids protect against heart disease' }
    ],
    recommendations: [
      '✅ Choose lean proteins (fish, poultry without skin)',
      '✅ Use heart-healthy oils (olive, avocado, canola)',
      '✅ Increase omega-3 fatty acids (salmon, walnuts, flax)',
      '✅ Aim for <1500mg sodium daily',
      '❌ Limit processed and fried foods',
      '❌ Avoid red meat and full-fat dairy'
    ],
    sources: [
      'American Heart Association Dietary Guidelines',
      'FDA Trans Fat Regulations',
      'World Health Organization Cardiovascular Disease Prevention'
    ]
  },
  
  highBloodPressure: {
    id: 'highBloodPressure',
    name: 'High Blood Pressure',
    icon: '🩺',
    description: 'Low sodium, monitor caffeine',
    avoidIngredients: [
      { 
        name: 'salt', 
        severity: SEVERITY.CRITICAL,
        reason: 'Primary sodium source - directly raises blood pressure',
        source: 'CDC High Blood Pressure Guidelines'
      },
      { 
        name: 'monosodium glutamate', 
        severity: SEVERITY.HIGH,
        reason: 'Contains 12% sodium by weight, hidden salt source',
        source: 'American Heart Association'
      },
      { 
        name: 'sodium nitrite', 
        severity: SEVERITY.HIGH,
        reason: 'Preservative with high sodium content, linked to hypertension',
        source: 'WHO'
      },
      { 
        name: 'sodium benzoate', 
        severity: SEVERITY.MODERATE,
        reason: 'Preservative adds to daily sodium intake',
        source: 'FDA'
      },
      { 
        name: 'baking soda', 
        severity: SEVERITY.MODERATE,
        reason: 'Sodium bicarbonate - 1/2 tsp = 629mg sodium',
        source: 'USDA'
      },
      'sea salt', 'sodium chloride', 'sodium nitrate', 'msg'
    ],
    nutrientLimits: {
      sodium_100g: { max: 150, unit: 'mg', label: 'Sodium', reason: 'Lower sodium reduces blood pressure by 5-6 mmHg' },
      saturated_fat_100g: { max: 3, unit: 'g', label: 'Saturated Fat', reason: 'Saturated fat increases cardiovascular risk' }
    },
    positiveIngredients: [
      { name: 'potassium', benefit: 'Balances sodium, relaxes blood vessel walls' },
      { name: 'bananas', benefit: 'High potassium (422mg) helps lower blood pressure' },
      { name: 'dark leafy greens', benefit: 'Nitrates improve blood flow, lower pressure' },
      { name: 'beets', benefit: 'Nitric oxide production dilates blood vessels' },
      { name: 'garlic', benefit: 'May lower blood pressure by 5-8 mmHg' }
    ],
    recommendations: [
      '✅ DASH diet - proven to lower blood pressure',
      '✅ Aim for <1500mg sodium daily (1/2 teaspoon salt)',
      '✅ Increase potassium-rich foods (4700mg daily)',
      '✅ Choose fresh over processed foods',
      '❌ Limit alcohol - max 1-2 drinks daily',
      '❌ Avoid canned soups, deli meats, pickles'
    ],
    sources: [
      'CDC High Blood Pressure Prevention Guidelines',
      'American Heart Association DASH Diet',
      'National Heart, Lung, and Blood Institute'
    ]
  },
  
  generalHealth: {
    id: 'generalHealth',
    name: 'General Healthy Eating',
    icon: '🥗',
    description: 'Balanced diet, avoid highly processed foods',
    avoidIngredients: [
      { 
        name: 'high fructose corn syrup', 
        severity: SEVERITY.HIGH,
        reason: 'Linked to obesity, metabolic syndrome, liver disease',
        source: 'Journal of Clinical Investigation'
      },
      { 
        name: 'partially hydrogenated oil', 
        severity: SEVERITY.CRITICAL,
        reason: 'Trans fats banned by FDA - increase disease risk',
        source: 'FDA'
      },
      { 
        name: 'artificial colors', 
        severity: SEVERITY.MODERATE,
        reason: 'Some linked to hyperactivity, allergic reactions',
        source: 'European Food Safety Authority'
      },
      { 
        name: 'sodium benzoate', 
        severity: SEVERITY.MODERATE,
        reason: 'Preservative that may form benzene with vitamin C',
        source: 'FDA'
      },
      { 
        name: 'msg', 
        severity: SEVERITY.MODERATE,
        reason: 'Flavor enhancer - sensitivity in some individuals',
        source: 'FDA GRAS Review'
      },
      'corn syrup', 'hydrogenated oil', 'artificial flavor', 'monosodium glutamate'
    ],
    nutrientLimits: {
      sugar_100g: { max: 15, unit: 'g', label: 'Sugar', reason: 'WHO recommends <10% calories from added sugars' },
      sodium_100g: { max: 400, unit: 'mg', label: 'Sodium', reason: 'Excess sodium linked to multiple health risks' },
      saturated_fat_100g: { max: 7, unit: 'g', label: 'Saturated Fat', reason: 'Limit to <10% of daily calories' }
    },
    positiveIngredients: [
      { name: 'whole grains', benefit: 'Fiber, B vitamins, reduce chronic disease risk' },
      { name: 'fruits', benefit: 'Antioxidants, vitamins, fiber for overall health' },
      { name: 'vegetables', benefit: 'Phytonutrients, low calorie, high nutrient density' },
      { name: 'lean protein', benefit: 'Essential amino acids, muscle maintenance' },
      { name: 'healthy fats', benefit: 'Omega-3, monounsaturated fats support brain and heart' }
    ],
    recommendations: [
      '✅ Choose whole, minimally processed foods',
      '✅ Aim for 5+ servings fruits/vegetables daily',
      '✅ Read ingredient labels - fewer is better',
      '✅ Balance macronutrients: 45-65% carbs, 20-35% fat, 10-35% protein',
      '❌ Avoid ultra-processed foods with long ingredient lists',
      '❌ Limit added sugars to <25g daily (women), <36g (men)'
    ],
    sources: [
      'WHO Healthy Diet Guidelines',
      'USDA Dietary Guidelines for Americans',
      'Harvard School of Public Health Nutrition Source'
    ]
  }
}

export const getConditionById = (id) => HEALTH_CONDITIONS[id]

export const getAllConditions = () => Object.values(HEALTH_CONDITIONS)
