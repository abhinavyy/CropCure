import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    features: "Features",
    about: "About",
    contact: "Contact",
    news: "News",
    language: "Language",
    
    // Hero
    heroTitle: "Smart Farming Solutions for the Modern Grower",
    heroSubtitle: "Protect Your Harvest, Boost Your Profits",
    getStarted: "Get Started",
    tryAi: "Try AI Diagnosis",
    scroll: "Scroll to explore",
    
    // Global Challenge
    challengeTitle: "The Global Challenge",
    challengeSubtitle: "Why modern agriculture needs AI-driven solutions",
    stat1Label: "Global crop production lost annually to pests and diseases.",
    stat2Label: "Economic loss to the global economy each year.",
    stat3Label: "Estimated annual value of crop loss in India due to diseases.",
    
    // Features
    ourFeatures: "Our Features",
    featuresSubtitle: "AI-powered tools designed for modern agriculture",
    diseaseTitle: "Plant Disease Detection",
    diseaseDesc: "Identify crop ailments instantly using advanced CNN models. Get tailored treatment and prevention plans.",
    diseaseBtn: "Launch Scanner",
    calendarTitle: "Crop Calendar",
    calendarDesc: "Optimize your planting schedule with regional crop cycles and seasonal yield maximization strategies.",
    calendarBtn: "View Schedule",
    indoorTitle: "Indoor Plant Techniques",
    indoorDesc: "Master the art of indoor gardening with AI recommendations for lighting, humidity, and soil care.",
    indoorBtn: "Learn More",
    weatherTitle: "Weather Forecast",
    weatherDesc: "Stay ahead of the elements with hyper-local agricultural weather updates and severe weather alerts.",
    weatherBtn: "Check Forecast",
    newsTitle: "Crop Intelligence",
    newsDesc: "Get the latest real-time agricultural news, market trends, and expert insights from around the globe.",
    newsBtn: "Read News",
    
    // About
    aboutTitle: "About CropCure",
    aboutSubtitle: "Bridging the gap between traditional farming and Artificial Intelligence.",
    visionTitle: "Our Vision",
    visionDesc1: "CropCure was born out of a desire to empower farmers with the same advanced technology that drives global industries. We believe that AI shouldn't just be for tech giants—it should be in the hands of the people who feed the world.",
    visionDesc2: "By combining Deep Learning models with real-time agricultural data, we provide instant, actionable insights that help reduce crop loss and increase overall yield.",
    whyChoose: "Why Choose Us?",
    aiPrecision: "AI Precision",
    aiPrecisionDesc: "State-of-the-art CNN models for accurate disease identification.",
    accessible: "Accessible",
    accessibleDesc: "Designed to work for farmers across different regions and languages.",
    practical: "Practical",
    practicalDesc: "Actionable advice including symptoms, treatment, and prevention.",
    commitment: "Our Commitment",
    commitmentDesc: "We are committed to continuous innovation. As agricultural challenges evolve with climate change, CropCure will continue to adapt, providing the tools necessary for sustainable and profitable farming.",
    
    // Footer
    brandDesc: "Revolutionizing agriculture through AI-driven insights. We empower farmers with smart technology to ensure sustainable growth and healthier harvests for the future.",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    rights: "All rights reserved.",
    
    // Planner Page
    plannerTitle: "Crop Calendar",
    plannerSubtitle: "The 12-month crop calendar provides a clear overview of planting seasons, with each crop highlighted in its ideal growing months.",
    cropsInDb: "Crops in Database",
    regionsCovered: "Regions Covered",
    selectLocation: "Select Your Location",
    chooseRegion: "Choose your region to see crop recommendations",
    currentlyViewing: "Currently viewing:",
    plantingCalendarFor: "Planting Calendar for",
    cropsSuitableFor: "crops suitable for",
    noCropsFound: "No Crops Found",
    tryDifferentRegion: "No crops available for the selected region. Please try a different region.",
    plantingTime: "Planting Time:",
    allPlantingMonths: "All Planting Months:",
    recommendation: "Recommendation:",
    yearRound: "Year-round",
    seasonal: "Seasonal",
    
    // Indoor Page
    indoorHeroTitle: "Indoor Plant Advisor",
    indoorHeroSubtitle: "Master the art of indoor gardening with AI-driven insights for lighting, humidity, and soil care.",
    growingTips: "Growing Tips",
    lightLevel: "Light Level",
    waterNeeds: "Water Needs",
    difficulty: "Difficulty",

    // Indoor Steps
    step1Title: "Choose Your Plant Type",
    step2Title: "Assess Light Conditions",
    step3Title: "Define Your Experience Level",
    step4Title: "Evaluate Available Space",
    stepLabel: "Step",
    of: "of",
    previous: "Previous",
    getRecommendations: "Get Recommendations",
    analyzing: "Analyzing...",
    recommendationsForYou: "Recommendations For You",
    basedOnSelection: "Based on your selections, we recommend these techniques",
    restart: "Restart Advisor",
    
    // Weather Page
    weatherHeroTitle: "Weather Forecast",
    weatherHeroSubtitle: "Hyper-local agricultural weather updates and severe weather alerts.",
    currentWeather: "Current Weather",
    forecast7Days: "7-Day Forecast",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    chanceOfRain: "Chance of Rain",

    // Disease Detection Page
    diseaseDetectionTitle: "Plant Disease Detection",
    diseaseDetectionSubtitle: "Upload an image of your plant, and our AI will detect possible diseases with expert recommendations.",
    uploadImage: "Upload Plant Image",
    chooseFile: "Choose File",
    detectDiseaseBtn: "Detect Disease",
    howItWorks: "How it works",
    step1: "Snap a Photo: Take a clear picture of the plant leaf showing the symptoms.",
    step2: "AI Analysis: Our powerful AI instantly analyzes your photo to identify the specific disease.",
    step3: "Get Your Plan: Receive an instant diagnosis and a step-by-step treatment plan to save your crop.",
    predictionResults: "Prediction Results",
    noPredictions: "No predictions yet. Upload an image to start.",
    symptoms: "Symptoms",
    treatment: "Treatment",
    prevention: "Prevention",
    govSchemes: "Government Schemes",
    helpfulResources: "Helpful Resources",
    farmerHelpline: "Farmer Helpline",
    on: "on",

    // Chatbot
    botName: "CropCure Bot",
    botGreeting: "Hello! I'm CropCure Bot. How can I help you with your plants today?",
    askPlaceholder: "Ask about your plant...",
    online: "Online",
    clickToOpen: "Click to open",
    askHere: "Ask Here",
  },
  hi: {
    // Navbar
    features: "विशेषताएं",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    news: "समाचार",
    language: "भाषा",
    
    // Hero
    heroTitle: "आधुनिक किसान के लिए स्मार्ट खेती समाधान",
    heroSubtitle: "अपनी फसल की रक्षा करें, अपना लाभ बढ़ाएं",
    getStarted: "शुरू करें",
    tryAi: "AI रोग निदान",
    scroll: "खोजने के लिए स्क्रॉल करें",
    
    // Global Challenge
    challengeTitle: "वैश्विक चुनौती",
    challengeSubtitle: "आधुनिक कृषि को AI समाधानों की आवश्यकता क्यों है",
    stat1Label: "कीटों और बीमारियों के कारण सालाना वैश्विक फसल उत्पादन का नुकसान।",
    stat2Label: "हर साल वैश्विक अर्थव्यवस्था को होने वाला आर्थिक नुकसान।",
    stat3Label: "बीमारियों के कारण भारत में फसल नुकसान का अनुमानित वार्षिक मूल्य।",
    
    // Features
    ourFeatures: "हमारी विशेषताएं",
    featuresSubtitle: "आधुनिक कृषि के लिए डिज़ाइन किए गए AI-संचालित उपकरण",
    diseaseTitle: "पौधों के रोग की पहचान",
    diseaseDesc: "उन्नत CNN मॉडल का उपयोग करके फसल की बीमारियों की तुरंत पहचान करें। उपचार और रोकथाम योजनाएं प्राप्त करें।",
    diseaseBtn: "स्कैनर शुरू करें",
    calendarTitle: "फसल कैलेंडर",
    calendarDesc: "क्षेत्रीय फसल चक्रों और मौसमी उपज रणनीतियों के साथ अपने रोपण कार्यक्रम को अनुकूलित करें।",
    calendarBtn: "शेड्यूल देखें",
    indoorTitle: "इनडोर प्लांट तकनीक",
    indoorDesc: "प्रकाश, आर्द्रता और मिट्टी की देखभाल के लिए AI सिफारिशों के साथ इनडोर बागवानी में महारत हासिल करें।",
    indoorBtn: "और जानें",
    weatherTitle: "मौसम का पूर्वानुमान",
    weatherDesc: "हाइपर-लोकल कृषि मौसम अपडेट और गंभीर मौसम अलर्ट के साथ तत्वों से आगे रहें।",
    weatherBtn: "पूर्वानुमान जांचें",
    newsTitle: "फसल बुद्धिमत्ता",
    newsDesc: "दुनिया भर से नवीनतम वास्तविक समय की कृषि समाचार, बाजार के रुझान और विशेषज्ञ अंतर्दृष्टि प्राप्त करें।",
    newsBtn: "समाचार पढ़ें",
    
    // About
    aboutTitle: "CropCure के बारे में",
    aboutSubtitle: "पारंपरिक खेती और आर्टिफिशियल इंटेलिजेंस के बीच की दूरी को पाटना।",
    visionTitle: "हमारा दृष्टिकोण",
    visionDesc1: "CropCure का जन्म किसानों को उसी उन्नत तकनीक से सशक्त बनाने की इच्छा से हुआ था जो वैश्विक उद्योगों को चलाती है। हमारा मानना है कि AI केवल टेक दिग्गजों के लिए नहीं होना चाहिए—इसे उन लोगों के हाथों में होना चाहिए जो दुनिया को खाना खिलाते हैं।",
    visionDesc2: "रीयल-टाइम कृषि डेटा के साथ डीप लर्निंग मॉडल को जोड़कर, हम त्वरित, कार्रवाई योग्य अंतर्दृष्टि प्रदान करते हैं जो फसल के नुकसान को कम करने और समग्र उपज बढ़ाने में मदद करती है।",
    whyChoose: "हमें क्यों चुनें?",
    aiPrecision: "AI सटीकता",
    aiPrecisionDesc: "सटीक रोग पहचान के लिए अत्याधुनिक CNN मॉडल।",
    accessible: "सुलभ",
    accessibleDesc: "विभिन्न क्षेत्रों और भाषाओं के किसानों के लिए काम करने के लिए डिज़ाइन किया गया।",
    practical: "व्यावहारिक",
    practicalDesc: "लक्षण, उपचार और रोकथाम सहित कार्रवाई योग्य सलाह।",
    commitment: "हमारी प्रतिबद्धता",
    commitmentDesc: "हम निरंतर नवाचार के लिए प्रतिबद्ध हैं। जैसे-जैसे जलवायु परिवर्तन के साथ कृषि चुनौतियां विकसित होती हैं, CropCure टिकाऊ और लाभदायक खेती के लिए आवश्यक उपकरण प्रदान करना जारी रखेगा।",
    
    // Footer
    brandDesc: "AI-संचालित अंतर्दृष्टि के माध्यम से कृषि में क्रांति लाना। हम भविष्य के लिए स्थायी विकास और स्वस्थ फसल सुनिश्चित करने के लिए स्मार्ट तकनीक के साथ किसानों को सशक्त बनाते हैं।",
    quickLinks: "त्वरित लिंक",
    contactUs: "संपर्क करें",
    rights: "सर्वाधिकार सुरक्षित।",

    // Planner Page
    plannerTitle: "फसल कैलेंडर",
    plannerSubtitle: "12 महीने का फसल कैलेंडर रोपण के मौसम का स्पष्ट अवलोकन प्रदान करता है, जिसमें प्रत्येक फसल को उसके आदर्श बढ़ते महीनों में हाइलाइट किया गया है।",
    cropsInDb: "डेटाबेस में फसलें",
    regionsCovered: "कवर किए गए क्षेत्र",
    selectLocation: "अपना स्थान चुनें",
    chooseRegion: "फसल सिफारिशें देखने के लिए अपना क्षेत्र चुनें",
    currentlyViewing: "वर्तमान में देख रहे हैं:",
    plantingCalendarFor: "रोपण कैलेंडर इसके लिए",
    cropsSuitableFor: "फसलें इसके लिए उपयुक्त",
    noCropsFound: "कोई फसल नहीं मिली",
    tryDifferentRegion: "चयनित क्षेत्र के लिए कोई फसल उपलब्ध नहीं है। कृपया दूसरा क्षेत्र चुनें।",
    plantingTime: "रोपण का समय:",
    allPlantingMonths: "सभी रोपण महीने:",
    recommendation: "सिफारिश:",
    yearRound: "साल भर",
    seasonal: "मौसमी",
    
    // Indoor Page
    indoorHeroTitle: "इनडोर प्लांट एडवाइजर",
    indoorHeroSubtitle: "प्रकाश, आर्द्रता और मिट्टी की देखभाल के लिए AI-संचालित अंतर्दृष्टि के साथ इनडोर बागवानी की कला में महारत हासिल करें।",
    growingTips: "बढ़ने के टिप्स",
    lightLevel: "प्रकाश स्तर",
    waterNeeds: "पानी की जरूरतें",
    difficulty: "कठिनाई",

    // Indoor Steps
    step1Title: "अपने पौधे का प्रकार चुनें",
    step2Title: "प्रकाश की स्थिति का आकलन करें",
    step3Title: "अपना अनुभव स्तर चुनें",
    step4Title: "उपलब्ध स्थान का मूल्यांकन करें",
    stepLabel: "चरण",
    of: "में से",
    previous: "पिछला",
    getRecommendations: "सिफारिशें प्राप्त करें",
    analyzing: "विश्लेषण किया जा रहा है...",
    recommendationsForYou: "आपके लिए सिफारिशें",
    basedOnSelection: "आपके चयन के आधार पर, हम इन तकनीकों की सलाह देते हैं",
    restart: "एडवाइजर फिर से शुरू करें",
    
    // Weather Page
    weatherHeroTitle: "मौसम का पूर्वानुमान",
    weatherHeroSubtitle: "हाइपर-लोकल कृषि मौसम अपडेट और गंभीर मौसम अलर्ट।",
    currentWeather: "वर्तमान मौसम",
    forecast7Days: "7-दिन का पूर्वानुमान",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    chanceOfRain: "बारिश की संभावना",

    // Disease Detection Page
    diseaseDetectionTitle: "पौधों के रोग की पहचान",
    diseaseDetectionSubtitle: "अपने पौधे की एक छवि अपलोड करें, और हमारा AI विशेषज्ञ सिफारिशों के साथ संभावित रोगों का पता लगाएगा।",
    uploadImage: "पौधे की छवि अपलोड करें",
    chooseFile: "फ़ाइल चुनें",
    detectDiseaseBtn: "रोग का पता लगाएं",
    howItWorks: "यह कैसे काम करता है",
    step1: "फोटो लें: लक्षणों को दिखाने वाले पौधे की पत्ती की एक स्पष्ट तस्वीर लें।",
    step2: "AI विश्लेषण: हमारा शक्तिशाली AI विशिष्ट बीमारी की पहचान करने के लिए आपकी फोटो का तुरंत विश्लेषण करता है।",
    step3: "अपनी योजना प्राप्त करें: अपनी फसल बचाने के लिए तुरंत निदान और चरण-दर-चरण उपचार योजना प्राप्त करें।",
    predictionResults: "भविष्यवाणी के परिणाम",
    noPredictions: "अभी तक कोई भविष्यवाणी नहीं है। शुरू करने के लिए एक छवि अपलोड करें।",
    symptoms: "लक्षण",
    treatment: "उपचार",
    prevention: "रोकथाम",
    govSchemes: "सरकारी योजनाएं",
    helpfulResources: "उपयोगी संसाधन",
    farmerHelpline: "किसान हेल्पलाइन",
    on: "पर",

    // Chatbot
    botName: "CropCure बॉट",
    botGreeting: "नमस्ते! मैं CropCure बॉट हूँ। आज मैं आपके पौधों के बारे में आपकी कैसे मदद कर सकता हूँ?",
    askPlaceholder: "अपने पौधे के बारे में पूछें...",
    online: "ऑनलाइन",
    clickToOpen: "खोलने के लिए क्लिक करें",
    askHere: "यहाँ पूछें",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
