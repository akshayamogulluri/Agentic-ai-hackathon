/**
 * AgriSaarthi AI - Core JS Application Logic
 * Implements bilingual engine, simulated AI agents, speech APIs, and the Hackathon Demo controller.
 */

// Application State
const appState = {
    currentLanguage: 'english', // 'english' or 'telugu'
    currentView: 'landing-view',
    currentPane: 'dashboard-pane',
    farmerProfile: {
        name: 'Ravi Kumar',
        state: 'Telangana',
        district: 'Suryapet',
        village: 'Chivvemla',
        crop: 'Rice',
        variety: 'Telangana Sona (BPT 5204)',
        size: 4,
        stage: 'Vegetative',
        soil: 'Clayey',
        irrigation: 'Drip Irrigation',
        sowingDate: '2026-07-01',
        harvestDate: '2026-11-15'
    },
    demoStep: 0,
    chatMessages: [
        {
            sender: 'system',
            text: 'Namaste! I am AgriSaarthi AI, your farming companion. Ask me any question using text or voice, or upload crop pictures.',
            textTe: 'నమస్తే! నేను అగ్రిసారథి AI. మీ పంట ఫోటోలను అప్‌లోడ్ చేసి లేదా వాయిస్ ద్వారా ప్రశ్నలు అడగవచ్చు.'
        }
    ],
    isRecording: false,
    synth: window.speechSynthesis,
    activeSpeechUtterance: null,
    isSpeechEnabled: true
};

// Bilingual dictionary for translation
// Bilingual/Multilingual dictionary for translation
const bilingualDict = {
    // Hero & Landing
    'hero_badge_text': {
        english: 'Smarter Decisions. Healthier Farms.',
        telugu: 'తెలివైన నిర్ణయాలు • ఆరోగ్యకరమైన పంటలు',
        hindi: 'स्मार्ट निर्णय। स्वस्थ खेत।',
        tamil: 'சிறந்த முடிவுகள். ஆரோக்கியமான பண்ணைகள்.',
        kannada: 'ಉತ್ತಮ ನಿರ್ಧಾರಗಳು. ಆರೋಗ್ಯಕರ ಜಮೀನು.'
    },
    'hero_title_1': {
        english: 'Your Farm. Your Data.',
        telugu: 'మీ పొలం. మీ డేటా.',
        hindi: 'आपका खेत। आपका डेटा।',
        tamil: 'உங்கள் பண்ணை. உங்கள் தரவு.',
        kannada: 'ನಿಮ್ಮ ಜಮೀನು. ನಿಮ್ಮ ಡೇಟಾ.'
    },
    'hero_title_2': {
        english: 'Your AI Farming Companion.',
        telugu: 'మీ వ్యవసాయ AI సారథి.',
        hindi: 'आपका एआई खेती साथी।',
        tamil: 'உங்கள் AI விவசாய துணை.',
        kannada: 'ನಿಮ್ಮ AI ಕೃಷಿ ಸಂಗಾತಿ.'
    },
    'hero_subtitle': {
        english: 'Understand your crops, soil, weather, pests, and markets — all in one visual, voice-enabled app tailored for Indian farmers.',
        telugu: 'మీ పంటలు, మట్టి, వాతావరణం, తెగుళ్లు మరియు మార్కెట్ ధరలను ఒకే చోట - వాయిస్ మరియు దృశ్య రూపాల్లో సుభంగా అర్థం చేసుకోండి.',
        hindi: 'अपनी फसलों, मिट्टी, मौसम, कीटों और बाजारों को समझें — सब एक दृश्य, आवाज-सक्षम ऐप में जो भारतीय किसानों के लिए तैयार किया गया है।',
        tamil: 'உங்கள் பயிர்கள், மண், வானிலை, பூச்சிகள் மற்றும் சந்தைகளை புரிந்து கொள்ளுங்கள் — அனைத்தும் ஒரே காட்சி, குரல்-செயல்படுத்தப்பட்ட செயலியில், இந்திய விவசாயிகளுக்காக வடிவமைக்கப்பட்டது.',
        kannada: 'ನಿಮ್ಮ ಬೆಳೆಗಳು, ಮಣ್ಣು, ಹವಾಮಾನ, ಕೀಟಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ — ಎಲ್ಲವೂ ಒಂದೇ ದೃಶ್ಯ, ಧ್ವನಿ ಸಕ್ರಿಯಗೊಳಿಸಿದ ಆ್ಯಪ್‌ನಲ್ಲಿ, ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.'
    },
    'get_started_btn': {
        english: 'Get Started',
        telugu: 'ప్రారంభించండి',
        hindi: 'शुरू करें',
        tamil: 'தொடங்குங்கள்',
        kannada: 'ಪ್ರಾರಂಭಿಸಿ'
    },
    'try_voice_btn': {
        english: 'Try AI Voice Assistant',
        telugu: 'AI వాయిస్ అసిస్టెంట్',
        hindi: 'एआई वॉयस असिस्टेंट आजमाएं',
        tamil: 'AI குரல் உதவியாளரை முயற்சிக்கவும்',
        kannada: 'AI ಧ್ವನಿ ಸಹಾಯಕವನ್ನು ಪ್ರಯತ್ನಿಸಿ'
    },
    'features_title': {
        english: 'One Platform. Multiple Specialized AI Agents.',
        telugu: 'ఒకే వేదిక. బహుళ ప్రత్యేక AI ఏజెంట్లు.',
        hindi: 'एक मंच। कई विशेष एआई एजेंट।',
        tamil: 'ஒரே தளம். பல சிறப்பு வாய்ந்த AI முகவர்கள்.',
        kannada: 'ಒಂದೇ ವೇದಿಕೆ. ಬಹು ವಿಶೇಷ AI ಏಜೆಂಟ್‌ಗಳು.'
    },
    'features_subtitle': {
        english: 'Our agents collaborate to provide you with one unified, understandable recommendation.',
        telugu: 'అన్ని వ్యవసాయ ఏజెంట్లు కలిసికట్టుగా విశ్లేషించి మీకు ఒకే ఒక ఖచ్చితమైన ఉచిత సలహాను అందిస్తాయి.',
        hindi: 'हमारे एजेंट आपको एक एकीकृत, समझने योग्य सिफारिश प्रदान करने के लिए सहयोग करते हैं.',
        tamil: 'எங்கள் முகவர்கள் உங்களுக்கு ஒரு ஒருங்கிணைந்த, புரிந்துகொள்ளக்கூடிய பரிந்துரையை வழங்க ஒத்துழைக்கிறார்கள்.',
        kannada: 'ನಮ್ಮ ಏಜೆಂಟ್‌ಗಳು ನಿಮಗೆ ಒಂದು ಏಕೀಕೃತ, ಅರ್ಥವಾಗುವ ಶಿಫಾರಸನ್ನು ನೀಡಲು ಸಹಕರಿಸುತ್ತಾರೆ.'
    },
    'feat_crop_title': {
        english: 'Crop Intelligence',
        telugu: 'పంట విశ్లేషణ ఏజెంట్',
        hindi: 'फसल इंटेलिजेंस',
        tamil: 'பயிர் நுண்ணறிவு',
        kannada: 'ಬೆಳೆ ಇಂಟೆಲಿಜೆನ್ಸ್'
    },
    'feat_crop_desc': {
        english: 'Analyzes crop leaf, stem, and root images to diagnose deficiencies, stress, and disease symptoms instantly.',
        telugu: 'పంట ఆకులు, కాండం ఫోటోలను విశ్లేషించి తెగుళ్లు, పోషకాహార లోపాలను తక్షణమే గుర్తిస్తుంది.',
        hindi: 'कमियों, तनाव और बीमारी के लक्षणों का तुरंत निदान करने के लिए फसल के पत्ते, तने और जड़ की छवियों का विश्लेषण करता है।',
        tamil: 'குறைபாடுகள், மன அழுத்தம் மற்றும் நோய் அறிகுறிகளை உடனடியாகக் கண்டறிய பயிர் இலை, தண்டு மற்றும் வேர் படங்களை பகுப்பாய்வு செய்கிறது.',
        kannada: 'ಬೆಳೆ ಎಲೆ, ಕಾಂಡ ಮತ್ತು ಬೇರುಗಳ ಚಿತ್ರಗಳನ್ನು ವಿಲೇಷಿಸಿ ಕೊರತೆಗಳು, ಒತ್ತಡ ಮತ್ತು ರೋಗಲಕ್ಷಣಗಳನ್ನು ತಕ್ಷಣವೇ ಪತ್ತೆ ಮಾಡುತ್ತದೆ.'
    },
    'feat_weather_title': {
        english: 'Weather Intelligence',
        telugu: 'వాతావరణ ఏజెంట్',
        hindi: 'मौसम इंटेलिजेंस',
        tamil: 'வானிலை நுண்ணறிவு',
        kannada: 'ಹವಾಮಾನ ಇಂಟೆಲಿಜೆನ್ಸ್'
    },
    'feat_weather_desc': {
        english: 'Translates standard forecasts into direct farm advisories (spraying suitability, harvesting conditions).',
        telugu: 'వాతావరణ సూచనలను వ్యవసాయ సలహాలుగా (మందులు కొట్టే సమయం, కోతకు అనుకూలత) మారుస్తుంది.',
        hindi: 'मानक पूर्वानुमानों को सीधे कृषि सलाह (छिड़काव उपयुक्तता, कटाई की स्थिति) में अनुवादित करता है।',
        tamil: 'நிலையான கணிப்புகளை நேரடி பண்ணை ஆலோசனைகளாக (தெளிப்பதற்கான பொருத்தம், அறுவடை நிலைமைகள்) மொழிபெயர்க்கிறது.',
        kannada: 'ಸಾಮಾನ್ಯ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ನೇರ ಕೃಷಿ ಸಲಹೆಗಳಾಗಿ (ಸಿಂಪರಣೆ ಸೂಕ್ತತೆ, ಕೊಯ್ಲು ಪರಿಸ್ಥಿತಿಗಳು) ಪರಿವರ್ತಿಸುತ್ತದೆ.'
    },
    'feat_soil_title': {
        english: 'Soil & Irrigation',
        telugu: 'మట్టి & నీటి యాజమాన్యం',
        hindi: 'मिट्टी और सिंचाई',
        tamil: 'மண் மற்றும் நீர்ப்பாசனம்',
        kannada: 'ಮಣ್ಣು ಮತ್ತು ನೀರಾವರಿ'
    },
    'feat_soil_desc': {
        english: 'Evaluates soil pH, moisture, and NPK data to schedule precise, water-saving irrigation routines.',
        telugu: 'మట్టి pH, తేమ మరియు NPK లవణాలను బట్టి నీటి పారుదల సమయాలను ఖచ్చితంగా సూచిస్తుంది.',
        hindi: 'सटीक, पानी बचाने वाली सिंचाई दिनचर्या निर्धारित करने के लिए मिट्टी के पीएच, नमी और एनपीके डेटा का मूल्यांकन करता है।',
        tamil: 'துல்லியமான, நீர் சேமிப்பு நீர்ப்பாசன முறைகளை திட்டமிட மண்ணின் pH, ஈரப்பதம் மற்றும் NPK தரவை மதிப்பிடுகிறது.',
        kannada: 'ನಿಖರವಾದ, ನೀರು ಉಳಿಸುವ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ರೂಪಿಸಲು ಮಣ್ಣಿನ pH, ತೇವಾಂಶ ಮತ್ತು NPK ಡೇಟಾವನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.'
    },
    'feat_pest_title': {
        english: 'Pest & Disease Risk',
        telugu: 'తెగుళ్ల ముందస్తు హెచ్చరిక',
        hindi: 'कीट और रोग जोखिम',
        tamil: 'பூச்சி மற்றும் நோய் ஆபத்து',
        kannada: 'ಕೀಟ ಮತ್ತು ರೋಗದ ಅಪಾಯ'
    },
    'feat_pest_desc': {
        english: 'Identifies localized outbreak alerts and separates immediate treatment options from preventive care.',
        telugu: 'స్థానిక ప్రాంతంలో తెగుళ్ల వ్యాప్తిని హెచ్చరిస్తూ, నివారణ మరియు చికిత్స మార్గాలను వేరుగా చూపుతుంది.',
        hindi: 'स्थानीयकृत प्रकोप अलर्ट की पहचान करता है और निवारक देखभाल से तत्काल उपचार विकल्पों को अलग करता है।',
        tamil: 'உள்ளூர்மயமாக்கப்பட்ட நோய் பரவல் எச்சரிக்கைகளை அடையாளம் கண்டு, தடுப்பு கவனிப்பிலிருந்து உடனடி சிகிச்சை விருப்பங்களை பிரிக்கிறது.',
        kannada: 'ಸ್ಥಳೀಯ ಕೀಟ ಬಾಧೆಯ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಗುರುತಿಸುತ್ತದೆ ಮತ್ತು ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳಿಂದ ತಕ್ಷಣದ ಚಿಕಿತ್ಸಾ ಆಯ್ಕೆಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸುತ್ತದೆ.'
    },
    'feat_market_title': {
        english: 'Market Intelligence',
        telugu: 'మార్కెట్ విశ్లేషణ',
        hindi: 'बाजार इंटेलिजेंस',
        tamil: 'சந்தை நுண்ணறிவு',
        kannada: 'ಮಾರುಕಟ್ಟೆ ಇಂಟೆಲಿಜೆನ್ಸ್'
    },
    'feat_market_desc': {
        english: 'Monitors crop prices in neighboring mandis to suggest optimal harvest sales windows.',
        telugu: 'సమీప మార్కెట్ ధరలను పర్యవేక్షిస్తూ, మీ పంటను లాభసాటిగా ఎప్పుడు అమ్మాలో సూచిస్తుంది.',
        hindi: 'इष्टतम फसल बिक्री खिड़कियों का सुझाव देने के लिए पड़ोसी मंडियों में फसल की कीमतों की निगरानी करता है।',
        tamil: 'சிறந்த அறுவடை விற்பனை நேரத்தை பரிந்துரைக்க அண்டை மண்டிகளில் பயிர் விலைகளைக் கண்காணிக்கிறது.',
        kannada: 'ಸೂಕ್ತ ಬೆಳೆ ಮಾರಾಟ ಸಮಯವನ್ನು ಸೂಚಿಸಲು ನೆರೆಯ ಮಂಡಿಗಳಲ್ಲಿ ಬೆಳೆ ಬೆಲೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತದೆ.'
    },
    'feat_decision_title': {
        english: 'Farm Decision AI',
        telugu: 'సమగ్ర నిర్ణయ ఏజెంట్',
        hindi: 'फार्म डिसीजन एआई',
        tamil: 'பண்ணை முடிவு AI',
        kannada: 'ಕೃಷಿ ನಿರ್ಧಾರ AI'
    },
    'feat_decision_desc': {
        english: 'Combines findings from all agents into a single, cohesive daily dashboard recommendation.',
        telugu: 'అన్ని ఏజెంట్ల విశ్లేషణను కలిపి రైతుకు నేరుగా అర్థమయ్యే ఒకే ఒక ఉత్తమ నిర్ణయాన్ని ఇస్తుంది.',
        hindi: 'सभी एजेंटों के निष्कर्षों को एक एकल, समेकित दैनिक डैशबोर्ड सिफारिश में जोड़ता है।',
        tamil: 'அனைத்து முகவர்களின் கண்டுபிடிப்புகளையும் ஒரே, ஒத்திசைவான தினசரி டாஷ்போர்டு பரிந்துரையாக இணைக்கிறது.',
        kannada: 'ಎಲ್ಲಾ ಏಜೆಂಟ್‌ಗಳ ಸಂಶೋಧನೆಗಳನ್ನು ಒಂದು ಏಕೀಕೃತ ದೈನಂದಿನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಶಿಫಾರಸಿನಲ್ಲಿ ಸಂಯೋಜಿಸುತ್ತದೆ.'
    },
    'showcase_badge_1': {
        english: 'Pesticide Label Analyzer',
        telugu: 'మందుల లేబుల్ విశ్లేషణ',
        hindi: 'कीटनाशक लेबल विश्लेषक',
        tamil: 'பூச்சிக்கொல்லி லேபிள் பகுப்பாய்வி',
        kannada: 'ಕೀಟನಾಶಕ ಲೇಬಲ್ ವಿಲೇಷಕ'
    },
    'showcase_badge_2': {
        english: 'Voice & Accessibility First',
        telugu: 'స్వర సహాయం - అందరికీ అందుబాటులో',
        hindi: 'आवाज और पहुंच पहले',
        tamil: 'குரல் மற்றும் அணுகல் முதலில்',
        kannada: 'ಧ್ವನಿ ಮತ್ತು ಪ್ರವೇಶಿಸುವಿಕೆ ಮೊದಲು'
    },
    'showcase_badge_3': {
        english: 'AI + Local Community',
        telugu: 'AI + రైతు వేదిక',
        hindi: 'एआई + स्थानीय समुदाय',
        tamil: 'AI + உள்ளூர் சமூகம்',
        kannada: 'AI + ಸ್ಥಳೀಯ ಸಮುದಾಯ'
    },
    'showcase_title_1': {
        english: 'Check Before You Spray',
        telugu: 'మందు కొట్టే ముందు చెక్ చేయండి',
        hindi: 'छिड़काव करने से पहले जांचें',
        tamil: 'தெளிப்பதற்கு முன் சரிபார்க்கவும்',
        kannada: 'ಸಿಂಪಡಿಸುವ ಮುನ್ನ ಪರಿಶೀಲಿಸಿ'
    },
    'showcase_desc_1': {
        english: 'Take a photograph of any crop pesticide or fertilizer bottle. Our Agent reads the active ingredient, evaluates usage directions, and alerts you if it is compatible with your specific crops, all while sharing vital health safety warnings.',
        telugu: 'ఏదైనా పురుగుల మందు డబ్బా ఫోటో తీయండి. AI అందులోని రసాయనాలను గుర్తించి, మీ పంటకు అది సరిపోతుందో లేదో చెబుతుంది మరియు తీసుకోవాల్సిన జాగ్రత్తలను వివరిస్తుంది.',
        hindi: 'किसी भी फसल कीटनाशक या उर्वरक की बोतल की तस्वीर लें। हमारा एजेंट सक्रिय घटक को पढ़ता है, उपयोग के निर्देशों का मूल्यांकन करता है, और आपको सचेत करता है कि क्या यह आपकी विशिष्ट फसलों के साथ संगत है, जबकि महत्वपूर्ण स्वास्थ्य सुरक्षा चेतावनियाँ साझा करता है।',
        tamil: 'ஏதேனும் பயிர் பூச்சிக்கொல்லி அல்லது உர பாட்டிலின் புகைப்படத்தை எடுக்கவும். எங்கள் முகவர் செயலில் உள்ள மூலப்பொருளைப் படித்து, பயன்பாட்டு வழிகாட்டுதல்களை மதிப்பிட்டு, உங்கள் குறிப்பிட்ட பயிர்களுடன் இணக்கமாக உள்ளதா என எச்சரிக்கிறார், அதே நேரத்தில் முக்கிய சுகாதார பாதுகாப்பு எச்சரிக்கைகளையும் பகிர்ந்து கொள்கிறார்.',
        kannada: 'ಯಾವುದೇ ಬೆಳೆ ಕೀಟನಾಶಕ ಅಥವಾ ರಸಗೊಬ್ಬರ ಬಾಟಲಿಯ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ. ನಮ್ಮ ಏಜೆಂಟ್ ಸಕ್ರಿಯ ಘಟಕಾಂಶವನ್ನು ಓದುತ್ತಾರೆ, ಬಳಕೆಯ ನಿರ್ದೇಶನಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತಾರೆ ಮತ್ತು ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಬೆಳೆಗಳೊಂದಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆಯೇ ಎಂದು ಎಚ್ಚರಿಸುತ್ತಾರೆ, ಜೊತೆಗೆ ಪ್ರಮುಖ ಆರೋಗ್ಯ ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತಾರೆ.'
    },
    'showcase_item_1_1': {
        english: 'OCR extraction of active chemical ingredients',
        telugu: 'మందు సీసాపై ఉన్న రసాయనాల గుర్తింపు',
        hindi: 'सक्रिय रासायनिक अवयवों का ओसीआर निष्कर्षण',
        tamil: 'செயலில் உள்ள இரசாயன பொருட்களின் OCR பிரித்தெடுத்தல்',
        kannada: 'ಸಕ್ರಿಯ ರಾಸಾಯನಿಕ ಪದಾರ್ಥಗಳ OCR ಹೊರತೆಗೆಯುವಿಕೆ'
    },
    'showcase_item_1_2': {
        english: 'Dynamic compatibility scoring for selected crops',
        telugu: 'పంట ఆధారిత అనుకూలత స్కోర్',
        hindi: 'चयनित फसलों के लिए गतिशील अनुकूलता स्कोरिंग',
        tamil: 'தேர்ந்தெடுக்கப்பட்ட பயிர்களுக்கான மாறும் இணக்கத்தன்மை மதிப்பெண்',
        kannada: 'ಆಯ್ದ ಬೆಳೆಗಳಿಗೆ ಡೈನಾಮಿಕ್ ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರಿಂಗ್'
    },
    'showcase_item_1_3': {
        english: 'Audio instructions read aloud in Telugu & English',
        telugu: 'తెలుగు మరియు ఇంగ్లీష్‌లలో ఆడియో రూపంలో వినే సదుపాయం',
        hindi: 'ऑडियो निर्देश तेलुगु और अंग्रेजी में जोर से पढ़े गए',
        tamil: 'குரல் வழி அறிவுறுத்தல்கள் தமிழ் மற்றும் ஆங்கிலத்தில் ஒலிக்கப்படும்',
        kannada: 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಧ್ವನಿ ಮೂಲಕ ಸೂಚನೆಗಳು ಕೇಳುತ್ತವೆ'
    },
    'showcase_title_2': {
        english: 'Talk to Your Farm AI',
        telugu: 'మీ పొలం AI తో మాట్లాడండి',
        hindi: 'अपने फार्म एआई से बात करें',
        tamil: 'உங்கள் பண்ணை AI உடன் பேசுங்கள்',
        kannada: 'ನಿಮ್ಮ ಕೃಷಿ AI ಜೊತೆಗೆ ಮಾತನಾಡಿ'
    },
    'showcase_desc_2': {
        english: 'We believe technology shouldn\'t require typing. Farmers can query the system in Telugu or English by pressing the prominent microphone button. Every diagnosis, recommendation, and market update features a high-contrast \'Listen\' audio button.',
        telugu: 'రైతులకు టైపింగ్ శ్రమ లేకుండా మైక్రోఫోన్ బటన్ నొక్కి తెలుగులోనే మాట్లాడవచ్చు. యాప్‌లోని ప్రతి సలహాను "వినండి" అనే బటన్ ద్వారా ఆడియో రూపంలో వినవచ్చు.',
        hindi: 'हमारा मानना है कि तकनीक के लिए टाइपिंग की आवश्यकता नहीं होनी चाहिए। किसान प्रमुख माइक्रोफोन बटन दबाकर हिंदी या अंग्रेजी में सिस्टम से पूछताछ कर सकते हैं। प्रत्येक निदान, सिफारिश और बाजार अपडेट में एक उच्च-विपरीत \'सुनें\' ऑडियो बटन होता है।',
        tamil: 'தொழில்நுட்பத்திற்கு தட்டச்சு தேவையில்லை என்று நாங்கள் நம்புகிறோம். முக்கிய மைக்ரோஃபோன் பொத்தானை அழுத்துவதன் மூலம் விவசாயிகள் தமிழ் அல்லது ஆங்கிலத்தில் கணினியிடம் வினவலாம். ஒவ்வொரு நோயறிதல், பரிந்துரை மற்றும் சந்தை புதுப்பிப்பு ஆகியவற்றிலும் உயர்-மாறுபட்ட \'கேள்\' ஆடியோ பொத்தான் உள்ளது.',
        kannada: 'ತಂತ್ರಜ್ಞಾನಕ್ಕೆ ಟೈಪಿಂಗ್ ಅಗತ್ಯವಿಲ್ಲ ಎಂದು ನಾವು ನಂಬುತ್ತೇವೆ. ರೈತರು ಪ್ರಮುಖ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಒತ್ತುವ ಮೂಲಕ ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಪ್ರಶ್ನಿಸಬಹುದು. ಪ್ರತಿ ರೋಗನಿರ್ಣಯ, ಶಿಫಾರಸು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ನವೀಕರಣವು ಹೆಚ್ಚು ಸ್ಪಷ್ಟವಾದ \'ಕೇಳಿ\' ಆಡಿಯೊ ಬಟನ್ ಅನ್ನು ಹೊಂದಿದೆ.'
    },
    'showcase_title_3': {
        english: 'Learn From Other Farmers',
        telugu: 'ఇతర రైతులతో కనెక్ట్ అవ్వండి',
        hindi: 'अन्य किसानों से सीखें',
        tamil: 'இதர விவசாயிகளிடமிருந்து கற்றுக்கொள்ளுங்கள்',
        kannada: 'ಇತರ ರೈತರಿಂದ ಕಲಿಯಿರಿ'
    },
    'showcase_desc_3': {
        english: 'AgriSaarthi bridges automated wisdom with community experience. When a pest is diagnosed on your farm, the system displays threads from nearby crop fields experiencing identical outbreaks. Read peer solutions and share text, images, or voice notes.',
        telugu: 'మీ పంటకు తెగులు వచ్చినప్పుడు, సమీపంలోని ఇతర రైతులు ఏ పద్ధతులు వాడి దానిని నివారించారో రైతు కనెక్ట్ వేదిక ద్వారా తెలుసుకోవచ్చు.',
        hindi: 'कृषि सारथी सामुदायिक अनुभव के साथ स्वचालित ज्ञान को जोड़ता है। जब आपके खेत में किसी कीट का निदान किया जाता है, तो सिस्टम पास के खेतों के थ्रेड प्रदर्शित करता है जो समान प्रकोपों का सामना कर रहे हैं। सहकर्मी समाधान पढ़ें और टेक्स्ट, चित्र या वॉयस नोट्स साझा करें।',
        tamil: 'அகிரிசாரதி தானியங்கி அறிவை சமூக அனுபவத்துடன் இணைக்கிறது. உங்கள் பண்ணையில் ஒரு பூச்சி கண்டறியப்படும்போது, அதே போன்ற பாதிப்புகளை எதிர்கொள்ளும் அருகிலுள்ள பயிர் வயல்களின் இழைகளை கணினி காட்டுகிறது. சக விவசாயிகளின் தீர்வுகளைப் படித்து, உரை, படங்கள் அல்லது குரல் குறிப்புகளைப் பகிர்ந்து கொள்ளுங்கள்.',
        kannada: 'ಅಗ್ರಿ ಸಾರಥಿಯು ಸ್ವಯಂಚಾಲಿತ ಜ್ಞಾನವನ್ನು ಸಮುದಾಯದ ಅನುಭವದೊಂದಿಗೆ ಜೋಡಿಸುತ್ತದೆ. ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಕೀಟ ಬಾಧೆ ಪತ್ತೆಯಾದಾಗ, ಅದೇ ರೀತಿಯ ಬಾಧೆಯನ್ನು ಎದುರಿಸುತ್ತಿರುವ ಹತ್ತಿರದ ಜಮೀನುಗಳ ವಿವರಗಳನ್ನು ಆ್ಯಪ್ ತೋರಿಸುತ್ತದೆ. ಸಹ ರೈತರ ಪರಿಹಾರಗಳನ್ನು ಓದಿ ಮತ್ತು ಪಠ್ಯ, ಚಿತ್ರಗಳು ಅಥವಾ ಧ್ವನಿ ಟಿಪ್ಪಣಿಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.'
    },
    'login_tagline': {
        english: 'Your AI Farming Companion',
        telugu: 'మీ వ్యవసాయానికి మీ AI సహాయకుడు',
        hindi: 'आपका एआई खेती साथी',
        tamil: 'உங்கள் AI விவசாய துணை',
        kannada: 'ನಿಮ್ಮ AI ಕೃಷಿ ಸಂಗಾತಿ'
    },
    'voice_help_login': {
        english: '🔊 Click here for Voice Help',
        telugu: '🔊 సహాయం కోసం ఇక్కడ నొక్కండి',
        hindi: '🔊 आवाज की मदद के लिए यहां क्लिक करें',
        tamil: '🔊 குரல் உதவிக்கு இங்கே கிளிக் செய்யவும்',
        kannada: '🔊 ಧ್ವನಿ ಸಹಾಯಕ್ಕಾಗಿ ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ'
    },
    'login_label_mobile': {
        english: 'Mobile Number / Phone',
        telugu: 'మొబైల్ సంఖ్య',
        hindi: 'मोबाइल नंबर / फोन',
        tamil: 'கைபேசி எண் / தொலைபேசி',
        kannada: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ / ಫೋನ್'
    },
    'login_label_password': {
        english: 'Password',
        telugu: 'పాస్వర్డ్',
        hindi: 'पासवर्ड',
        tamil: 'கடவுச்சொல்',
        kannada: 'ಪಾಸ್ವರ್ಡ್'
    },
    'login_btn_text': {
        english: 'Login',
        telugu: 'లాగిన్ అవ్వండి',
        hindi: 'लॉगिन करें',
        tamil: 'உள்நுழைக',
        kannada: 'ಲಾಗಿನ್ ಆಗಿ'
    },
    'or_text': {
        english: 'OR',
        telugu: 'లేదా',
        hindi: 'अथवा',
        tamil: 'அல்லது',
        kannada: 'ಅಥವಾ'
    },
    'continue_otp': {
        english: 'Continue with Mobile OTP',
        telugu: 'మొబైల్ OTP ద్వారా ప్రవేశించండి',
        hindi: 'मोबाइल ओटीपी के साथ जारी रखें',
        tamil: 'கைபேசி OTP மூலம் தொடரவும்',
        kannada: 'ಮೊಬೈಲ್ ಒಟಿಪಿ ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ'
    },
    'no_account': {
        english: 'Don\'t have an account?',
        telugu: 'ఖాతా లేదా?',
        hindi: 'खाता नहीं है?',
        tamil: 'கணக்கு இல்லையா?',
        kannada: 'ಖಾತೆ ಇಲ್ಲವೇ?'
    },
    'register_now': {
        english: 'Register Now',
        telugu: 'నమోదు చేసుకోండి',
        hindi: 'अभी पंजीकरण करें',
        tamil: 'இப்போது பதிவு செய்யவும்',
        kannada: 'ಈಗಲೇ ನೋಂದಾಯಿಸಿ'
    },
    'onboarding_subtitle': {
        english: 'Help our AI Agents tailor recommendations to your farm conditions.',
        telugu: 'ఖచ్చితమైన సలహాల కోసం మీ పొలం వివరాలను తెలపండి.',
        hindi: 'हमारे एआई एजेंटों को आपके खेत की स्थितियों के अनुसार सिफारिशों को तैयार करने में मदद करें।',
        tamil: 'உங்கள் பண்ணை நிலைமைகளுக்கு ஏற்ப பரிந்துரைகளை வடிவமைக்க எங்கள் AI முகவர்களுக்கு உதவுங்கள்.',
        kannada: 'ನಿಮ್ಮ ಜಮೀನಿನ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ತಕ್ಕಂತೆ ಶಿಫಾರಸುಗಳನ್ನು ರೂಪಿಸಲು ನಮ್ಮ AI ಏಜೆಂಟ್‌ಗಳಿಗೆ ಸಹಾಯ ಮಾಡಿ.'
    },
    'skip_btn': {
        english: 'Skip for now ➔',
        telugu: 'తర్వాత పూర్తి చేయండి ➔',
        hindi: 'अभी के लिए छोड़ें ➔',
        tamil: 'இப்போதைக்கு தவிர்க்கவும் ➔',
        kannada: 'ಸದ್ಯಕ್ಕೆ ಬಿಟ್ಟುಬಿಡಿ ➔'
    },
    'onboard_basic_title': {
        english: 'About You & Location',
        telugu: 'మీ గురించి & స్థలం వివరాలు',
        hindi: 'आपके और स्थान के बारे में',
        tamil: 'உங்களைப் பற்றி & இருப்பிடம்',
        kannada: 'ನಿಮ್ಮ ಬಗ್ಗೆ ಮತ್ತು ಸ್ಥಳದ ವಿವರ'
    },
    'onboard_name': {
        english: 'Farmer Name',
        telugu: 'రైతు పేరు',
        hindi: 'किसान का नाम',
        tamil: 'விவசாயி பெயர்',
        kannada: 'ರೈತನ ಹೆಸರು'
    },
    'onboard_state': {
        english: 'State',
        telugu: 'రాష్ట్రం',
        hindi: 'राज्य',
        tamil: 'மாநிலம்',
        kannada: 'ರಾಜ್ಯ'
    },
    'onboard_district': {
        english: 'District',
        telugu: 'జిల్లా',
        hindi: 'जिला',
        tamil: 'மாவட்டம்',
        kannada: 'ಜಿಲ್ಲೆ'
    },
    'onboard_village': {
        english: 'Village',
        telugu: 'గ్రామం',
        hindi: 'गांव',
        tamil: 'கிராமம்',
        kannada: 'ಗ್ರಾಮ'
    },
    'onboard_crop_title': {
        english: 'Crop Details',
        telugu: 'పంట వివరాలు',
        hindi: 'फसल का विवरण',
        tamil: 'பயிர் விவரங்கள்',
        kannada: 'ಬೆಳೆಯ ವಿವರಗಳು'
    },
    'onboard_crop': {
        english: 'Primary Crop',
        telugu: 'ప్రధాన పంట',
        hindi: 'मुख्य फसल',
        tamil: 'முதன்மை பயிர்',
        kannada: 'ಮುಖ್ಯ ಬೆಳೆ'
    },
    'onboard_crop_variety': {
        english: 'Crop Variety',
        telugu: 'పంట రకం',
        hindi: 'फसल की किस्म',
        tamil: 'பயிர் ரகம்',
        kannada: 'ಬೆಳೆ ತಳಿ'
    },
    'onboard_farm_size': {
        english: 'Farm Size (Acres)',
        telugu: 'పొలం పరిమాణం (ఎకరాలు)',
        hindi: 'खेत का आकार (एकड़)',
        tamil: 'பண்ணை அளவு (ஏக்கர்)',
        kannada: 'ಜಮೀನಿನ ಗಾತ್ರ (ಎಕರೆ)'
    },
    'onboard_growth_stage': {
        english: 'Growth Stage',
        telugu: 'పంట ఎదుగుదల దశ',
        hindi: 'विकास का चरण',
        tamil: 'வளர்ச்சி நிலை',
        kannada: 'ಬೆಳವಣಿಗೆಯ ಹಂತ'
    },
    'stage_veg': {
        english: 'Vegetative Stage',
        telugu: 'ఎదుగుదల దశ (దుబ్బు దశ)',
        hindi: 'वानस्पतिक चरण',
        tamil: 'வளர்ச்சி நிலை',
        kannada: 'ಸಸ್ಯಕ ಹಂತ'
    },
    'stage_flow': {
        english: 'Flowering Stage',
        telugu: 'పూత దశ',
        hindi: 'फूल आने का चरण',
        tamil: 'பூக்கும் நிலை',
        kannada: 'ಹೂಬಿಡುವ ಹಂತ'
    },
    'stage_grain': {
        english: 'Grain Filling Stage',
        telugu: 'గింజ పాలుపోసుకునే దశ',
        hindi: 'दाना भरने का चरण',
        tamil: 'தானியம் நிரம்பும் நிலை',
        kannada: 'ಕಾಳು ತುಂಬುವ ಹಂತ'
    },
    'stage_harv': {
        english: 'Harvesting Stage',
        telugu: 'కోత దశ',
        hindi: 'कटाई का चरण',
        tamil: 'அறுவடை நிலை',
        kannada: 'ಕೊಯ್ಲು ಹಂತ'
    },
    'onboard_soil_title': {
        english: 'Soil & Irrigation',
        telugu: 'మట్టి & నీటి పారుదల',
        hindi: 'मिट्टी और सिंचाई',
        tamil: 'மண் மற்றும் நீர்ப்பாசனம்',
        kannada: 'ಮಣ್ಣು ಮತ್ತು ನೀರಾವರಿ'
    },
    'onboard_soil_type': {
        english: 'Soil Type',
        telugu: 'నేల రకం',
        hindi: 'मिट्टी का प्रकार',
        tamil: 'மண் வகை',
        kannada: 'ಮಣ್ಣಿನ ವಿಧ'
    },
    'soil_clay': {
        english: 'Clayey Soil',
        telugu: 'నల్ల రేగడి మట్టి',
        hindi: 'चिकनी मिट्टी',
        tamil: 'களிமண்',
        kannada: 'ಜೇಡಿ ಮಣ್ಣು'
    },
    'soil_sandy': {
        english: 'Sandy Loam',
        telugu: 'ఇసుక మిశ్రమ నేల',
        hindi: 'बलुई दोमट',
        tamil: 'மணல் கலந்த வண்டல் மண்',
        kannada: 'ಮರಳು ಮಿಶ್ರಿತ ಜೇಡಿಮಣ್ಣು'
    },
    'soil_black': {
        english: 'Black Cotton Soil',
        telugu: 'నల్ల నేలలు',
        hindi: 'काली कपास मिट्टी',
        tamil: 'கரிசல் மண்',
        kannada: 'ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು'
    },
    'soil_red': {
        english: 'Red Soil',
        telugu: 'ఎర్ర నేలలు',
        hindi: 'लाल मिट्टी',
        tamil: 'செம்மண்',
        kannada: 'ಕೆಂಪು ಮಣ್ಣು'
    },
    'onboard_irrigation_type': {
        english: 'Irrigation Type',
        telugu: 'నీటి పారుదల రకం',
        hindi: 'सिंचाई का प्रकार',
        tamil: 'நீர்ப்பாசன வகை',
        kannada: 'ನೀರಾವರಿ ವಿಧ'
    },
    'irr_flood': {
        english: 'Flood Irrigation',
        telugu: 'పారక నీరు (కాలువ/బోరు)',
        hindi: 'बाढ़ सिंचाई',
        tamil: 'மடை நீர்ப்பாசனம்',
        kannada: 'ಪ್ರವಾಹ ನೀರಾವರಿ'
    },
    'irr_drip': {
        english: 'Drip Irrigation',
        telugu: 'బిందు సేద్యం (డ్రిప్)',
        hindi: 'टपक सिंचाई',
        tamil: 'சொட்டு நீர் பாசனம்',
        kannada: 'ಹನಿ ನೀರಾವರಿ'
    },
    'irr_sprink': {
        english: 'Sprinkler',
        telugu: 'తుంపర సేద్యం',
        hindi: 'फव्वारा सिंचाई',
        tamil: 'தெளிப்பான் பாசனம்',
        kannada: 'ತುಂತುರು ನೀರಾವರಿ'
    },
    'irr_rain': {
        english: 'Rainfed',
        telugu: 'కేవలం వర్షాధారం',
        hindi: 'वर्षा आधारित',
        tamil: 'மழைப்பொழிவு பாசனம்',
        kannada: 'ಮಳೆಯಾಶ್ರಿತ'
    },
    'onboard_sowing_date': {
        english: 'Sowing Date',
        telugu: 'విత్తిన తేదీ',
        hindi: 'बुवाई की तारीख',
        tamil: 'விதைப்பு தேதி',
        kannada: 'ಬೀಜ ಬಿತ್ತಿದ ದಿನಾಂಕ'
    },
    'onboard_harvest_date': {
        english: 'Expected Harvest Date',
        telugu: 'కోత అంచనా తేదీ',
        hindi: 'कटाई की संभावित तारीख',
        tamil: 'எதிர்பார்க்கப்படும் அறுவடை தேதி',
        kannada: 'ನಿರೀಕ್ಷಿತ ಕೊಯ್ಲು ದಿನಾಂಕ'
    },
    'complete_btn': {
        english: 'Complete Profile',
        telugu: 'ప్రొఫైల్ పూర్తి చేయండి',
        hindi: 'प्रोफ़ाइल पूरी करें',
        tamil: 'விவரக்குறிப்பை முடிக்கவும்',
        kannada: 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ'
    },
    'nav_dashboard': { english: 'Dashboard', telugu: 'నేటి డాష్‌బోర్డ్', hindi: 'डैशबोर्ड', tamil: 'டாஷ்போர்டு', kannada: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
    'nav_myfarm': { english: 'My Farm', telugu: 'నా వ్యవసాయం', hindi: 'मेरा खेत', tamil: 'என் பண்ணை', kannada: 'ನನ್ನ ಜಮೀನು' },
    'nav_assistant': { english: 'AI Chat Assistant', telugu: 'AI సహాయకుడు', hindi: 'एआई चैट सहायक', tamil: 'AI அரட்டை உதவியாளர்', kannada: 'AI ಚಾಟ್ ಸಹಾಯಕ' },
    'nav_cropdoctor': { english: 'Crop Doctor', telugu: 'క్రాప్ డాక్టర్', hindi: 'फसल डॉक्टर', tamil: 'பயிர் மருத்துவர்', kannada: 'ಬೆಳೆ ವೈದ್ಯ' },
    'nav_productchecker': { english: 'Product Checker', telugu: 'మందుల చెకర్', hindi: 'उत्पाद चेकर', tamil: 'தயாரிப்பு சரிபார்ப்பு', kannada: 'ಉತ್ಪನ್ನ ಚೆಕರ್' },
    'nav_soil': { english: 'Soil & Irrigation', telugu: 'మట్టి & నీరు', hindi: 'मिट्टी और सिंचाई', tamil: 'மண் & நீர்ப்பாசனம்', kannada: 'ಮಣ್ಣು ಮತ್ತು ನೀರಾವರಿ' },
    'nav_weather': { english: 'Weather Intelligence', telugu: 'వాతావరణ సలహాలు', hindi: 'मौसम इंटेलिजेंस', tamil: 'வானிலை நுண்ணறிவு', kannada: 'ಹವಾಮಾನ ಇಂಟೆಲಿಜೆನ್ಸ್' },
    'nav_market': { english: 'Market Watch', telugu: 'మార్కెట్ ధరలు', hindi: 'बाजार मूल्य', tamil: 'சந்தை கண்காணிப்பு', kannada: 'ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಣೆ' },
    'nav_community': { english: 'Farmer Connect', telugu: 'రైతు వేదిక', hindi: 'किसान कनेक्ट', tamil: 'விவசாயி இணைப்பு', kannada: 'ರೈತರ ಸಂಘಟನೆ' },
    'nav_notifications': { english: 'Alerts', telugu: 'హెచ్చరికలు', hindi: 'अलर्ट', tamil: 'எச்சரிக்கைகள்', kannada: 'ಎಚ್ಚರಿಕೆಗಳು' },
    'nav_profile': { english: 'Farm Profile', telugu: 'రైతు ప్రొఫైల్', hindi: 'फार्म प्रोफ़ाइल', tamil: 'பண்ணை சுயவிவரம்', kannada: 'ಕೃಷಿ ಪ್ರೊಫೈಲ್' },
    'nav_settings': { english: 'Settings', telugu: 'సెట్టింగ్స్', hindi: 'सेटिंग्स', tamil: 'அமைப்புகள்', kannada: 'ಸಂಯೋಜನೆಗಳು' },
    'logout': { english: 'Sign Out', telugu: 'లాగౌట్', hindi: 'साइन आउट', tamil: 'வெளியேறு', kannada: 'ಸೈನ್ ಔಟ್' },
    'dashboard_decision_title': {
        english: 'Today\'s Farm Decision',
        telugu: 'నేటి వ్యవసాయ నిర్ణయం',
        hindi: 'आज का कृषि निर्णय',
        tamil: 'இன்றைய பண்ணை முடிவு',
        kannada: 'ಇಂದಿನ ಕೃಷಿ ನಿರ್ಧಾರ'
    },
    'dashboard_why_title': {
        english: 'Why this decision?',
        telugu: 'ఈ నిర్ణయానికి కారణాలు?',
        hindi: 'यह निर्णय क्यों?',
        tamil: 'ஏன் இந்த முடிவு?',
        kannada: 'ಯಾಕೆ ಈ ನಿರ್ಧಾರ?'
    },
    'soil_moisture_lbl': {
        english: 'Soil Moisture: High',
        telugu: 'నేల తేమ: ఎక్కువగా ఉంది',
        hindi: 'मिट्टी की नमी: उच्च',
        tamil: 'மண் ஈரப்பதம்: அதிகம்',
        kannada: 'ಮಣ್ಣಿನ ತೇವಾಂಶ: ಹೆಚ್ಚು'
    },
    'rain_prob_lbl': {
        english: 'Rain: 80% Tomorrow',
        telugu: 'వర్షం: రేపు 80% అవకాశం',
        hindi: 'बारिश: कल 80% संभावना',
        tamil: 'மழை: நாளை 80% வாய்ப்பு',
        kannada: 'ಮಳೆ: ನಾಳೆ 80% ಸಂಭವನೀಯತೆ'
    },
    'crop_stage_lbl': {
        english: 'Crop Stage: Vegetative',
        telugu: 'పంట దశ: దుబ్బు దశ',
        hindi: 'फसल का चरण: वानस्पतिक',
        tamil: 'பயிர் நிலை: வளரும் நிலை',
        kannada: 'ಬೆಳೆ ಹಂತ: ಸಸ್ಯಕ ಹಂತ'
    },
    'fungal_risk_lbl': {
        english: 'Fungal Risk: Medium',
        telugu: 'ఫంగల్ రిస్క్: మధ్యస్థం',
        hindi: 'कवक जोखिम: मध्यम',
        tamil: 'பூஞ்சை ஆபத்து: நடுத்தரம்',
        kannada: 'ಶಿಲೀಂಧ್ರ ಅಪಾಯ: ಮಧ್ಯಮ'
    },
    'btn_listen': {
        english: 'Listen',
        telugu: 'వినండి 🔊',
        hindi: 'सुनें 🔊',
        tamil: 'கேளுங்கள் 🔊',
        kannada: 'ಕೇಳಿ 🔊'
    },
    'btn_ask_ai': {
        english: 'Ask AI',
        telugu: 'అడగండి 💬',
        hindi: 'एआई से पूछें 💬',
        tamil: 'AI-யிடம் கேளுங்கள் 💬',
        kannada: 'AI ಕೇಳಿ 💬'
    },
    'dash_myfarm_title': { english: '🌱 My Farm', telugu: '🌱 నా పొలం', hindi: '🌱 मेरा खेत', tamil: '🌱 என் பண்ணை', kannada: '🌱 ನನ್ನ ಜಮೀನು' },
    'dash_weather_title': { english: '🌦 Weather Today', telugu: '🌦 నేటి వాతావరణం', hindi: '🌦 आज का मौसम', tamil: '🌦 இன்றைய வானிலை', kannada: '🌦 ಇಂದಿನ ಹವಾಮಾನ' },
    'dash_irrigation_title': { english: '💧 Irrigation', telugu: '💧 నీటి పారుదల', hindi: '💧 सिंचाई', tamil: '💧 நீர்ப்பாசனம்', kannada: '💧 ನೀರಾವರಿ' },
    'dash_health_title': { english: '🐛 Crop Health', telugu: '🐛 పంట ఆరోగ్యం', hindi: '🐛 फसल स्वास्थ्य', tamil: '🐛 பயிர் ஆரோக்கியம்', kannada: '🐛 ಬೆಳೆ ಆರೋಗ್ಯ' },
    'dash_market_title': { english: '💰 Market Watch', telugu: '💰 మార్కెట్ ధరలు', hindi: '💰 बाजार मूल्य', tamil: '💰 சந்தை கண்காணிப்பு', kannada: '💰 ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಣೆ' },
    'dash_checker_title': { english: '💊 Product Checker', telugu: '💊 మందుల చెకర్', hindi: '💊 उत्पाद चेकर', tamil: '💊 தயாரிப்பு சரிபார்ப்பு', kannada: '💊 ಉತ್ಪನ್ನ ಚೆಕರ್' },
    'scan_label_btn': { english: 'Upload Leaf or Label ➔', telugu: 'ఫోటో అప్‌లోడ్ చేయండి ➔', hindi: 'पत्ता या लेबल अपलोड करें ➔', tamil: 'இலை அல்லது லேபிளைப் பதிவேற்றவும் ➔', kannada: 'ಎಲೆ ಅಥವಾ ಲೇಬಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ ➔' },
    'crop_doctor_title': { english: '🌱 Crop Doctor', telugu: '🌱 క్రాప్ డాక్టర్', hindi: '🌱 फसल डॉक्टर', tamil: '🌱 பயிர் மருத்துவர்', kannada: '🌱 ಬೆಳೆ ವೈದ್ಯ' },
    'crop_doctor_sub': {
        english: 'Show me your crop and I\'ll help you understand what may be happening.',
        telugu: 'మీ పంట ఆకు లేదా చేను ఫోటో పంపండి, ఏ తెగులు ఉందో గుర్తిద్దాం.',
        hindi: 'मुझे अपनी फसल दिखाएं और मैं आपको समझने में मदद करूंगा कि क्या हो रहा है।',
        tamil: 'உங்கள் பயிரைக் காட்டுங்கள், என்ன நடக்கிறது என்பதைப் புரிந்துகொள்ள நான் உங்களுக்கு உதவுகிறேன்.',
        kannada: 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ತೋರಿಸಿ, ಏನು ಸಮಸ್ಯೆಯಿರಬಹುದು ಎಂಬುದನ್ನು ಪತ್ತೆಹಚ್ಚಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.'
    },
    'doctor_take_photo': { english: 'Take Photo', telugu: 'ఫోటో తీయండి 📷', hindi: 'फोटो लें 📷', tamil: 'படம் எடுக்கவும் 📷', kannada: 'ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ 📷' },
    'doctor_upload_img': { english: 'Upload Image', telugu: 'గ్యాలరీ నుండి అప్‌లోడ్', hindi: 'छवि अपलोड करें', tamil: 'படத்தைப் பதிவேற்றவும்', kannada: 'ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ' },
    'doctor_upload_vid': { english: 'Upload Video', telugu: 'వీడియో అప్‌లోడ్ 🎥', hindi: 'वीडियो अपलोड करें 🎥', tamil: 'வீடியோ பதிவேற்றவும் 🎥', kannada: 'ವಿಡಿಯೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ 🎥' },
    'diag_what_observed': { english: 'What AI Observed', telugu: 'AI గమనించిన అంశాలు', hindi: 'एआई ने क्या देखा', tamil: 'AI கவனித்தவை', kannada: 'AI ಗಮನಿಸಿದ ಅಂಶಗಳು' },
    'diag_possible_causes': { english: 'Possible Causes', telugu: 'తెగులు రావడానికి కారణాలు', hindi: 'संभावित कारण', tamil: 'சாத்தியமான कारणों', kannada: 'ಸಂಭವನೀಯ ಕಾರಣಗಳು' },
    'diag_next_steps': { english: 'Recommended Next Steps', telugu: 'నివారణ చర్యలు / సూచనలు', hindi: 'अनुशंसित अगले कदम', tamil: 'பரிந்துரைக்கப்பட்ட அடுத்த படிகள்', kannada: 'ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಕ್ರಮಗಳು' }
};

// Simulated Demo Step Configuration
const demoSteps = [
    {
        title: "Landing Page",
        descTe: "రైతు ల్యాండింగ్ పేజీని చూస్తున్నారు. 'Get Started' పై క్లిక్ చేయండి.",
        descEn: "Farmer views Landing Page. Click 'Get Started' to enter the application.",
        action: () => {
            appState.currentLanguage = 'english';
            updateLanguageUI();
            navigateTo('landing-view');
        }
    },
    {
        title: "Bilingual Login",
        descTe: "లాగిన్ స్క్రీన్ - తెలుగు ఎంచుకుందాం. మొబైల్ నెంబర్ ఆటోఫిల్ అవుతుంది.",
        descEn: "Bilingual Login. Let's switch language to Telugu and simulate entry.",
        action: () => {
            navigateTo('login-view');
            setLanguage('telugu');
            document.getElementById('login-username').value = "9876543210";
            document.getElementById('login-password').value = "farmer_ravi";
        }
    },
    {
        title: "Language Onboarding",
        descTe: "భాష ఎంపిక - తెలుగును అధికారికంగా లాగిన్ అనంతరం స్థిరపరుస్తాము.",
        descEn: "Post-Login Language Selection - confirm Telugu as the user's primary language.",
        action: () => {
            navigateTo('language-view');
        }
    },
    {
        title: "Farm Profile: Basic Info",
        descTe: "వ్యవసాయ ప్రొఫైల్ సృష్టి - మొదటి అడుగు: పేరు మరియు జిల్లా వివరాలు.",
        descEn: "Farmer onboarding profile creation - Step 1: Name and location inputs.",
        action: () => {
            selectPostLoginLanguage('telugu');
            navigateTo('onboarding-view');
            nextOnboardStep(1);
            document.getElementById('ob-name').value = "రవి కుమార్";
            document.getElementById('ob-state').value = "తెలంగాణ";
            document.getElementById('ob-district').value = "సూర్యాపేట";
            document.getElementById('ob-village').value = "చివ్వెంల";
        }
    },
    {
        title: "Farm Profile: Crop Variety",
        descTe: "వ్యవసాయ ప్రొఫైల్ సృష్టి - రెండో అడుగు: వరి పంట రకం ఎంపిక.",
        descEn: "Farmer onboarding profile creation - Step 2: Choosing Rice crop and growth stage.",
        action: () => {
            nextOnboardStep(2);
            document.getElementById('ob-variety').value = "తెలంగాణ సోనా (BPT 5204)";
            document.getElementById('ob-size').value = "4";
            document.getElementById('ob-stage').value = "Vegetative";
        }
    },
    {
        title: "Farm Profile: Soil & Irrigation",
        descTe: "వ్యవసాయ ప్రొఫైల్ సృష్టి - మూడో అడుగు: నల్ల రేగడి మట్టి మరియు బిందు సేద్యం.",
        descEn: "Farmer onboarding profile - Step 3: Clayey soil and drip irrigation configuration.",
        action: () => {
            nextOnboardStep(3);
            document.getElementById('ob-soil').value = "Clayey";
            document.getElementById('ob-irrigation').value = "Drip Irrigation";
        }
    },
    {
        title: "Integrated Dashboard & Decision",
        descTe: "నేటి వ్యవసాయ నిర్ణయం - వాతావరణం, మట్టి విశ్లేషణ ద్వారా నేడు తడి పెట్టవద్దని సలహా.",
        descEn: "Integrated AI Farm Decision Dashboard: AI advises against irrigation due to forecasted rain.",
        action: () => {
            // Submit form to complete onboarding
            simulateSubmitOnboarding();
            activatePane('dashboard-pane');
        }
    },
    {
        title: "Telugu Voice Broadcast",
        descTe: "ఆడియో బటన్ నొక్కండి. నేటి వ్యవసాయ నిర్ణయం రైతుకు సహజ తెలుగులో వినిపిస్తుంది.",
        descEn: "Listen option. AgriSaarthi reads the farm recommendation aloud in clear Telugu.",
        action: () => {
            playCurrentDecisionVoice();
        }
    },
    {
        title: "Crop Doctor - Leaf Diagnostic",
        descTe: "క్రాప్ డాక్టర్ - టమోటా ఆకు మచ్చ తెగులు పరీక్షించడానికి ఫోటో అప్‌లోడ్ చేస్తాం.",
        descEn: "Crop Doctor - Farmer Ravi uploads tomato leaf disease photo for analysis.",
        action: () => {
            activatePane('crop-doctor-pane');
        }
    },
    {
        title: "Crop Doctor Scan Result",
        descTe: "ఆకు మచ్చ తెగులు నిర్ధారణ - 82% ఖచ్చితత్వంతో ఫలితాలు మరియు నివారణ మార్గాలు.",
        descEn: "Leaf spot diagnosis computed - 82% confidence, causes and next actions displayed.",
        action: () => {
            runSimulatedCropScan();
        }
    },
    {
        title: "AI Voice Chat Assistant",
        descTe: "వాయిస్ సహాయకుడు - వాతావరణం, కెమికల్ పిచికారీ అనుకూలత గురించి ప్రశ్నిద్దాం.",
        descEn: "Voice assistant interaction - Consult AI assistant about spraying safety during rainy window.",
        action: () => {
            activatePane('ai-chat-pane');
            simulateUserChatQuery("నా టమోటా పంటకు మందు కొట్టడానికి రేపటి వాతావరణం ఎలా ఉంటుంది?");
        }
    },
    {
        title: "Pesticide Checker Scan",
        descTe: "మందుల చెకర్ - పురుగుల మందు డబ్బా 'కవచ్' లేబుల్ స్కానింగ్ సిమ్యులేషన్.",
        descEn: "Pesticide Checker - Scans active label of 'Kavach Fungicide (Chlorothalonil)'.",
        action: () => {
            activatePane('product-checker-pane');
        }
    },
    {
        title: "Compatibility Check - Rice",
        descTe: "వరి పంటతో మందు అనుకూలత - వరి ఆకు మచ్చ తెగులుకు ఈ మందు ఉపయోగించవచ్చు 🟢",
        descEn: "Checking compatibility with Rice crop - AI yields a compatible status 🟢.",
        action: () => {
            runSimulatedPesticideScan();
        }
    },
    {
        title: "Soil Moisture & Gauges",
        descTe: "మట్టి ఆరోగ్యం - మట్టి రసాయన నిష్పత్తి NPK మరియు తేమ శాతాన్ని పరిశీలిద్దాం.",
        descEn: "Soil parameters & NPK values page - Check dynamic gauges and manual adjustments.",
        action: () => {
            activatePane('soil-water-pane');
        }
    },
    {
        title: "Mandi Price Trend Chart",
        descTe: "మార్కెట్ ధరలు - సూర్యాపేట గింజ మార్కెట్ లో వరి ధరల పెరుగుదల రేఖాచిత్రం.",
        descEn: "Market price watch - Visual SVG price trend charts showing Suryapet Mandi pricing.",
        action: () => {
            activatePane('market-pane');
        }
    },
    {
        title: "Farmer Connect & Feedback",
        descTe: "రైతు వేదిక - సమీపంలోని 12 మంది రైతుల అనుభవాలు. సలహాపై ఫీడ్‌బ్యాక్ సబ్మిట్ చేద్దాం.",
        descEn: "Farmer Connect & Feedback - View nearby posts. Submit 'Was this helpful? 👍 Yes' feedback.",
        action: () => {
            activatePane('community-pane');
            submitGeneralFeedbackAndAlertDone();
        }
    }
];

// Document loaded initializations
document.addEventListener("DOMContentLoaded", () => {
    // Initialize single-page routing, session checks, and database client
    initAppRouting();
    
    // Initialize demo steps list in the widget
    initDemoStepsList();
    
    // Check initial language preferences
    updateLanguageUI();
    
    // Check for standard Web Speech Synthesis support
    if (!window.speechSynthesis) {
        console.warn("Speech Synthesis not supported by this browser.");
        appState.isSpeechEnabled = false;
    }
});

// Navigate between global views (SPA Router Wrapper)
function navigateTo(viewId) {
    const route = viewToRoute[viewId];
    if (route) {
        navigateToRoute(route);
    } else if (viewId === 'main-app-view') {
        navigateToRoute('/dashboard');
    } else if (viewId === 'landing-view') {
        navigateToRoute('/');
    } else {
        executeViewNavigation(viewId);
    }
}

// Toggle specific pane inside the Main Dashboard layout (SPA Router Wrapper)
function activatePane(paneId, navElement = null) {
    const route = paneToRoute[paneId];
    if (route) {
        navigateToRoute(route);
    } else {
        executePaneActivation(paneId, navElement);
    }
}

// Low-level DOM navigation routines
function executeViewNavigation(viewId) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add("active");
        appState.currentView = viewId;
        
        // Auto show/hide demo widget based on login status
        const demoWidget = document.getElementById('demo-controller');
        if (demoWidget) {
            if (viewId === 'landing-view' || viewId === 'login-view' || viewId === 'register-view' || viewId === 'forgot-password-view' || viewId === 'language-view' || viewId === 'onboarding-view') {
                demoWidget.classList.remove('collapsed');
            } else {
                demoWidget.classList.add('collapsed');
            }
        }
    }
}

function executePaneActivation(paneId, navElement = null) {
    document.querySelectorAll(".pane").forEach(p => p.classList.remove("active"));
    const target = document.getElementById(paneId);
    if (target) {
        target.classList.add("active");
        appState.currentPane = paneId;
        
        if (paneId === 'ai-chat-pane') {
            refreshConversationsList();
        }
    }
    
    // Update active nav styles for Desktop Sidebar
    if (navElement) {
        document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => item.classList.remove("active"));
        navElement.classList.add("active");
    } else {
        document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
            const onclickText = item.getAttribute('onclick') || '';
            if (onclickText.includes(paneId)) {
                document.querySelectorAll(".sidebar-nav .nav-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
            }
        });
    }

    // Update active nav styles for Mobile Bottom Nav
    document.querySelectorAll(".mobile-nav-item").forEach(item => {
        const onclickText = item.getAttribute('onclick') || '';
        if (onclickText.includes(paneId)) {
            document.querySelectorAll(".mobile-nav-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        }
    });

    // Close voice overlay if open when navigating
    const voiceOverlay = document.getElementById('voice-overlay');
    if (voiceOverlay && !voiceOverlay.classList.contains('hidden')) {
        voiceOverlay.classList.add('hidden');
    }
}

// Switch between English, Telugu, Hindi, Tamil, and Kannada languages
function setLanguage(lang) {
    appState.currentLanguage = lang;
    localStorage.setItem('agrisaarthi_lang', lang);
    
    // Toggle active class on login page switcher buttons
    const langButtons = ['english', 'telugu', 'hindi', 'tamil', 'kannada'];
    langButtons.forEach(l => {
        const btn = document.getElementById(`login-lang-${l}`);
        if (btn) {
            if (l === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    // Update select elements in page header, landing page and settings
    const globalSelect = document.getElementById('global-lang-select');
    if (globalSelect) globalSelect.value = lang;
    
    const landingSelect = document.getElementById('landing-lang-select');
    if (landingSelect) landingSelect.value = lang;

    const settingsLang = document.getElementById('settings-lang-select');
    if (settingsLang) settingsLang.value = lang;

    updateLanguageUI();
}

// Stub for legacy toggle (cycles language in order)
function toggleLanguageGlobal() {
    const langs = ['english', 'telugu', 'hindi', 'tamil', 'kannada'];
    let idx = langs.indexOf(appState.currentLanguage);
    let nextIdx = (idx + 1) % langs.length;
    setLanguage(langs[nextIdx]);
}

// Updates DOM text node elements carrying data-key markers
function updateLanguageUI() {
    const lang = appState.currentLanguage;
    
    document.querySelectorAll("[data-key]").forEach(el => {
        const key = el.getAttribute("data-key");
        if (bilingualDict[key] && bilingualDict[key][lang]) {
            // Check if element is input placeholder
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = bilingualDict[key][lang];
            } else {
                el.innerHTML = bilingualDict[key][lang];
            }
        }
    });

    // Translate dynamic elements like welcomes and decisions
    const welcomeText = document.getElementById('header-welcome-text');
    const welcomeSub = document.getElementById('header-sub-text');
    const decisionText = document.getElementById('decision-text-content');
    
    const welcomes = {
        english: `Good morning, ${appState.farmerProfile.name} 👋`,
        telugu: `శుభోదయం, ${appState.farmerProfile.name} 👋`,
        hindi: `सुप्रभात, ${appState.farmerProfile.name} 👋`,
        tamil: `காலை வணக்கம், ${appState.farmerProfile.name} 👋`,
        kannada: `ಶುಭೋದಯ, ${appState.farmerProfile.name} 👋`
    };
    
    const subs = {
        english: "Let's take care of your farm today.",
        telugu: "ఈ రోజు మీ పొలాన్ని జాగ్రత్తగా చూసుకుందాం.",
        hindi: "आइए आज आपके खेत की देखभाल करें।",
        tamil: "இன்று உங்கள் பண்ணையை கவனித்துக்கொள்வோம்.",
        kannada: "ಇಂದು ನಿಮ್ಮ ಜಮೀನನ್ನು ಕಾಳಜಿ ಮಾಡೋಣ."
    };
    
    const decisions = {
        english: appState.farmerProfile.crop === 'Rice' ? 
            `"Rain is expected tomorrow. Soil moisture is currently sufficient at 72%. Avoid irrigation today, and postpone spraying any chemical treatments to prevent washout."` :
            `"Rain is expected tomorrow. Soil moisture is currently sufficient. Avoid irrigation today."`,
        telugu: appState.farmerProfile.crop === 'Rice' ? 
            `"రేపు మీ ప్రాంతంలో భారీ వర్షం పడే అవకాశం ఉంది (80%). మీ వరి పొలంలో మట్టి తేమ ఇప్పటికే 72% అధికంగా ఉంది. కాబట్టి నేడు నీటి పారుదల (తడి పెట్టడం) వాయిదా వేయండి మరియు రసాయన పిచికారీని నిలిపివేయండి."` :
            `"రేపు వర్షం కురిసే అవకాశం ఉంది. పొలంలో తగినంత తేమ ఉంది. ఈ రోజు నీటి పారుదల వద్దు."`,
        hindi: appState.farmerProfile.crop === 'Rice' ? 
            `"कल भारी बारिश की संभावना है (80%)। आपके धान के खेत में मिट्टी की नमी पहले से ही 72% है। इसलिए आज सिंचाई करने से बचें, और धोने से बचाने के लिए रासायनिक छिड़काव को स्थगित करें।"` :
            `"कल बारिश होने की संभावना है। खेत में पर्याप्त नमी है। आज सिंचाई करने से बचें।"`,
        tamil: appState.farmerProfile.crop === 'Rice' ? 
            `"நாளை கனமழை பெய்ய வாய்ப்புள்ளது (80%). உங்கள் நெல் வயலில் மண்ணின் ஈரப்பதம் ஏற்கனவே 72% ஆக அதிகமாக உள்ளது. எனவே இன்று பாசனத்தை தவிர்க்கவும், மேலும் இரசாயனம் கழுவிச் செல்வதை தடுக்க தெளிப்பை ஒத்திவைக்கவும்."` :
            `"நாளை மழை பெய்ய வாய்ப்புள்ளது. வயலில் போதுமான ஈரப்பதம் உள்ளது. இன்று பாசனத்தைத் தவிர்க்கவும்."`,
        kannada: appState.farmerProfile.crop === 'Rice' ? 
            `"ನಾಳೆ ಭಾರಿ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ (80%). ನಿಮ್ಮ ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ ಮಣ್ಣಿನ ತೇವಾಂಶ ಈಗಾಗಲೇ 72% ನಷ್ಟು ಹೆಚ್ಚಾಗಿದೆ. ಆದ್ದರಿಂದ ಇಂದು ನೀರಾವರಿ ಮಾಡಬೇಡಿ ಮತ್ತು ರಾಸಾಯನಿಕ ಸಿಂಪರಣೆಯನ್ನು ಮುಂದೂಡಿ."` :
            `"ನಾಳೆ ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದೆ. ಗದ್ದೆಯಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ. ಇಂದು ನೀರಾವರಿಯನ್ನು ತಪ್ಪಿಸಿ."`
    };

    if (welcomeText) welcomeText.textContent = welcomes[lang] || welcomes.english;
    if (welcomeSub) welcomeSub.textContent = subs[lang] || subs.english;
    if (decisionText) decisionText.textContent = decisions[lang] || decisions.english;

    // Dynamic labels translation in sidebar user card
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarCrop = document.getElementById('sidebar-user-crop');
    
    const cropTerms = {
        english: { crop: appState.farmerProfile.crop, suffix: 'Farmer' },
        telugu: { crop: appState.farmerProfile.crop === 'Rice' ? 'వరి' : appState.farmerProfile.crop === 'Tomato' ? 'టమోటా' : 'మిరప', suffix: 'రైతు' },
        hindi: { crop: appState.farmerProfile.crop === 'Rice' ? 'धान' : appState.farmerProfile.crop === 'Tomato' ? 'टमाटर' : 'मिर्च', suffix: 'किसान' },
        tamil: { crop: appState.farmerProfile.crop === 'Rice' ? 'நெல்' : appState.farmerProfile.crop === 'Tomato' ? 'தக்காளி' : 'மிளகாய்', suffix: 'விவசாயி' },
        kannada: { crop: appState.farmerProfile.crop === 'Rice' ? 'ಭತ್ತದ' : appState.farmerProfile.crop === 'Tomato' ? 'ಟೊಮೆಟೊ' : 'ಮೆಣಸಿನಕಾಯಿ', suffix: 'ರೈತ' }
    };
    
    const term = cropTerms[lang] || cropTerms.english;
    
    if (sidebarName) sidebarName.textContent = appState.farmerProfile.name;
    if (sidebarCrop) sidebarCrop.textContent = `${term.crop} ${term.suffix} 🌾`;

    // Dynamic translation inside main farm dashboard
    const profileCropDetail = document.getElementById('farm-prof-crop');
    if (profileCropDetail) {
        profileCropDetail.textContent = `${appState.farmerProfile.crop} (${appState.farmerProfile.variety})`;
    }

    // Refresh community posts and market charts with language changes
    initCommunityPosts();
    updateMarketChart();
}

// Speak text using Speech Synthesis
function speakSpeech(text, targetLang = 'english') {
    if (!appState.isSpeechEnabled || !appState.synth) return;
    
    // Cancel active speaking first
    appState.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map languages
    const langTags = {
        english: 'en-IN',
        telugu: 'te-IN',
        hindi: 'hi-IN',
        tamil: 'ta-IN',
        kannada: 'kn-IN'
    };
    
    const targetTag = langTags[targetLang] || 'en-IN';
    utterance.lang = targetTag;
    utterance.rate = 0.85; // Slightly slower for clear understanding by farmers
    
    // Asynchronously find the best matching voice
    const voices = appState.synth.getVoices();
    let bestVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetTag.toLowerCase());
    
    // If not found, look for general matching prefix (e.g. 'te' or 'hi' or 'ta' or 'kn')
    if (!bestVoice) {
        const shortLang = targetTag.split('-')[0].toLowerCase();
        bestVoice = voices.find(v => v.lang.toLowerCase().startsWith(shortLang));
    }
    
    // Special fallback for Indian English if we want en-IN
    if (!bestVoice && targetTag === 'en-IN') {
        bestVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    }
    
    if (bestVoice) {
        utterance.voice = bestVoice;
    }
    
    // Handle speaking state indicators (visual feedback)
    utterance.onstart = () => {
        updateTTSUIState(true);
    };
    
    utterance.onend = () => {
        updateTTSUIState(false);
    };
    
    utterance.onerror = (e) => {
        console.error("Speech Synthesis error:", e);
        updateTTSUIState(false);
    };
    
    appState.activeSpeechUtterance = utterance;
    appState.synth.speak(utterance);
}

// Stop speaking
function stopSpeaking() {
    if (appState.synth) {
        appState.synth.cancel();
        updateTTSUIState(false);
    }
}

// Update TTS button states in the UI
function updateTTSUIState(isSpeaking) {
    document.querySelectorAll('.btn, .listen-audio-bar, .lang-toggle-btn').forEach(btn => {
        const icon = btn.querySelector('.fa-volume-high');
        if (icon) {
            if (isSpeaking) {
                icon.classList.add('animate-pulse', 'text-success');
            } else {
                icon.classList.remove('animate-pulse', 'text-success');
            }
        }
    });
}

// Voice help sound playback for login page
function playVoiceHelp(scope) {
    if (scope === 'login') {
        if (appState.currentLanguage === 'telugu') {
            speakSpeech("అగ్రిసారథి ఏ ఐ కు స్వాగతం. మీ మొబైల్ సంఖ్య మరియు పాస్‌వర్డ్ ఉపయోగించి ప్రవేశించండి. ఒకవేళ ఖాతా లేకపోతే రిజిస్టర్ చేసుకోండి.", "telugu");
        } else {
            speakSpeech("Welcome to AgriSaarthi AI. Please enter your mobile number and password to log in, or continue with Mobile OTP.", "english");
        }
    }
}

let supabaseClient = null;
let currentSessionUser = null;
let currentProfileData = null;

// Map views and panes to SPA URL routes
const paneToRoute = {
    'dashboard-pane': '/dashboard',
    'farm-pane': '/farm',
    'crop-doctor-pane': '/crop-intelligence',
    'weather-pane': '/weather',
    'soil-water-pane': '/soil',
    'market-pane': '/market',
    'product-checker-pane': '/pesticide',
    'ai-chat-pane': '/assistant',
    'community-pane': '/community',
    'profile-pane': '/profile',
    'settings-pane': '/settings'
};

const viewToRoute = {
    'landing-view': '/',
    'login-view': '/login',
    'register-view': '/signup',
    'forgot-password-view': '/forgot-password',
    'language-view': '/language',
    'onboarding-view': '/onboarding'
};

const routes = {
    '/': { view: 'landing-view' },
    '/login': { view: 'login-view' },
    '/register': { view: 'register-view' },
    '/signup': { view: 'register-view' },
    '/forgot-password': { view: 'forgot-password-view' },
    '/language': { view: 'language-view' },
    '/onboarding': { view: 'onboarding-view' },
    '/dashboard': { view: 'main-app-view', pane: 'dashboard-pane' },
    '/farm': { view: 'main-app-view', pane: 'farm-pane' },
    '/crop-intelligence': { view: 'main-app-view', pane: 'crop-doctor-pane' },
    '/weather': { view: 'main-app-view', pane: 'weather-pane' },
    '/soil': { view: 'main-app-view', pane: 'soil-water-pane' },
    '/market': { view: 'main-app-view', pane: 'market-pane' },
    '/pesticide': { view: 'main-app-view', pane: 'product-checker-pane' },
    '/assistant': { view: 'main-app-view', pane: 'ai-chat-pane' },
    '/community': { view: 'main-app-view', pane: 'community-pane' },
    '/profile': { view: 'main-app-view', pane: 'profile-pane' },
    '/settings': { view: 'main-app-view', pane: 'settings-pane' }
};

// Initialize Supabase Client using environment configurations
async function initSupabaseClient() {
    try {
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error('Failed to load server configuration');
        const config = await response.json();
        
        const url = config.SUPABASE_URL || localStorage.getItem('supabase_url') || '';
        const anonKey = config.SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';
        
        if (url && anonKey && typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(url, anonKey);
            console.log('Supabase client initialized successfully.');
            ChatDatabase.supabase = supabaseClient;
            return true;
        } else {
            console.warn('Supabase credentials missing. Fallback to local sandbox mode.');
        }
    } catch (e) {
        console.error('Error during Supabase initialization:', e);
    }
    return false;
}

// Convert selected image file to base64 encoding helper
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Vision diagnostic AI scan
async function runCropDoctorAnalysis(file, type) {
    const cropImg = document.getElementById('scanned-crop-img');
    const cropVid = document.getElementById('scanned-crop-video');
    const previewLabel = document.getElementById('crop-preview-label');
    
    if (type === 'video') {
        if (cropImg) cropImg.classList.add('hidden');
        if (cropVid) {
            cropVid.classList.remove('hidden');
            cropVid.src = appState.activeCropUrl || "";
        }
        if (previewLabel) previewLabel.textContent = "Scanned Video";
    } else {
        if (cropVid) cropVid.classList.add('hidden');
        if (cropImg) {
            cropImg.classList.remove('hidden');
            cropImg.src = appState.activeCropUrl || "";
        }
        if (previewLabel) previewLabel.textContent = "Scanned Photo";
    }
    
    const cropName = document.getElementById('diag-crop-name');
    const issueName = document.getElementById('diag-issue-name');
    const confVal = document.getElementById('diag-confidence-val');
    const gaugeFill = document.getElementById('diag-gauge-path');
    
    const obsList = document.getElementById('diag-observations');
    const causesList = document.getElementById('diag-causes');
    const stepsList = document.getElementById('diag-steps');
    
    if (cropName) cropName.textContent = "Analyzing Leaf Sample...";
    if (issueName) issueName.textContent = "Connecting to Vision AI...";
    
    try {
        let base64Data = "";
        let mimeType = "image/jpeg";
        let isSimulation = false;
        
        if (type === 'video' && activeCropFrames.length > 0) {
            base64Data = activeCropFrames[0];
            mimeType = "image/png";
        } else if (file) {
            base64Data = await convertFileToBase64(file);
            mimeType = file.type;
            
            // Log safe debugging metadata to prove file differences
            console.log(`[CropDoctor] Processing REAL file upload:`, {
                filename: file.name,
                mimeType: file.type,
                fileSize: `${(file.size / 1024).toFixed(2)} KB`,
                approxPayloadSize: `${base64Data.length} characters`
            });
        } else {
            isSimulation = true;
        }
        
        let analysis;
        if (isSimulation) {
            console.log(`[CropDoctor] Running SIMULATED demo scan fallback`);
            const selectedCrop = appState.farmerProfile.crop || 'Rice';
            const lang = appState.currentLanguage;
            
            const simulatedResponses = {
                Rice: {
                    crop: "Rice (Oryza sativa)",
                    disease: "Rice Blast (Magnaporthe oryzae)",
                    confidence: 82,
                    symptoms: [
                        "Spindle-shaped lesions with grey centres on leaves.",
                        "Neck rot lesions on the collar region.",
                        "Rapid lodging in highly infested nitrogenous patches."
                    ],
                    prevention: [
                        "High moisture retention (relative humidity > 85%).",
                        "Excessive application of chemical nitrogenous fertilizers.",
                        "Infected crop stubbles left from the previous season."
                    ],
                    treatment: [
                        "Postpone irrigation temporarily due to high humidity.",
                        "Spray tricyclazole 75 WP at 0.6g/L or carbendazim 50 WP at 1g/L.",
                        "Apply potassium fertilizer (muriate of potash) to enhance resistance.",
                        "Avoid entering the field immediately after spraying."
                    ]
                },
                Tomato: {
                    crop: "Tomato (Solanum lycopersicum)",
                    disease: "Early Blight (Alternaria solani)",
                    confidence: 85,
                    symptoms: [
                        "Concentric rings forming target board spots on lower leaves.",
                        "Yellow halos surrounding the dark spots.",
                        "Lesions developing on stems of young seedlings."
                    ],
                    prevention: [
                        "Warm temperatures and prolonged leaf wetness.",
                        "Lack of crop rotation and poor plant spacing.",
                        "Soil splash onto lower leaves spreading spores."
                    ],
                    treatment: [
                        "Prune and destroy infected lower leaves immediately.",
                        "Use drip irrigation to avoid wetting foliage.",
                        "Spray chlorothalonil (Kavach) at 2g/L or Copper Oxychloride at 2.5g/L.",
                        "Avoid chemical spray if rain is predicted within 12 hours."
                    ]
                },
                Chilli: {
                    crop: "Chilli (Capsicum annuum)",
                    disease: "Anthracnose (Colletotrichum capsici)",
                    confidence: 88,
                    symptoms: [
                        "Water-soaked sunken lesions on fruits.",
                        "Concentric rings of black acervuli within lesions.",
                        "Premature fruit drop and dieback of twigs."
                    ],
                    prevention: [
                        "High humidity and warm temperatures (28-30°C).",
                        "Use of infected seeds or planting material.",
                        "Uncontrolled weed growth hosting spores."
                    ],
                    treatment: [
                        "Remove and destroy infected fruits and twigs.",
                        "Use clean certified seed for next season.",
                        "Spray mancozeb at 2.5g/L or azoxystrobin at 1ml/L.",
                        "Ensure proper field drainage to prevent waterlogging."
                    ]
                }
            };
            analysis = simulatedResponses[selectedCrop] || simulatedResponses.Rice;
        } else {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageBase64: base64Data,
                    mimeType: mimeType,
                    cropContext: appState.farmerProfile.crop
                })
            });
            
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Serverless diagnostic error');
            }
            
            analysis = await response.json();
        }
        
        // Update UI
        if (cropName) cropName.textContent = analysis.crop;
        if (issueName) {
            issueName.textContent = analysis.disease;
            issueName.className = "text-danger";
        }
        
        const confidence = analysis.confidence || 88;
        if (confVal) confVal.textContent = `${confidence}%`;
        if (gaugeFill) {
            gaugeFill.style.strokeDashoffset = (25.12 * (10 - confidence/10)).toFixed(0); 
        }
        
        if (obsList) {
            obsList.innerHTML = '';
            analysis.symptoms.forEach(s => {
                const li = document.createElement('li');
                li.textContent = s;
                obsList.appendChild(li);
            });
        }
        
        if (causesList) {
            causesList.innerHTML = '';
            analysis.prevention.forEach(p => {
                const li = document.createElement('li');
                li.textContent = p;
                causesList.appendChild(li);
            });
        }
        
        if (stepsList) {
            stepsList.innerHTML = '';
            analysis.treatment.forEach(t => {
                const li = document.createElement('li');
                li.textContent = t;
                stepsList.appendChild(li);
            });
        }
        
        appState.lastSpeechText = `${analysis.crop} diagnostic complete. Identified ${analysis.disease} with ${confidence} percent confidence.`;
        if (document.getElementById('settings-auto-speech').checked) {
            playDiagnosticAudio();
        }
        
        showToast("Crop Doctor AI diagnosis complete!", "success");
        
    } catch (e) {
        console.error('Vision AI diagnostic failure:', e);
        showToast("Backend AI Vision requires GEMINI_API_KEY. Using local fallback templates.", "info");
        
        const selectedCrop = appState.farmerProfile.crop || 'Rice';
        
        const fallbackDatabase = {
            Rice: {
                cropName: "Rice (Oryza sativa) - Template Fallback",
                issue: "Rice Blast (Magnaporthe oryzae)",
                symptoms: [
                    "Spindle-shaped lesions with grey centres on leaves.",
                    "Neck rot lesions on the collar region.",
                    "Rapid lodging in highly infested nitrogenous patches."
                ],
                prevention: [
                    "High moisture retention (relative humidity > 85%).",
                    "Excessive application of chemical nitrogenous fertilizers.",
                    "Infected crop stubbles left from the previous season."
                ],
                treatment: [
                    "Postpone irrigation temporarily due to high humidity.",
                    "Spray tricyclazole 75 WP at 0.6g/L or carbendazim 50 WP at 1g/L.",
                    "Apply potassium fertilizer (muriate of potash) to enhance resistance."
                ],
                speechText: "Rice blast suspected. We recommend avoiding excessive nitrogen, applying potash, and spraying tricyclazole."
            },
            Tomato: {
                cropName: "Tomato (Solanum lycopersicum) - Template Fallback",
                issue: "Early Blight (Alternaria solani)",
                symptoms: [
                    "Concentric rings or 'target-board' lesions on older leaves.",
                    "Leaf yellowing and premature defoliation.",
                    "Dark brown lesions on fruit stems."
                ],
                prevention: [
                    "High humidity (>90%) with warm temperatures (24-29°C).",
                    "Dense plant canopy blocking air circulation.",
                    "Excess overhead sprinkler irrigation wetting leaves."
                ],
                treatment: [
                    "Prune lower foliage to increase ventilation.",
                    "Apply copper oxychloride (3g/L) or azoxystrobin (1ml/L) as foliar spray.",
                    "Avoid overhead irrigation, switch to drip irrigation."
                ],
                speechText: "Early blight suspected. Prune lower foliage and spray copper oxychloride."
            },
            Chilli: {
                cropName: "Chilli (Capsicum annuum) - Template Fallback",
                issue: "Fruit Rot / Anthracnose (Colletotrichum capsici)",
                symptoms: [
                    "Circular, water-soaked, sunken lesions on fruits.",
                    "Straw-colored dry patches on leaves.",
                    "Premature fruit dropping and decay."
                ],
                prevention: [
                    "Monsoon humidity combined with temperatures between 28-32°C.",
                    "Infected seeds or soil carrying fungal spores.",
                    "Poor drainage leading to soil waterlogging."
                ],
                treatment: [
                    "Remove and destroy infected fruits immediately.",
                    "Spray azoxystrobin 1ml/L or copper oxychloride 2.5g/L.",
                    "Transition to drip irrigation during fruiting phase."
                ],
                speechText: "Chilli fruit rot suspected. Destroy infected fruits and apply copper oxychloride."
            }
        };
        
        const db = fallbackDatabase[selectedCrop] || fallbackDatabase.Rice;
        
        if (cropName) cropName.textContent = db.cropName;
        if (issueName) {
            issueName.textContent = db.issue;
            issueName.className = "text-danger";
        }
        
        const confidenceScore = 85;
        if (confVal) confVal.textContent = `${confidenceScore}%`;
        if (gaugeFill) {
            gaugeFill.style.strokeDashoffset = (25.12 * (10 - confidenceScore/10)).toFixed(0); 
        }
        
        if (obsList) {
            obsList.innerHTML = '';
            db.symptoms.forEach(obs => {
                const li = document.createElement('li');
                li.textContent = obs;
                obsList.appendChild(li);
            });
        }
        
        if (causesList) {
            causesList.innerHTML = '';
            db.prevention.forEach(cause => {
                const li = document.createElement('li');
                li.textContent = cause;
                causesList.appendChild(li);
            });
        }
        
        if (stepsList) {
            stepsList.innerHTML = '';
            db.treatment.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                stepsList.appendChild(li);
            });
        }
        
        appState.lastSpeechText = db.speechText;
        if (document.getElementById('settings-auto-speech').checked) {
            playDiagnosticAudio();
        }
    }
}


// Active session cache
async function checkSessionActive() {
    if (!supabaseClient) {
        const mockUser = localStorage.getItem('agrisaarthi_sandbox_user');
        if (mockUser) {
            currentSessionUser = JSON.parse(mockUser);
            return true;
        }
        return false;
    }
    
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        
        if (session) {
            currentSessionUser = session.user;
            return true;
        }
    } catch (e) {
        console.error('Error checking Supabase session:', e);
    }
    
    currentSessionUser = null;
    return false;
}

// Fetch user profile from database
async function getUserProfile() {
    if (currentProfileData) return currentProfileData;
    
    if (!supabaseClient) {
        const localProf = localStorage.getItem('agrisaarthi_sandbox_profile');
        if (localProf) {
            currentProfileData = JSON.parse(localProf);
            return currentProfileData;
        }
        return null;
    }
    
    if (!currentSessionUser) return null;
    
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', currentSessionUser.id)
            .single();
            
        if (!error && data) {
            currentProfileData = data;
            return data;
        }
    } catch (e) {
        console.error('Error loading profiles from Supabase:', e);
    }
    return null;
}

// Personalize dashboard with user details
function updateDashboardPersonalization() {
    const profile = currentProfileData || appState.farmerProfile;
    if (!profile) return;
    
    // Time-of-day aware greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const displayName = profile.name || 'Farmer';
    
    const welcomeText = document.getElementById('header-welcome-text');
    if (welcomeText) {
        welcomeText.textContent = `${greeting}, ${displayName} 🌱`;
    }
    
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) {
        sidebarName.textContent = displayName;
    }
    
    // Active Crop Profile → Farmer Name
    const farmProfName = document.getElementById('farm-prof-name');
    if (farmProfName) {
        farmProfName.textContent = displayName;
    }
    
    const langDisplay = document.getElementById('farm-prof-lang');
    if (langDisplay) {
        langDisplay.textContent = `Your preferred language: ${profile.preferred_language || appState.currentLanguage}`;
    }
    
    const cropNameEl = document.getElementById('dash-crop-name');
    if (cropNameEl) cropNameEl.textContent = profile.crop || 'Rice';
    
    const varietyEl = document.getElementById('dash-crop-variety');
    if (varietyEl) varietyEl.textContent = profile.variety || '';
    
    const stageEl = document.getElementById('dash-crop-stage');
    if (stageEl) stageEl.textContent = profile.stage || 'Vegetative';
    
    const sizeEl = document.getElementById('farm-prof-size');
    if (sizeEl) sizeEl.textContent = `${profile.size || 4} Acres`;
}

// Load profile data on app launch
async function loadProfileDataOnStartup() {
    const isAuthed = await checkSessionActive();
    if (isAuthed) {
        const profile = await getUserProfile();
        if (profile) {
            Object.assign(appState.farmerProfile, profile);
            updateDashboardPersonalization();
        }
    }
}

// Client-side single-page router transition handler
async function navigateToRoute(path, pushState = true) {
    const isAuthed = await checkSessionActive();
    const publicRoutes = ['/login', '/register', '/signup', '/forgot-password', '/'];
    
    let targetPath = path;
    
    if (isAuthed) {
        if (publicRoutes.includes(path)) {
            const profile = await getUserProfile();
            if (!profile) {
                targetPath = '/language';
            } else {
                targetPath = '/dashboard';
            }
        }
    } else {
        if (!publicRoutes.includes(path)) {
            targetPath = '/login';
        }
    }
    
    const route = routes[targetPath];
    if (!route) return;
    
    if (pushState && window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
    }
    
    executeViewNavigation(route.view);
    if (route.pane) {
        executePaneActivation(route.pane);
    }
}

function bindRoutingHandlers() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        const onclickText = item.getAttribute('onclick') || '';
        if (onclickText.includes('dashboard-pane')) item.setAttribute('data-route', '/dashboard');
        else if (onclickText.includes('farm-pane')) item.setAttribute('data-route', '/farm');
        else if (onclickText.includes('crop-doctor-pane')) item.setAttribute('data-route', '/crop-intelligence');
        else if (onclickText.includes('weather-pane')) item.setAttribute('data-route', '/weather');
        else if (onclickText.includes('soil-water-pane')) item.setAttribute('data-route', '/soil');
        else if (onclickText.includes('market-pane')) item.setAttribute('data-route', '/market');
        else if (onclickText.includes('product-checker-pane')) item.setAttribute('data-route', '/pesticide');
        else if (onclickText.includes('ai-chat-pane')) item.setAttribute('data-route', '/assistant');
        else if (onclickText.includes('community-pane')) item.setAttribute('data-route', '/community');
        else if (onclickText.includes('profile-pane')) item.setAttribute('data-route', '/profile');
        else if (onclickText.includes('settings-pane')) item.setAttribute('data-route', '/settings');
        item.removeAttribute('onclick');
    });

    const mobileItems = document.querySelectorAll('.mobile-nav-item');
    mobileItems.forEach(item => {
        const onclickText = item.getAttribute('onclick') || '';
        if (onclickText.includes('dashboard-pane')) item.setAttribute('data-route', '/dashboard');
        else if (onclickText.includes('farm-pane')) item.setAttribute('data-route', '/farm');
        else if (onclickText.includes('ai-chat-pane')) item.setAttribute('data-route', '/assistant');
        else if (onclickText.includes('crop-doctor-pane')) item.setAttribute('data-route', '/crop-intelligence');
        else if (onclickText.includes('community-pane')) item.setAttribute('data-route', '/community');
        item.removeAttribute('onclick');
    });
}

// Initialize application routing
async function initAppRouting() {
    await initSupabaseClient();
    await loadProfileDataOnStartup();
    
    document.addEventListener('click', e => {
        const target = e.target.closest('[data-route]');
        if (target) {
            e.preventDefault();
            navigateToRoute(target.getAttribute('data-route'));
        }
    });
    
    bindRoutingHandlers();
    bindRealtimeValidationListeners();
    
    const path = window.location.pathname;
    await navigateToRoute(path, false);
}

// Intercept popstate for back/forward support
window.onpopstate = function(event) {
    navigateToRoute(window.location.pathname, false);
};

// Toggle password visibility field
function togglePasswordVisibility(fieldId, iconElement) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
}

// Authentication messaging helper
function showAuthMessage(containerId, message, type = 'error') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.textContent = message;
    container.className = `auth-message ${type}`;
}

function clearAuthMessage(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = '';
        container.className = 'auth-message hidden';
    }
}

function setAuthButtonLoading(buttonId, isLoading) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    const spinner = btn.querySelector('.btn-spinner');
    const text = btn.querySelector('.btn-text');
    if (isLoading) {
        btn.disabled = true;
        if (spinner) spinner.classList.remove('hidden');
        if (text) text.classList.add('hidden');
    } else {
        btn.disabled = false;
        if (spinner) spinner.classList.add('hidden');
        if (text) text.classList.remove('hidden');
    }
}

// Handle login submissions
// Validation helpers
function validateRegisterName(name) {
    const errorEl = document.getElementById('error-register-name');
    if (!name) {
        errorEl.textContent = "Full Name is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        errorEl.textContent = "Name must contain only letters and spaces.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function validateRegisterPhone(phone) {
    const errorEl = document.getElementById('error-register-phone');
    if (!phone) {
        errorEl.textContent = "Phone Number is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        errorEl.textContent = "Please enter a valid 10-digit Indian mobile number.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function validateRegisterEmail(email) {
    const errorEl = document.getElementById('error-register-email');
    if (!email) {
        errorEl.textContent = "Email Address is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorEl.textContent = "Please enter a valid email address.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function validateRegisterPassword(password) {
    const errorEl = document.getElementById('error-register-password');
    if (!password) {
        errorEl.textContent = "Password is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    const pRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`\-]).{8,}$/;
    if (!pRegex.test(password)) {
        errorEl.textContent = "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function validateRegisterConfirmPassword(confirmPassword, password) {
    const errorEl = document.getElementById('error-register-confirm-password');
    if (!confirmPassword) {
        errorEl.textContent = "Confirm Password is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    if (confirmPassword !== password) {
        errorEl.textContent = "Passwords do not match.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function validateLoginEmail(email) {
    const errorEl = document.getElementById('error-login-email');
    if (!email) {
        errorEl.textContent = "Email Address is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorEl.textContent = "Please enter a valid email address.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function validateLoginPassword(password) {
    const errorEl = document.getElementById('error-login-password');
    if (!password) {
        errorEl.textContent = "Password is required.";
        errorEl.classList.remove('hidden');
        return false;
    }
    errorEl.classList.add('hidden');
    return true;
}

function bindRealtimeValidationListeners() {
    const rName = document.getElementById('register-name');
    if (rName) rName.addEventListener('input', () => validateRegisterName(rName.value.trim()));
    
    const rPhone = document.getElementById('register-phone');
    if (rPhone) rPhone.addEventListener('input', () => validateRegisterPhone(rPhone.value.trim()));
    
    const rEmail = document.getElementById('register-email');
    if (rEmail) rEmail.addEventListener('input', () => validateRegisterEmail(rEmail.value.trim()));
    
    const rPass = document.getElementById('register-password');
    if (rPass) rPass.addEventListener('input', () => validateRegisterPassword(rPass.value.trim()));
    
    const rConf = document.getElementById('register-confirm-password');
    if (rConf) rConf.addEventListener('input', () => validateRegisterConfirmPassword(rConf.value.trim(), rPass ? rPass.value.trim() : ''));

    const lEmail = document.getElementById('login-email');
    if (lEmail) lEmail.addEventListener('input', () => validateLoginEmail(lEmail.value.trim()));
    
    const lPass = document.getElementById('login-password');
    if (lPass) lPass.addEventListener('input', () => validateLoginPassword(lPass.value.trim()));
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Handle login submissions
async function handleLogin(event) {
    if (event) event.preventDefault();
    clearAuthMessage('login-auth-msg');
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    const isEmailVal = validateLoginEmail(email);
    const isPassVal = validateLoginPassword(password);
    if (!isEmailVal || !isPassVal) return;
    
    setAuthButtonLoading('login-submit-btn', true);
    
    if (supabaseClient) {
        try {
            const { data: profileCheck } = await supabaseClient
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle();
                
            if (!profileCheck) {
                showAuthMessage('login-auth-msg', 'Account not found. Please register first.', 'error');
                setAuthButtonLoading('login-submit-btn', false);
                return;
            }
            
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) {
                if (error.message.includes('Invalid login credentials') || error.message.includes('invalid credentials')) {
                    throw new Error('Incorrect password. Please try again.');
                }
                throw error;
            }
            
            currentSessionUser = data.user;
            currentProfileData = null;
            
            showAuthMessage('login-auth-msg', 'Login successful! Redirecting...', 'success');
            setTimeout(async () => {
                setAuthButtonLoading('login-submit-btn', false);
                const profile = await getUserProfile();
                if (!profile) {
                    navigateToRoute('/language');
                } else {
                    navigateToRoute('/dashboard');
                }
            }, 1000);
            return;
        } catch (e) {
            console.error('Supabase login error:', e);
            showAuthMessage('login-auth-msg', e.message || 'Authentication failed. Please verify credentials.', 'error');
            setAuthButtonLoading('login-submit-btn', false);
            return;
        }
    }
    
    // Sandbox local fallback
    setTimeout(async () => {
        const users = JSON.parse(localStorage.getItem('agrisaarthi_registered_users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
            if (email === 'farmer@domain.com') {
                const hashedSeedPass = await hashPassword('Farmer@123');
                const seedUser = { id: 'u_sandbox_123', name: 'Ravi Kumar', email: 'farmer@domain.com', phone: '9876543210', password: hashedSeedPass };
                users.push(seedUser);
                localStorage.setItem('agrisaarthi_registered_users', JSON.stringify(users));
                
                if (password !== 'Farmer@123') {
                    showAuthMessage('login-auth-msg', 'Incorrect password. Please try again.', 'error');
                    setAuthButtonLoading('login-submit-btn', false);
                    return;
                }
                
                const seedProfile = { id: 'u_sandbox_123', name: 'Ravi Kumar', email: 'farmer@domain.com', phone: '9876543210', preferred_language: 'english' };
                localStorage.setItem('agrisaarthi_sandbox_profile', JSON.stringify(seedProfile));
                localStorage.setItem('agrisaarthi_sandbox_user', JSON.stringify(seedUser));
                currentSessionUser = seedUser;
                currentProfileData = seedProfile;
                
                showAuthMessage('login-auth-msg', 'Sandbox Login Successful!', 'success');
                setTimeout(async () => {
                    setAuthButtonLoading('login-submit-btn', false);
                    navigateToRoute('/dashboard');
                }, 1000);
                return;
            }
            
            showAuthMessage('login-auth-msg', 'Account not found. Please register first.', 'error');
            setAuthButtonLoading('login-submit-btn', false);
            return;
        }
        
        const hashedPassword = await hashPassword(password);
        if (user.password !== hashedPassword) {
            showAuthMessage('login-auth-msg', 'Incorrect password. Please try again.', 'error');
            setAuthButtonLoading('login-submit-btn', false);
            return;
        }
        
        localStorage.setItem('agrisaarthi_sandbox_user', JSON.stringify(user));
        
        let profile = localStorage.getItem('agrisaarthi_sandbox_profile');
        if (profile) {
            const p = JSON.parse(profile);
            if (p.id !== user.id) {
                const newP = { id: user.id, name: user.name, email: user.email, phone: user.phone, preferred_language: 'english' };
                localStorage.setItem('agrisaarthi_sandbox_profile', JSON.stringify(newP));
                currentProfileData = newP;
            } else {
                currentProfileData = p;
            }
        } else {
            const newP = { id: user.id, name: user.name, email: user.email, phone: user.phone, preferred_language: 'english' };
            localStorage.setItem('agrisaarthi_sandbox_profile', JSON.stringify(newP));
            currentProfileData = newP;
        }
        
        currentSessionUser = user;
        
        showAuthMessage('login-auth-msg', 'Sandbox Login Successful!', 'success');
        setTimeout(async () => {
            setAuthButtonLoading('login-submit-btn', false);
            const userProfile = await getUserProfile();
            if (!userProfile) {
                navigateToRoute('/language');
            } else {
                navigateToRoute('/dashboard');
            }
        }, 1000);
    }, 800);
}

// Handle Register submissions
async function handleRegister(event) {
    if (event) event.preventDefault();
    clearAuthMessage('register-auth-msg');
    
    const name = document.getElementById('register-name').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirmPassword = document.getElementById('register-confirm-password').value.trim();
    
    const isNameVal = validateRegisterName(name);
    const isPhoneVal = validateRegisterPhone(phone);
    const isEmailVal = validateRegisterEmail(email);
    const isPassVal = validateRegisterPassword(password);
    const isConfVal = validateRegisterConfirmPassword(confirmPassword, password);
    
    if (!isNameVal || !isPhoneVal || !isEmailVal || !isPassVal || !isConfVal) {
        showAuthMessage('register-auth-msg', 'Please correct the validation errors below.', 'error');
        return;
    }
    
    setAuthButtonLoading('register-submit-btn', true);
    
    if (supabaseClient) {
        try {
            const { data: profileCheck } = await supabaseClient
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle();
                
            if (profileCheck) {
                showAuthMessage('register-auth-msg', 'Account already exists. Please login.', 'error');
                setAuthButtonLoading('register-submit-btn', false);
                return;
            }
            
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name,
                        phone: phone
                    }
                }
            });
            if (error) {
                if (error.message.includes('already exists') || error.message.includes('registered')) {
                    throw new Error('Account already exists. Please login.');
                }
                throw error;
            }
            
            try {
                const user = data.user;
                if (user) {
                    await supabaseClient.from('profiles').upsert({
                        id: user.id,
                        name: name,
                        phone: phone,
                        email: email,
                        preferred_language: 'english'
                    });
                }
            } catch (profileErr) {
                console.error("Secondary profile insert error:", profileErr);
            }
            
            showAuthMessage('register-auth-msg', 'Registration successful! Directing to language setup...', 'success');
            currentSessionUser = data.user;
            currentProfileData = null;
            
            setTimeout(() => {
                setAuthButtonLoading('register-submit-btn', false);
                navigateToRoute('/language');
            }, 1000);
            return;
        } catch (e) {
            console.error('Supabase registration error:', e);
            showAuthMessage('register-auth-msg', e.message || 'Registration failed.', 'error');
            setAuthButtonLoading('register-submit-btn', false);
            return;
        }
    }
    
    // Sandbox local fallback
    setTimeout(async () => {
        const users = JSON.parse(localStorage.getItem('agrisaarthi_registered_users') || '[]');
        if (users.some(u => u.email === email)) {
            showAuthMessage('register-auth-msg', 'Account already exists. Please login.', 'error');
            setAuthButtonLoading('register-submit-btn', false);
            return;
        }
        
        const hashedPassword = await hashPassword(password);
        const newUser = {
            id: 'u_' + Math.random().toString(36).substr(2, 9),
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword
        };
        users.push(newUser);
        localStorage.setItem('agrisaarthi_registered_users', JSON.stringify(users));
        
        const sandboxProfile = {
            id: newUser.id,
            name: name,
            email: email,
            phone: phone,
            preferred_language: 'english'
        };
        localStorage.setItem('agrisaarthi_sandbox_profile', JSON.stringify(sandboxProfile));
        localStorage.setItem('agrisaarthi_sandbox_user', JSON.stringify(newUser));
        
        currentSessionUser = newUser;
        currentProfileData = sandboxProfile;
        
        showAuthMessage('register-auth-msg', 'Sandbox registration successful!', 'success');
        setTimeout(() => {
            setAuthButtonLoading('register-submit-btn', false);
            navigateToRoute('/language');
        }, 1000);
    }, 800);
}

// Handle Forgot Password submissions
async function handleForgotPassword(event) {
    if (event) event.preventDefault();
    clearAuthMessage('forgot-auth-msg');
    
    const email = document.getElementById('forgot-email').value.trim();
    setAuthButtonLoading('forgot-submit-btn', true);
    
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`
            });
            if (error) throw error;
            
            showAuthMessage('forgot-auth-msg', 'Recovery link sent! Please check your email.', 'success');
        } catch (e) {
            console.error('Supabase reset error:', e);
            showAuthMessage('forgot-auth-msg', e.message || 'Failed to send recovery link.', 'error');
        } finally {
            setAuthButtonLoading('forgot-submit-btn', false);
        }
        return;
    }
    
    // Sandbox fallback recovery
    setTimeout(() => {
        showAuthMessage('forgot-auth-msg', 'Sandbox Recovery: Recovery link successfully simulated.', 'success');
        setAuthButtonLoading('forgot-submit-btn', false);
    }, 800);
}

// Auto-inject demo credentials for rapid testing
function handleOTPLoginDemo() {
    document.getElementById('login-email').value = 'demo@agrisaarthi.ai';
    document.getElementById('login-password').value = '123456';
    handleLogin();
}

// Selects language card on onboarding language picker
function selectPostLoginLanguage(lang) {
    setLanguage(lang);
    navigateTo('onboarding-view');
    nextOnboardStep(1);
    
    if (lang === 'telugu') {
        speakSpeech("దయచేసి మీ వ్యవసాయ ప్రొఫైల్‌ను సృష్టించండి. ఇది మీకు సరైన వ్యవసాయ సలహాలను ఇవ్వడానికి సహాయపడుతుంది.", "telugu");
    } else {
        speakSpeech("Please create your farm profile to help us customize decisions for you.", "english");
    }
}

// Navigate onboarding card pages
function nextOnboardStep(stepNum) {
    document.querySelectorAll('.onboarding-step').forEach(step => step.classList.add('hidden'));
    document.getElementById(`step-${stepNum}`).classList.remove('hidden');
    
    // Update step dots
    const dots = document.querySelectorAll('.onboarding-progress .step-dot');
    dots.forEach((dot, idx) => {
        if (idx < stepNum) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Visual selection cards for crop types
function selectCropCard(cardEl, cropName) {
    const parent = cardEl.parentElement;
    parent.querySelectorAll('.select-card').forEach(card => card.classList.remove('active'));
    cardEl.classList.add('active');
    document.getElementById('ob-crop').value = cropName;
    appState.farmerProfile.crop = cropName;
}

// Submit onboarding details
async function handleOnboarding(event) {
    if (event) event.preventDefault();
    
    const profileData = {
        id: currentSessionUser ? currentSessionUser.id : 'u_sandbox_123',
        name: document.getElementById('ob-name').value.trim(),
        preferred_language: appState.currentLanguage,
        state: document.getElementById('ob-state').value,
        district: document.getElementById('ob-district').value,
        crop: appState.farmerProfile.crop || 'Rice',
        variety: document.getElementById('ob-variety').value,
        soil: document.getElementById('ob-soil').value,
        irrigation: document.getElementById('ob-irrigation').value,
        size: document.getElementById('ob-size').value,
        stage: document.getElementById('ob-stage').value
    };
    
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('profiles')
                .upsert([profileData]);
            if (error) throw error;
        } catch (e) {
            console.error('Error saving profile to Supabase:', e);
            showToast('Failed to save profile. Saving locally.', 'warning');
        }
    }
    
    currentProfileData = profileData;
    localStorage.setItem('agrisaarthi_sandbox_profile', JSON.stringify(profileData));
    Object.assign(appState.farmerProfile, profileData);
    
    // Personalize layout headers and labels
    updateDashboardPersonalization();
    
    // Trigger history load
    await initChatHistory();
    
    navigateToRoute('/dashboard');
    showToast(appState.currentLanguage === 'telugu' ? "మీ ప్రొఫైల్ సేవ్ చేయబడింది." : "Profile saved successfully!", "success");
}

function skipOnboarding() {
    // Generate a default template profile
    const profileData = {
        id: currentSessionUser ? currentSessionUser.id : 'u_sandbox_123',
        name: 'Ravi Kumar',
        preferred_language: appState.currentLanguage,
        state: 'Telangana',
        district: 'Suryapet',
        crop: 'Rice',
        variety: 'Telangana Sona (BPT 5204)',
        soil: 'Clayey',
        irrigation: 'Drip Irrigation',
        size: 4,
        stage: 'Vegetative'
    };
    
    currentProfileData = profileData;
    localStorage.setItem('agrisaarthi_sandbox_profile', JSON.stringify(profileData));
    Object.assign(appState.farmerProfile, profileData);
    
    updateDashboardPersonalization();
    initChatHistory();
    navigateToRoute('/dashboard');
}

async function logoutFarmer() {
    if (supabaseClient) {
        try {
            await supabaseClient.auth.signOut();
        } catch (e) {
            console.error('Supabase signout error:', e);
        }
    }
    
    currentSessionUser = null;
    currentProfileData = null;
    appState.currentConversationId = null;
    appState.conversations = [];
    
    localStorage.removeItem('agrisaarthi_sandbox_user');
    localStorage.removeItem('agrisaarthi_sandbox_profile');
    localStorage.removeItem('agrisaarthi_user_id');
    
    navigateToRoute('/login');
    showToast("Signed out successfully.", "success");
}

// Speak the main farm recommendation aloud
function playCurrentDecisionVoice() {
    const text = document.getElementById('decision-text-content').textContent;
    speakSpeech(text, appState.currentLanguage);
}

// Helper for Toast Notifications
function showToast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '80px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notif ${type}`;
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.color = '#fff';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.minWidth = '250px';
    
    // Select background color
    if (type === 'error') toast.style.backgroundColor = '#D32F2F';
    else if (type === 'success') toast.style.backgroundColor = '#388E3C';
    else if (type === 'warning') toast.style.backgroundColor = '#F57C00';
    else toast.style.backgroundColor = '#1E4620';
    
    const icon = document.createElement('i');
    if (type === 'error') icon.className = 'fa-solid fa-circle-xmark';
    else if (type === 'success') icon.className = 'fa-solid fa-circle-check';
    else if (type === 'warning') icon.className = 'fa-solid fa-triangle-exclamation';
    else icon.className = 'fa-solid fa-circle-info';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = msg;
    
    toast.appendChild(icon);
    toast.appendChild(textSpan);
    container.appendChild(toast);
    
    // Dismiss after 3.5s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// File Validation Helper
function validateFile(file, allowedTypes, maxSizeMB) {
    if (!file) return { valid: false, error: 'No file selected / ఫైల్ ఎంచుకోబడలేదు' };
    
    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    if (!isValidType) {
        return { valid: false, error: `Invalid file format / తప్పుడు ఫైల్ ఫార్మాట్. Supported: ${allowedTypes.join(', ')}` };
    }
    
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
        return { valid: false, error: `File is too large / ఫైల్ చాలా పెద్దదిగా ఉంది. Max size: ${maxSizeMB}MB` };
    }
    
    return { valid: true };
}

// Video Frame Extractor
function extractVideoFrames(file, callback) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    
    video.addEventListener('loadeddata', () => {
        const duration = video.duration;
        const seekPoints = [duration * 0.2, duration * 0.5, duration * 0.8];
        const frames = [];
        let currentSeekIdx = 0;
        
        const captureFrame = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas.toDataURL('image/jpeg'));
            
            currentSeekIdx++;
            if (currentSeekIdx < seekPoints.length) {
                video.currentTime = seekPoints[currentSeekIdx];
            } else {
                URL.revokeObjectURL(video.src);
                callback(frames);
            }
        };
        
        video.addEventListener('seeked', captureFrame);
        video.currentTime = seekPoints[0];
    });
}

// Global upload states
let activeCropFile = null;
let activeCropFrames = [];

// Handle Crop Doctor Uploads
function handleCropFileSelected(input, fileType) {
    const file = input.files[0];
    if (!file) return;
    
    const allowed = fileType === 'image' ? ['image/'] : ['video/'];
    const maxVal = fileType === 'image' ? 15 : 50; 
    
    const validation = validateFile(file, allowed, maxVal);
    if (!validation.valid) {
        showToast(validation.error, 'error');
        input.value = '';
        return;
    }
    
    if (appState.activeCropUrl) {
        URL.revokeObjectURL(appState.activeCropUrl);
    }
    
    activeCropFile = file;
    appState.activeCropUrl = URL.createObjectURL(file);
    activeCropFrames = [];
    
    const fileInfo = document.getElementById('crop-file-info');
    const filenameEl = document.getElementById('crop-filename');
    const filesizeEl = document.getElementById('crop-filesize');
    
    if (fileInfo && filenameEl && filesizeEl) {
        fileInfo.style.display = 'inline-flex';
        filenameEl.textContent = file.name;
        filesizeEl.textContent = ` (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    }
    
    const loader = document.getElementById('crop-scanning-loader');
    const result = document.getElementById('crop-diagnostic-result');
    if (result) result.classList.add('hidden');
    if (loader) loader.classList.remove('hidden');
    
    const loaderText = document.getElementById('doctor-loader-text');
    const loadingTexts = {
        english: fileType === 'image' ? "Analyzing crop leaf image..." : "Extracting video frames and scanning field...",
        telugu: fileType === 'image' ? "పంట ఆకును విశ్లేషిస్తోంది..." : "వీడియో ఫ్రేమ్‌లను విశ్లేషిస్తోంది...",
        hindi: fileType === 'image' ? "फसल के पत्ते की छवि का विश्लेषण..." : "वीडियो फ़्रेम निकाल रहा है और स्कैन कर रहा है...",
        tamil: fileType === 'image' ? "பயிர் இலை படத்தை பகுப்பாய்வு செய்கிறது..." : "வீடியோ பிரேம்களை பிரித்தெடுத்து ஸ்கேன் செய்கிறது...",
        kannada: fileType === 'image' ? "ಬೆಳೆ ಎಲೆಯ ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..." : "ವಿಡಿಯೋ ಫ್ರೇಮ್‌ಗಳನ್ನು ಹೊರತೆಗೆದು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
    };
    if (loaderText) {
        loaderText.textContent = loadingTexts[appState.currentLanguage] || loadingTexts.english;
    }
    
    if (fileType === 'video') {
        extractVideoFrames(file, (frames) => {
            activeCropFrames = frames;
            
            const framesContainer = document.getElementById('extracted-frames-container');
            const framesList = document.getElementById('extracted-frames-list');
            if (framesContainer && framesList) {
                framesContainer.classList.remove('hidden');
                framesList.innerHTML = '';
                frames.forEach((frameData, idx) => {
                    const img = document.createElement('img');
                    img.src = frameData;
                    img.style.width = '70px';
                    img.style.height = '50px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '4px';
                    img.style.border = '1px solid var(--border-color)';
                    framesList.appendChild(img);
                });
            }
            
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
                if (result) result.classList.remove('hidden');
                runCropDoctorAnalysis(file, 'video');
            }, 2500);
        });
    } else {
        const framesContainer = document.getElementById('extracted-frames-container');
        if (framesContainer) framesContainer.classList.add('hidden');
        
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
            if (result) result.classList.remove('hidden');
            runCropDoctorAnalysis(file, 'image');
        }, 2000);
    }
}

// Kept for demo widget compatibility
function simulateCropPhotoUpload() {
    document.getElementById('crop-photo-input').click();
}
function simulateCropImageUpload() {
    document.getElementById('crop-image-input').click();
}
function simulateCropVideoUpload() {
    document.getElementById('crop-video-input').click();
}

// Take Photo: open device camera, capture image, feed into crop analysis flow
async function openCameraCapture() {
    // Check if MediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Camera API is not supported on this browser. Please upload a photo instead.', 'error');
        return;
    }
    
    let stream = null;
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    } catch (permErr) {
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
            showToast('Camera permission is required to take a photo. Please allow camera access and try again.', 'error');
        } else {
            showToast('Unable to open camera: ' + (permErr.message || 'Unknown error'), 'error');
        }
        return;
    }
    
    // Build the camera overlay UI
    const overlay = document.createElement('div');
    overlay.id = 'camera-capture-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;';
    
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.style.cssText = 'max-width:100%;max-height:65vh;border-radius:12px;border:2px solid var(--primary, #2e7d32);';
    video.srcObject = stream;
    
    const hint = document.createElement('p');
    hint.textContent = 'Point camera at the crop leaf and tap Capture';
    hint.style.cssText = 'color:#fff;font-size:0.9rem;margin:0;opacity:0.8;';
    
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:16px;';
    
    const captureBtn = document.createElement('button');
    captureBtn.textContent = '📷 Capture Photo';
    captureBtn.className = 'btn primary';
    captureBtn.style.cssText = 'min-width:160px;font-weight:700;';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'btn secondary';
    
    btnRow.appendChild(captureBtn);
    btnRow.appendChild(cancelBtn);
    overlay.appendChild(video);
    overlay.appendChild(hint);
    overlay.appendChild(btnRow);
    document.body.appendChild(overlay);
    
    const closeCamera = () => {
        stream.getTracks().forEach(t => t.stop());
        overlay.remove();
    };
    
    cancelBtn.onclick = closeCamera;
    
    captureBtn.onclick = () => {
        // Draw the current video frame to a canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        closeCamera();
        
        // Convert canvas to a Blob / File and feed into existing crop analysis flow
        canvas.toBlob(blob => {
            if (!blob) {
                showToast('Failed to capture photo. Please try again.', 'error');
                return;
            }
            const capturedFile = new File([blob], `crop_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            // Create a synthetic file input and trigger the existing handler
            const syntheticInput = { files: [capturedFile] };
            handleCropFileSelected(syntheticInput, 'image');
            
            showToast('Photo captured! Analyzing your crop...', 'success');
        }, 'image/jpeg', 0.92);
    };
}

function runSimulatedCropScan() {
    appState.activeCropUrl = "images/tomato_disease.png";
    runCropDoctorAnalysis(null, 'image');
}

function playDiagnosticAudio() {
    if (appState.lastSpeechText) {
        speakSpeech(appState.lastSpeechText, appState.currentLanguage);
    } else {
        const text = appState.currentLanguage === 'telugu' ? 
            "ఆకు మచ్చ తెగులు నివారణకు వర్షం పడనప్పుడు క్లోరోథలోనిల్ పిచికారీ చేయండి." : 
            "Fungal spot disease suspected. Postpone irrigation and spray chlorothalonil in dry conditions.";
        speakSpeech(text, appState.currentLanguage);
    }
}

function resetCropUpload() {
    const fileInfo = document.getElementById('crop-file-info');
    if (fileInfo) fileInfo.style.display = 'none';
    
    const result = document.getElementById('crop-diagnostic-result');
    if (result) result.classList.add('hidden');
    
    const framesContainer = document.getElementById('extracted-frames-container');
    if (framesContainer) framesContainer.classList.add('hidden');
    
    // Clear inputs
    document.getElementById('crop-photo-input').value = '';
    document.getElementById('crop-image-input').value = '';
    document.getElementById('crop-video-input').value = '';
    
    if (appState.activeCropUrl) {
        URL.revokeObjectURL(appState.activeCropUrl);
        appState.activeCropUrl = null;
    }
    activeCropFile = null;
    activeCropFrames = [];
}

// Pesticide Upload Handlers
let activePesticideFile = null;

function handlePesticideFileSelected(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file, ['image/'], 15);
    if (!validation.valid) {
        showToast(validation.error, 'error');
        input.value = '';
        return;
    }
    
    if (appState.activePesticideUrl) {
        URL.revokeObjectURL(appState.activePesticideUrl);
    }
    
    activePesticideFile = file;
    appState.activePesticideUrl = URL.createObjectURL(file);
    
    // Update badge details
    const fileInfo = document.getElementById('pest-file-info');
    const filenameEl = document.getElementById('pest-filename');
    const filesizeEl = document.getElementById('pest-filesize');
    if (fileInfo && filenameEl && filesizeEl) {
        fileInfo.style.display = 'inline-flex';
        filenameEl.textContent = file.name;
        filesizeEl.textContent = ` (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    }
    
    // Trigger loader
    const loader = document.getElementById('checker-scanning-loader');
    const result = document.getElementById('checker-analysis-result');
    if (result) result.classList.add('hidden');
    if (loader) loader.classList.remove('hidden');
    
    setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
        
        // Simulates OCR label text extraction
        const lowerName = file.name.toLowerCase();
        let brandName = "Kavach Fungicide";
        let activeIngredient = "Chlorothalonil 75% WP";
        let chemicalCategory = "Broad Spectrum Fungicide";
        let targets = "Leaf Spot, Early/Late Blight, Downy Mildew, Rust";
        let safetyInfo = "Toxic to aquatic life. Re-entry interval 24 hrs.";
        
        if (lowerName.includes('insect') || lowerName.includes('chlorpy') || lowerName.includes('pest') || lowerName.includes('spray')) {
            brandName = "Coromandel Chlorpyriphos 20% EC";
            activeIngredient = "Chlorpyriphos 20% EC";
            chemicalCategory = "Organophosphate Insecticide";
            targets = "Stem Borer, Leaf Folder, Gall Midge, Cutworms, Termites";
            safetyInfo = "Extremely toxic. Keep away from domestic animals. Highly toxic to honeybees.";
        }
        
        appState.detectedActiveIngredient = activeIngredient.split(' ')[0]; // 'Chlorothalonil' or 'Chlorpyriphos'
        appState.detectedBrand = brandName;
        appState.detectedIngredientFull = activeIngredient;
        
        const titleEl = document.getElementById('extracted-product-title');
        if (titleEl) titleEl.textContent = `Product Detected: ${brandName}`;
        
        const ocrEl = document.getElementById('ocr-extracted-text');
        if (ocrEl) {
            ocrEl.innerHTML = `
                <strong>Brand:</strong> ${brandName}<br>
                <strong>Active Ingredient:</strong> ${activeIngredient}<br>
                <strong>Category:</strong> ${chemicalCategory}<br>
                <strong>Target Pests:</strong> ${targets}<br>
                <strong>Precaution:</strong> ${safetyInfo}
            `;
        }
        
        const scannedLabelImg = document.getElementById('scanned-label-img');
        if (scannedLabelImg) {
            scannedLabelImg.src = appState.activePesticideUrl;
        }
        
        recalculateCompatibility();
    }, 2500);
}

function resetPesticideUpload() {
    const fileInfo = document.getElementById('pest-file-info');
    if (fileInfo) fileInfo.style.display = 'none';
    
    const result = document.getElementById('checker-analysis-result');
    if (result) result.classList.add('hidden');
    
    document.getElementById('pesticide-file-input').value = '';
    
    if (appState.activePesticideUrl) {
        URL.revokeObjectURL(appState.activePesticideUrl);
        appState.activePesticideUrl = null;
    }
    activePesticideFile = null;
    appState.detectedActiveIngredient = null;
}

// Simulated Pesticide OCR and Compatibility checker (Keep for backward compatibility)
function simulatePesticideUpload() {
    document.getElementById('pesticide-file-input').click();
}

function runSimulatedPesticideScan() {
    appState.detectedActiveIngredient = 'Chlorothalonil';
    appState.detectedBrand = 'Kavach Fungicide';
    appState.detectedIngredientFull = 'Chlorothalonil 75% WP';
    
    const titleEl = document.getElementById('extracted-product-title');
    if (titleEl) titleEl.textContent = 'Product Detected: Kavach Fungicide';
    
    const scannedLabelImg = document.getElementById('scanned-label-img');
    if (scannedLabelImg) {
        scannedLabelImg.src = "images/pesticide_label.png";
    }
    
    recalculateCompatibility();
}

function recalculateCompatibility() {
    const selectedCrop = document.getElementById('checker-crop-select').value;
    const badge = document.getElementById('compat-badge-status');
    const banner = document.getElementById('compat-banner');
    const verdictTitle = document.getElementById('compat-verdict-title');
    const verdictDesc = document.getElementById('compat-verdict-desc');
    const warningsList = document.getElementById('compat-warnings-list');
    
    const ingredient = appState.detectedActiveIngredient || 'Chlorothalonil';
    const lang = appState.currentLanguage;
    
    const compatibilityDB = {
        Chlorothalonil: {
            Rice: {
                status: 'green',
                badgeText: { english: 'Suitable', telugu: 'అనుకూలం', hindi: 'उपयुक्त', tamil: 'பொருத்தமானது', kannada: 'ಸೂಕ್ತವಾಗಿದೆ' },
                title: {
                    english: '🟢 Suitable for Rice Crop',
                    telugu: '🟢 వరి పంటకు ఉపయోగించవచ్చు',
                    hindi: '🟢 धान की फसल के लिए उपयुक्त',
                    tamil: '🟢 நெல் பயிருக்கு பொருத்தமானது',
                    kannada: '🟢 ಭತ್ತದ ಬೆಳೆಗೆ ಸೂಕ್ತವಾಗಿದೆ'
                },
                desc: {
                    english: 'Chlorothalonil is registered for control of leaf spot and blast diseases in Rice crops.',
                    telugu: 'వరి పంటలలో ఆకుమచ్చ మరియు అగ్గి తెగులు నివారణకు ఈ రసాయనం ఉపయోగించవచ్చు.',
                    hindi: 'धान की फसलों में ब्लास्ट और भूरे धब्बे रोग के नियंत्रण के लिए क्लोरोथैलोनिल पंजीकृत है।',
                    tamil: 'நெல் பயிர்களில் குலை மற்றும் இலைப்புள்ளி நோய்களைக் கட்டுப்படுத்த குளோரோதலோனில் பதிவு செய்யப்பட்டுள்ளது.',
                    kannada: 'ಭತ್ತದ ಬೆಲೆಗಳಲ್ಲಿ ಎಲೆ ಕಲೆ ಮತ್ತು ಬೆಂಕಿ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಕ್ಲೋರೋಥಲೋನಿಲ್ ಅನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.'
                },
                warnings: {
                    english: [
                        '<strong>Re-entry interval (REI):</strong> 24 hours. Keep workers out of treated areas.',
                        '<strong>Pre-harvest interval (PHI):</strong> 14 days before cutting.',
                        '<strong>Water hazard:</strong> Toxic to aquatic organisms. Do not discard residue in canals.'
                    ],
                    telugu: [
                        '<strong>పొలంలోకి వెళ్ళే సమయం (REI):</strong> పిచికారీ చేసిన 24 గంటల వరకు వెళ్ళవద్దు.',
                        '<strong>కోతకు ముందు వ్యవధి (PHI):</strong> పంట కోయడానికి 14 రోజుల ముందు ఆపాలి.',
                        '<strong>జలవనరులు:</strong> చేపలకు హానికరం. కాలువలలో డబ్బాలు కడగవద్దు.'
                    ],
                    hindi: [
                        '<strong>प्रवेश अंतराल (REI):</strong> छिड़काव के बाद 24 घंटे तक खेत में न जाएं।',
                        '<strong>कटाई पूर्व अंतराल (PHI):</strong> कटाई से 14 दिन पहले छिड़काव बंद करें।',
                        '<strong>जल संकट:</strong> जलीय जीवों के लिए विषैला। अवशेषों को नहरों में न फेंकें।'
                    ],
                    tamil: [
                        '<strong>மீண்டும் நுழையும் காலம் (REI):</strong> தெளித்த 24 மணி நேரத்திற்குள் வயலுக்குள் செல்ல வேண்டாம்.',
                        '<strong>அறுவடைக்கு முந்தைய காலம் (PHI):</strong> அறுவடைக்கு 14 நாட்களுக்கு முன்பு தெளிப்பதை நிறுத்தவும்.',
                        '<strong>நீர் அபாயம்:</strong> நீர்வாழ் உயிரினங்களுக்கு நச்சுத்தன்மை வாய்ந்தது. கால்வாய்களில் கழுவ வேண்டாம்.'
                    ],
                    kannada: [
                        '<strong>ಮರು ಪ್ರವೇಶದ ಅವಧಿ (REI):</strong> ಸಿಂಪಡಿಸಿದ 24 ಗಂಟೆಗಳವರೆಗೆ ಜಮೀನಿಗೆ ಪ್ರವೇಶಿಸಬೇಡಿ.',
                        '<strong>ಕೊಯ್ಲಿಗೆ ಮುಂಚಿನ ಅವಧಿ (PHI):</strong> ಕೊಯ್ಲಿಗೆ 14 ದಿನಗಳ ಮೊದಲು ನಿಲ್ಲಿಸಿ.',
                        '<strong>ಜಲ ಮಾಲಿನ್ಯ:</strong> ಜಲಚರಗಳಿಗೆ ಹಾನಿಕಾರಕ. ಕಾಲುವೆಗಳಲ್ಲಿ ಡಬ್ಬಿ ತೊಳೆಯಬೇಡಿ.'
                    ]
                }
            },
            Tomato: {
                status: 'green',
                badgeText: { english: 'Suitable', telugu: 'అనుకూలం', hindi: 'उपयुक्त', tamil: 'பொருத்தமானது', kannada: 'ಸೂಕ್ತವಾಗಿದೆ' },
                title: {
                    english: '🟢 Suitable for Tomato Crop',
                    telugu: '🟢 టమోటా పంటకు ఉపయోగించవచ్చు',
                    hindi: '🟢 टमाटर की फसल के लिए उपयुक्त',
                    tamil: '🟢 தக்காளி பயிருக்கு பொருத்தமானது',
                    kannada: '🟢 ಟೊಮೆಟೊ ಬೆಳೆಗೆ ಸೂಕ್ತವಾಗಿದೆ'
                },
                desc: {
                    english: 'Chlorothalonil (Kavach) is recommended for prevention of Early Blight on Tomato foliage.',
                    telugu: 'టమోటాలో ఆకు మచ్చ మరియు అంగమారి తెగులు రాకుండా కాపాడటానికి ఈ రసాయనం పనిచేస్తుంది.',
                    hindi: 'टमाटर की पत्तियों पर अगेती झुलसा रोग की रोकथाम के लिए क्लोरोथैलोनिल की सिफारिश की जाती है।',
                    tamil: 'தக்காளி இலைகளில் ஆரம்பகால கருகல் நோயைத் தடுக்க குளோரோதலோனில் பரிந்துரைக்கப்படுகிறது.',
                    kannada: 'ಟೊಮೆಟೊ ಗಿಡಗಳಲ್ಲಿ ಮುಂಗಾರು ಅಂಗಮಾರಿ ರೋಗ ತಡೆಗಟ್ಟಲು ಕ್ಲೋರೋಥಲೋನಿಲ್ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.'
                },
                warnings: {
                    english: [
                        '<strong>Re-entry interval (REI):</strong> 24 hours. Spray only in dry weather.',
                        '<strong>Pre-harvest interval (PHI):</strong> 7 days before plucking tomatoes.',
                        '<strong>Honeybees:</strong> Safe when applied outside active foraging hours.'
                    ],
                    telugu: [
                        '<strong>పొలంలోకి వెళ్ళే సమయం (REI):</strong> పిచికారీ చేసిన 24 గంటల వరకు వెళ్ళవద్దు.',
                        '<strong>కోతకు ముందు వ్యవధి (PHI):</strong> కాయలు కోయడానికి 7 రోజుల ముందు ఆపాలి.',
                        '<strong>తేనెటీగలు:</strong> సాయంత్రం వేళల్లో మాత్రమే పిచికారీ చేయడం సురక్షితం.'
                    ],
                    hindi: [
                        '<strong>प्रवेश अंतराल (REI):</strong> छिड़काव के बाद 24 घंटे तक प्रवेश न करें।',
                        '<strong>कटाई पूर्व अंतराल (PHI):</strong> टमाटर तोड़ने से 7 दिन पहले छिड़काव रोकें।',
                        '<strong>मधुमक्खियाँ:</strong> सक्रिय परागण के समय को छोड़कर छिड़काव करना सुरक्षित है।'
                    ],
                    tamil: [
                        '<strong>மீண்டும் நுழையும் காலம் (REI):</strong> தெளித்த 24 மணி நேரத்திற்குள் செல்ல வேண்டாம்.',
                        '<strong>அறுவடைக்கு முந்தைய காலம் (PHI):</strong> தக்காளி பறிப்பதற்கு 7 நாட்களுக்கு முன்பு தெளிப்பதை நிறுத்தவும்.',
                        '<strong>தேனீக்கள்:</strong> தேனீக்கள் நடமாட்டம் இல்லாத மாலை நேரங்களில் தெளிப்பது பாதுகாப்பானது.'
                    ],
                    kannada: [
                        '<strong>ಮರು ಪ್ರವೇಶದ ಅವಧಿ (REI):</strong> ಸಿಂಪಡಿಸಿದ 24 ಗಂಟೆಗಳವರೆಗೆ ಪ್ರವೇಶಿಸಬೇಡಿ.',
                        '<strong>ಕೊಯ್ಲಿಗೆ ಮುಂಚಿನ ಅವಧಿ (PHI):</strong> ಟೊಮೆಟೊ ಕೊಯ್ಯಲು 7 ದಿನಗಳ ಮೊದಲು ನಿಲ್ಲಿಸಿ.',
                        '<strong>ಜೇನುನೊಣಗಳು:</strong> ಸಂಜೆ ವೇಳೆ ಸಿಂಪಡಿಸುವುದು ಸೂಕ್ತ.'
                    ]
                }
            },
            Chilli: {
                status: 'yellow',
                badgeText: { english: 'Needs Review', telugu: 'సరిచూసుకోవాలి', hindi: 'समीक्षा आवश्यक', tamil: 'சரிபார்க்கவும்', kannada: 'ಪರಿಶೀಲಿಸಿ' },
                title: {
                    english: '🟡 Caution: Compatibility Needs Review',
                    telugu: '🟡 హెచ్చరిక: అనుకూలత సరిచూసుకోవాలి',
                    hindi: '🟡 चेतावनी: संगतता की समीक्षा आवश्यक',
                    tamil: '🟡 எச்சரிக்கை: பயிர் பொருத்தம் சரிபார்க்கப்பட வேண்டும்',
                    kannada: '🟡 ಎಚ್ಚರಿಕೆ: ಬೆಳೆ ಹೊಂದಾಣಿಕೆ ಪರಿಶೀಲಿಸಬೇಕು'
                },
                desc: {
                    english: 'No registered label clearance found for Chlorothalonil on Chilli. Applying may cause leaf spotting.',
                    telugu: 'మిరప తోటలలో ఈ రసాయనాన్ని వాడటానికి లేబుల్ అనుమతి లేదు. దీనివల్ల కొమ్మలు ఎండిపోయే అవకాశం ఉంది.',
                    hindi: 'मिर्च पर क्लोरोथैलोनिल के उपयोग की कोई लेबल मंजूरी नहीं है। पत्तियों पर धब्बे पड़ने का खतरा है।',
                    tamil: 'மிளகாயில் குளோரோதலோனில் பயன்படுத்துவதற்கான பதிவு இல்லை. இலைகளில் புள்ளிகள் அல்லது கருகல் ஏற்படலாம்.',
                    kannada: 'ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಯಲ್ಲಿ ಕ್ಲೋರೋಥಲೋನಿಲ್ ಬಳಸಲು ಸ್ಪಷ್ಟ ಶಿಫಾರಸು ಇಲ್ಲ. ಬಳಸಿದರೆ ಎಲೆ ಕಲೆ ಉಂಟಾಗಬಹುದು.'
                },
                warnings: {
                    english: [
                        'Consult your local extension officer before spraying.',
                        'Conduct a jar test on a small patch of Chilli crops first.'
                    ],
                    telugu: [
                        'మందు కొట్టే ముందు వ్యవసాయాధికారిని సంప్రదించండి.',
                        'ముందుగా కొన్ని మొక్కలపై మాత్రమే పిచికారీ చేసి పరీక్షించండి.'
                    ],
                    hindi: [
                        'छिड़काव करने से पहले अपने स्थानीय कृषि अधिकारी से सलाह लें।',
                        'पहले मिर्च की कुछ फसलों पर परीक्षण करें।'
                    ],
                    tamil: [
                        'தெளிப்பதற்கு முன் உள்ளூர் விவசாய அதிகாரியிடம் ஆலோசனை பெறவும்.',
                        'முதலில் ஒரு சிறிய பகுதியில் மட்டும் தெளித்து சோதிக்கவும்.'
                    ],
                    kannada: [
                        'ಸಿಂಪಡಿಸುವ ಮೊದಲು ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
                        'ಮೊದಲು ಕೆಲವು ಗಿಡಗಳ ಮೇಲೆ ಪರೀಕ್ಷಾರ್ಥ ಸಿಂಪರಣೆ ಮಾಡಿ.'
                    ]
                }
            }
        },
        Chlorpyriphos: {
            Rice: {
                status: 'green',
                badgeText: { english: 'Suitable', telugu: 'అనుకూలం', hindi: 'उपयुक्त', tamil: 'பொருத்தமானது', kannada: 'ಸೂಕ್ತವಾಗಿದೆ' },
                title: {
                    english: '🟢 Registered for Rice Stem Borer',
                    telugu: '🟢 వరి కాండం తొలిచే పురుగు నివారణకు సరిపోతుంది',
                    hindi: '🟢 धान के तना छेदक के लिए उपयुक्त',
                    tamil: '🟢 நெல் தண்டு துளைப்பானுக்கு பொருத்தமானது',
                    kannada: '🟢 ಭತ್ತದ ಕಾಂಡ ಕೊರಕ ರೋಗಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ'
                },
                desc: {
                    english: 'Chlorpyriphos 20% EC is highly effective against Rice Stem Borer, Gall Midge, and Leaf Folder.',
                    telugu: 'వరి కాండం తొలిచే పురుగు, ఆకు ముడుత మరియు ఈగ నివారణకు ఈ పురుగుమందు అత్యంత ప్రసిద్ధి.',
                    hindi: 'धान के तना छेदक और पत्ती लपेटक कीट के नियंत्रण के लिए क्लोरपायरीफॉस बहुत प्रभावी है।',
                    tamil: 'நெல் தண்டு துளைப்பான் மற்றும் இலை சுருட்டுப் புழுவுக்கு எதிராக குளோர்பைரிபாஸ் மிகவும் பயனுள்ளது.',
                    kannada: 'ಭತ್ತದ ಕಾಂಡ ಕೊರಕ ಮತ್ತು ಎಲೆ ಮಡಚುವ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ಕ್ಲೋರಪೈರಿಫಾಸ್ ಉತ್ತಮ ಮದ್ದಾಗಿದೆ.'
                },
                warnings: {
                    english: [
                        '<strong>Extremely toxic:</strong> Hazardous to honeybees. Do not spray during peak flowering.',
                        '<strong>Re-entry interval (REI):</strong> 48 hours due to high organophosphate inhalation risk.',
                        '<strong>PHI:</strong> Minimum 21 days between spraying and harvest.'
                    ],
                    telugu: [
                        '<strong>తీవ్ర విషప్రమాదం:</strong> తేనెటీగలకు అత్యంత హానికరం. పువ్వులు పూచే దశలో కొట్టవద్దు.',
                        '<strong>పొలంలోకి వెళ్ళే సమయం (REI):</strong> కనీసం 48 గంటల వరకు పొలంలోకి వెళ్ళవద్దు.',
                        '<strong>PHI:</strong> పంట కోయడానికి కనీసం 21 రోజుల ముందు వాడటం నిలిపివేయాలి.'
                    ],
                    hindi: [
                        '<strong>अत्यधिक विषैला:</strong> मधुमक्खियों के लिए बहुत खतरनाक। फूल आने के दौरान छिड़काव न करें।',
                        '<strong>प्रवेश अंतराल (REI):</strong> 48 घंटे, श्वास सम्बन्धी खतरों के कारण।',
                        '<strong>PHI:</strong> छिड़काव और कटाई के बीच कम से कम 21 दिन का अंतर रखें।'
                    ],
                    tamil: [
                        '<strong>அதி நச்சுத்தன்மை வாய்ந்தது:</strong> தேனீக்களுக்கு மிகவும் அபாயகரமானது. பூக்கும் காலத்தில் தெளிக்க வேண்டாம்.',
                        '<strong>மீண்டும் நுழையும் காலம் (REI):</strong> சுவாசப் பிரச்சனை ஏற்படும் என்பதால் 48 மணி நேரம் செல்ல வேண்டாம்.',
                        '<strong>PHI:</strong> தெளிப்பதற்கும் அறுவடைக்கும் இடையே குறைந்தது 21 நாட்கள் இடைவெளி தேவை.'
                    ],
                    kannada: [
                        '<strong>ಅತಿವಿಷಕಾರಿ:</strong> ಜೇನುನೊಣಗಳಿಗೆ ಮಾರಕ. ಹೂ ಬಿಡುವ ಹಂತದಲ್ಲಿ ಸಿಂಪಡಿಸಬೇಡಿ.',
                        '<strong>ಮರು ಪ್ರವೇಶದ ಅವಧಿ (REI):</strong> 48 ಗಂಟೆಗಳವರೆಗೆ ಹೊಲಕ್ಕೆ ಪ್ರವೇಶಿಸಬೇಡಿ.',
                        '<strong>PHI:</strong> ಕೊಯ್ಲಿಗೆ 21 ದಿನಗಳ ಮೊದಲು ನಿಲ್ಲಿಸಿ.'
                    ]
                }
            },
            Tomato: {
                status: 'red',
                badgeText: { english: 'Toxicity Risk', telugu: 'విషప్రమాదం', hindi: 'विषाक्तता का खतरा', tamil: 'நச்சுத்தன்மை அபாயம்', kannada: 'ವಿಷಕಾರಿ ಅಪಾಯ' },
                title: {
                    english: '🔴 Not Recommended: Tomato Toxicity Risk',
                    telugu: '🔴 వద్దు: టమోటా పంటకు నష్టం కలిగించవచ్చు',
                    hindi: '🔴 अनुपयुक्त: टमाटर की फसल खराब होने का खतरा',
                    tamil: '🔴 பரிந்துரைக்கப்படவில்லை: தக்காளி பயிர் நச்சு அபாயம்',
                    kannada: '🔴 ಶಿಫಾರಸು ಮಾಡಲಾಗಿಲ್ಲ: ಟೊಮೆಟೊ ಬೆಳೆಗೆ ಹಾನಿ ಅಪಾಯ'
                },
                desc: {
                    english: 'Chlorpyriphos application on Tomato is restricted. It can cause severe phytotoxic leaf burns and leaves high chemical residues.',
                    telugu: 'టమోటా పంటపై క్లోరిపైరిఫాస్ పిచికారీ చేయకూడదు. దీనివల్ల ఆకులు మాడిపోవడం మరియు పంట దెబ్బతినే ప్రమాదం ఉంది.',
                    hindi: 'टमाटर पर क्लोरपायरीफॉस का उपयोग प्रतिबंधित है। यह पत्तियों को जला सकता है और हानिकारक रासायनिक अवशेष छोड़ता है।',
                    tamil: 'தக்காளியில் குளோர்பைரிபாஸ் பயன்படுத்த தடை விதிக்கப்பட்டுள்ளது. இது இலைகளை கருகச் செய்து நச்சு எச்சங்களை உருவாக்கும்.',
                    kannada: 'ಟೊಮೆಟೊ ಗಿಡಗಳಿಗೆ ಕ್ಲೋರಪೈರಿಫಾಸ್ ಸಿಂಪಡಿಸಬಾರದು. ಇದು ಎಲೆಗಳನ್ನು ಸುಟ್ಟು ಇಳುವರಿ ನಾಶ ಮಾಡಬಹುದು.'
                },
                warnings: {
                    english: [
                        '<strong>DO NOT USE:</strong> Severe residue danger for direct human consumption crops.',
                        'Use safer biological alternatives (Neem oil, Bacillus thuringiensis).'
                    ],
                    telugu: [
                        '<strong>వాడకండి:</strong> మానవులు నేరుగా తినే పంట కావడంతో తీవ్ర రసాయన అవశేషాల ముప్పు ఉంటుంది.',
                        'సురక్షితమైన వేపనూనె లేదా ఇతర సేంద్రీయ పద్ధతులను వాడండి.'
                    ],
                    hindi: [
                        '<strong>उपयोग न करें:</strong> मानव उपभोग वाली फसलों पर गंभीर रासायनिक अवशेषों का खतरा।',
                        'नीम का तेल या जैविक नियंत्रण विधियों का उपयोग करें।'
                    ],
                    tamil: [
                        '<strong>பயன்படுத்த வேண்டாம்:</strong> தக்காளி போன்ற உணவாக உட்கொள்ளும் பயிர்களில் இரசாயன எச்சங்கள் தங்கும்.',
                        'வேப்ப எண்ணெய் அல்லது இயற்கை பூச்சிக்கொல்லிகளைப் பயன்படுத்தவும்.'
                    ],
                    kannada: [
                        '<strong>ಬಳಸಬೇಡಿ:</strong> ತರಕಾರಿ ಬೆಳೆಗಳ ಮೇಲೆ ವಿಷಕಾರಿ ರಾಸಾಯನಿಕ ಶೇಷಗಳು ಉಳಿಯುವ ಅಪಾಯವಿದೆ.',
                        'ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಸಾವಯವ ಕೀಟನಾಶಕ ಬಳಸಿ.'
                    ]
                }
            },
            Chilli: {
                status: 'red',
                badgeText: { english: 'Toxicity Risk', telugu: 'విషప్రమాదం', hindi: 'विषाक्तता का खतरा', tamil: 'நச்சுத்தன்மை அபாயம்', kannada: 'ವಿಷಕಾರಿ ಅಪಾಯ' },
                title: {
                    english: '🔴 Dangerous for Chilli Canopy',
                    telugu: '🔴 వద్దు: మిరప తోటలకు విషప్రమాదం',
                    hindi: '🔴 अनुपयुक्त: मिर्च की फसल के लिए विषैला',
                    tamil: '🔴 பரிந்துரைக்கப்படவில்லை: மிளகாய் பயிருக்கு நச்சு அபாயம்',
                    kannada: '🔴 ಶಿಫಾರಸು ಮಾಡಲಾಗಿಲ್ಲ: ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಗೆ ಅಪಾಯ'
                },
                desc: {
                    english: 'Extremely harsh organophosphate chemicals lead to immediate leaf dropping and blossom drop in Capsicum species.',
                    telugu: 'మిరపలో ఈ మందు కొట్టడం వల్ల పూత రాలిపోవడం మరియు ఆకులు రాలిపోయే తీవ్రమైన నష్టం కలుగుతుంది.',
                    hindi: 'मिर्च की फसलों में इसके छिड़काव से पत्तियाँ और फूल झड़ जाते हैं। उपज पर गंभीर असर पड़ता है।',
                    tamil: 'மிளகாயில் இதனை தெளிப்பதால் பூக்கள் மற்றும் இலைகள் கொட்டிவிடும் அபாயம் உள்ளது.',
                    kannada: 'ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಯಲ್ಲಿ ಈ ತೀಕ್ಷ್ಣ ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆಯಿಂದ ಹೂವು ಮತ್ತು ಎಲೆಗಳು ಉದುರಿಹೋಗುತ್ತವೆ.'
                },
                warnings: {
                    english: [
                        'Avoid broad-spectrum organophosphates on fruit-bearing spice trees.',
                        'Seek systemic alternatives like Fipronil or Imidacloprid.'
                    ],
                    telugu: [
                        'కాయ దశలో ఈ తీవ్రమైన పురుగుమందులు వాడకూడదు.',
                        'ఫిప్రోనిల్ లేదా ఇమిడాక్లోప్రిడ్ వంటి సురక్షితమైన ప్రత్యామ్నాయాలు వాడండి.'
                    ],
                    hindi: [
                        'फल आने की अवस्था में तीखे कीटनाशकों से बचें।',
                        'फिप्रोनिल या इमिडाक्लोप्रिड जैसे सुरक्षित विकल्पों का चयन करें।'
                    ],
                    tamil: [
                        'காய்க்கும் பருவத்தில் கடுமையான பூச்சிக்கொல்லிகளைத் தவிர்க்கவும்.',
                        'பிப்ரோனில் அல்லது இமிடா குளோபிரிட் போன்ற மாற்று மருந்துகளைத் தேர்ந்தெடுக்கவும்.'
                    ],
                    kannada: [
                        'ಕಾಯಿ ಬಿಡುವ ಹಂತದಲ್ಲಿ ತೀವ್ರ ಕೀಟನಾಶಕ ಬೇಡ.',
                        'ಫಿಪ್ರೋನಿಲ್ ಅಥವಾ ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ ನಂತಹ ಸುರಕ್ಷಿತ ಪರ್ಯಾಯಗಳನ್ನು ಬಳಸಿ.'
                    ]
                }
            }
        }
    };
    
    const cropData = compatibilityDB[ingredient] || compatibilityDB.Chlorothalonil;
    const data = cropData[selectedCrop] || cropData.Chilli;
    
    // Update Badge styling and text
    if (data.status === 'green') {
        badge.className = "badge status-green";
        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.badgeText[lang] || data.badgeText.english}`;
        banner.className = "alert-banner-box compat-bg-green";
    } else if (data.status === 'yellow') {
        badge.className = "badge status-yellow";
        badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${data.badgeText[lang] || data.badgeText.english}`;
        banner.className = "alert-banner-box compat-bg-yellow";
    } else {
        badge.className = "badge status-danger";
        badge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${data.badgeText[lang] || data.badgeText.english}`;
        banner.className = "alert-banner-box compat-bg-red";
    }
    
    if (verdictTitle) verdictTitle.textContent = data.title[lang] || data.title.english;
    if (verdictDesc) verdictDesc.textContent = data.desc[lang] || data.desc.english;
    
    if (warningsList) {
        warningsList.innerHTML = '';
        const list = data.warnings[lang] || data.warnings.english;
        list.forEach(w => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${w}`;
            warningsList.appendChild(li);
        });
    }
}

function playLabelAudio() {
    let text = "";
    const selectedCrop = document.getElementById('checker-crop-select').value;
    const ingredient = appState.detectedActiveIngredient || 'Chlorothalonil';
    const brand = appState.detectedBrand || 'Kavach Fungicide';
    
    if (appState.currentLanguage === 'telugu') {
        if (ingredient === 'Chlorothalonil') {
            text = `ఉత్పత్తి పేరు ${brand}. క్రియాశీల రసాయనం క్లోరోథలోనిల్. ఇది ${selectedCrop === 'Rice' ? 'వరి' : selectedCrop === 'Tomato' ? 'టమోటా' : 'మిరప'} పంటకు ${selectedCrop === 'Chilli' ? 'సిఫారసు చేయబడలేదు' : 'అనుకూలం'}.`;
        } else {
            text = `ఉత్పత్తి పేరు ${brand}. క్రియాశీల రసాయనం క్లోరిపైరిఫాస్. ఇది ${selectedCrop === 'Rice' ? 'వరి పంటకు అనుకూలం' : 'టమోటా మరియు మిరపకు విషప్రమాదం'}.`;
        }
        speakSpeech(text, "telugu");
    } else {
        if (ingredient === 'Chlorothalonil') {
            text = `Product detected is ${brand} containing Chlorothalonil. For ${selectedCrop}, it is ${selectedCrop === 'Chilli' ? 'not recommended without review' : 'suitable'}.`;
        } else {
            text = `Product detected is ${brand} containing Chlorpyriphos. For ${selectedCrop}, it is ${selectedCrop === 'Rice' ? 'suitable' : 'dangerous and not recommended'}.`;
        }
        speakSpeech(text, "english");
    }
}

function askAiAboutProduct() {
    const productName = "Kavach Fungicide (Chlorothalonil)";
    activatePane('ai-chat-pane');
    simulateUserChatQuery(`Can you tell me more about usage dosage for ${productName} on my Rice crop?`);
}

// Soil & Water Radial moisture gauge update helper
function updateSoilMoisture(newMoistureVal) {
    const valText = document.getElementById('soil-moisture-val-radial');
    const compactText = document.getElementById('dash-moisture-gauge-val');
    const pathCircle = document.getElementById('soil-moisture-gauge-radial');
    
    valText.textContent = `${newMoistureVal}%`;
    compactText.textContent = `${newMoistureVal}%`;
    
    const percentageOffset = newMoistureVal;
    pathCircle.setAttribute('stroke-dasharray', `${percentageOffset}, 100`);
}

// Market Price Trend Charts updates
function updateMarketChart() {
    const crop = document.getElementById('mkt-crop-select').value;
    const mkt = document.getElementById('mkt-market-select').value;
    
    const chartPath = document.getElementById('chart-line-path');
    const chartSub = document.getElementById('chart-sub-title');
    const priceDisp = document.getElementById('chart-price-display');
    const aiText = document.getElementById('mkt-ai-text');
    
    let pathData = "";
    let priceText = "";
    let aiInsight = "";
    
    if (crop === 'Rice') {
        chartSub.textContent = `Rice Grain Price Trend (Last 7 Days) - ${mkt}`;
        pathData = "M 40,140 L 113,135 L 186,130 L 260,110 L 333,90 L 406,70 L 480,50";
        priceText = "₹2,250 <span class='trend-indicator up'><i class='fa-solid fa-caret-up'></i> +₹50</span>";
        
        if (appState.currentLanguage === 'telugu') {
            aiInsight = `"వరి గింజల ధరలు గడచిన వారం రోజులుగా 2.2% స్థిరంగా పెరుగుతున్నాయి. గింజలలో తేమ శాతాన్ని తగ్గించుకోవడానికి ఎండబెట్టిన తర్వాత అమ్ముకుంటే సూర్యాపేట మార్కెట్లో గరిష్ట మద్దతు ధర లభిస్తుంది."`;
        } else {
            aiInsight = `"Rice prices show a 2.2% upward trend in local mandis due to controlled crop arrivals. Farmers are advised to dry grain thoroughly before selling to achieve Grade-A premium pricing."`;
        }
    } else if (crop === 'Tomato') {
        chartSub.textContent = `Tomato Price Trend (Last 7 Days) - ${mkt}`;
        pathData = "M 40,60 L 113,80 L 186,120 L 260,150 L 333,160 L 406,140 L 480,130";
        priceText = "₹1,400 <span class='trend-indicator down'><i class='fa-solid fa-caret-down'></i> -₹120</span>";
        
        if (appState.currentLanguage === 'telugu') {
            aiInsight = `"టమోటా ధరలలో ఆకస్మిక క్షీణత నమోదైంది. సరఫరా పెరగడం దీనికి కారణం. సమీప వారంగల్ మార్కెట్లో ధరలను పోల్చుకుని పండ్లను కోయండి."`;
        } else {
            aiInsight = `"Tomato prices have declined by 8% due to high volume arrivals. Monitor Warangal Mandi as it shows slightly higher prices before harvesting your blocks."`;
        }
    } else {
        // Chilli
        chartSub.textContent = `Chilli Price Trend (Last 7 Days) - ${mkt}`;
        pathData = "M 40,150 L 113,130 L 186,110 L 260,90 L 333,70 L 406,60 L 480,45";
        priceText = "₹18,500 <span class='trend-indicator up'><i class='fa-solid fa-caret-up'></i> +₹400</span>";
        
        if (appState.currentLanguage === 'telugu') {
            aiInsight = `"మిరపకాయలకు విపరీతమైన గిరాకీ ఉంది. ధరలు క్వింటాలుకు ₹18,500 వరకు పెరిగాయి. రాబోయే వారాల్లో ధరలు మరింత పెరిగే అవకాశం ఉంది."`;
        } else {
            aiInsight = `"Dried Chilli demand remains robust, yielding ₹18,500/Quintal. Selling dry stocks gradually will maximize revenues over the next fortnight."`;
        }
    }
    
    chartPath.setAttribute('d', pathData);
    priceDisp.innerHTML = priceText;
    aiText.textContent = aiInsight;
}

// Voice languages mapper
const voiceLanguages = {
    english: 'en-IN',
    telugu: 'te-IN',
    hindi: 'hi-IN',
    tamil: 'ta-IN',
    kannada: 'kn-IN'
};

// Initialize Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition API not supported in this browser.");
        return null;
    }
    
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    
    rec.onstart = () => {
        appState.isSpeechRecognitionActive = true;
        updateVoiceOverlayUI('start');
    };
    
    rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        const text = finalTranscript || interimTranscript;
        const speechBox = document.getElementById('detected-speech');
        if (speechBox) {
            speechBox.textContent = `"${text}"`;
        }
        appState.lastTranscribedText = text;
    };
    
    rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        const statusBox = document.getElementById('voice-status');
        if (statusBox) {
            if (event.error === 'not-allowed') {
                statusBox.textContent = "Mic Permission Denied / అనుమతి నిరాకరించబడింది";
            } else if (event.error === 'no-speech') {
                statusBox.textContent = "No speech detected / శబ్దం వినబడలేదు";
            } else {
                statusBox.textContent = `Error: ${event.error}`;
            }
        }
        stopVoiceRecognition();
    };
    
    rec.onend = () => {
        appState.isSpeechRecognitionActive = false;
        
        if (appState.lastTranscribedText) {
            const chatInput = document.getElementById('chat-text-input');
            const communityInput = document.getElementById('comm-post-textarea');
            const feedbackInput = document.getElementById('feedback-textbox');
            
            // Check active pane and insert transcribed text
            if (appState.currentPane === 'ai-chat-pane' && chatInput) {
                chatInput.value = appState.lastTranscribedText;
            } else if (appState.currentPane === 'community-pane' && communityInput) {
                communityInput.value = appState.lastTranscribedText;
            } else if (appState.currentPane === 'profile-pane' && feedbackInput) {
                feedbackInput.value = appState.lastTranscribedText;
            }
        }
        updateVoiceOverlayUI('end');
    };
    
    return rec;
}

// Voice Assistant UI toggles
function toggleVoiceOverlay() {
    const voiceOverlay = document.getElementById('voice-overlay');
    if (!voiceOverlay) return;
    
    if (voiceOverlay.classList.contains('hidden')) {
        voiceOverlay.classList.remove('hidden');
        startVoiceRecognition();
    } else {
        voiceOverlay.classList.add('hidden');
        stopVoiceRecognition();
    }
}

function startVoiceRecognition() {
    appState.lastTranscribedText = '';
    
    const speechBox = document.getElementById('detected-speech');
    if (speechBox) speechBox.textContent = '"..."';
    
    const statusBox = document.getElementById('voice-status');
    const langNames = {
        english: 'English',
        telugu: 'తెలుగు',
        hindi: 'हिन्दी',
        tamil: 'தமிழ்',
        kannada: 'ಕನ್ನಡ'
    };
    const activeLangName = langNames[appState.currentLanguage] || 'English';
    
    if (statusBox) {
        statusBox.textContent = `Listening (${activeLangName}) / వింటున్నాను...`;
    }
    
    updateVoiceHelpText();
    
    if (!appState.recognition) {
        appState.recognition = initSpeechRecognition();
    }
    
    if (appState.recognition) {
        appState.recognition.lang = voiceLanguages[appState.currentLanguage] || 'en-IN';
        try {
            appState.recognition.start();
        } catch (e) {
            console.error("Speech recognition start failed:", e);
        }
    } else {
        if (statusBox) {
            statusBox.textContent = "Speech recognition unsupported / మద్దతు లేదు";
        }
        const speechHelp = document.getElementById('voice-help-text');
        if (speechHelp) {
            speechHelp.innerHTML = `<span class='text-orange'><i class="fa-solid fa-triangle-exclamation"></i> Speech API is not supported in this browser. Please type manually.</span>`;
        }
    }
}

function stopVoiceRecognition() {
    if (appState.recognition) {
        try {
            appState.recognition.stop();
        } catch (e) {
            // Already stopped
        }
    }
}

function updateVoiceOverlayUI(state) {
    const micCircle = document.querySelector('.microphone-circle');
    const rings = document.querySelectorAll('.pulse-ring');
    if (state === 'start') {
        if (micCircle) micCircle.classList.add('recording');
        rings.forEach(r => r.style.animationPlayState = 'running');
    } else {
        if (micCircle) micCircle.classList.remove('recording');
        rings.forEach(r => r.style.animationPlayState = 'paused');
    }
}

function updateVoiceHelpText() {
    const speechHelp = document.getElementById('voice-help-text');
    if (!speechHelp) return;
    
    const helps = {
        english: 'Ask a question like: "Is it safe to spray today?" or "Will it rain tomorrow?"',
        telugu: 'ఇలా అడగండి: "రేపు మందు కొట్టొచ్చా?" లేదా "నా వరి పంటకు ఏమైంది?"',
        hindi: 'ऐसे प्रश्न पूछें: "क्या आज छिड़काव करना सुरक्षित है?" या "कल मौसम कैसा रहेगा?"',
        tamil: 'இப்படி கேளுங்கள்: "இன்று தெளிப்பது பாதுகாப்பானதா?" அல்லது "நாளை மழை பெய்யுமா?"',
        kannada: 'ಹೀಗೆ ಕೇಳಿ: "ಇಂದು ಔಷಧಿ ಸಿಂಪಡಿಸುವುದು ಸುರಕ್ಷಿತವೇ?" ಅಥವಾ "ನಾಳೆ ಮಳೆಯಾಗುತ್ತದೆಯೆ?"'
    };
    speechHelp.textContent = helps[appState.currentLanguage] || helps.english;
}

function startFreeVoiceDemo() {
    navigateTo('login-view');
    setLanguage(appState.currentLanguage);
    playVoiceHelp('login');
}

// Database-backed storage adapter with Supabase support and IndexedDB/localStorage fallback
const ChatDatabase = {
    supabase: null,
    
    init() {
        const url = window.ENV?.SUPABASE_URL || localStorage.getItem('supabase_url') || '';
        const anonKey = window.ENV?.SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || '';
        
        if (url && anonKey && typeof supabase !== 'undefined') {
            try {
                this.supabase = supabase.createClient(url, anonKey);
                console.log('Supabase client initialized successfully.');
            } catch (e) {
                console.error('Failed to initialize Supabase client:', e);
            }
        }
        
        if (!localStorage.getItem('agrisaarthi_conversations')) {
            localStorage.setItem('agrisaarthi_conversations', JSON.stringify([]));
        }
        if (!localStorage.getItem('agrisaarthi_messages')) {
            localStorage.setItem('agrisaarthi_messages', JSON.stringify([]));
        }
    },
    
    getUserId() {
        if (currentSessionUser) {
            return currentSessionUser.id;
        }
        
        let localUserId = localStorage.getItem('agrisaarthi_user_id');
        if (!localUserId) {
            localUserId = 'u_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('agrisaarthi_user_id', localUserId);
        }
        return localUserId;
    },
    
    async getConversations() {
        const userId = this.getUserId();
        
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('conversations')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });
            if (!error) return data;
            console.error('Supabase getConversations error, falling back:', error);
        }
        
        const convs = JSON.parse(localStorage.getItem('agrisaarthi_conversations') || '[]');
        return convs
            .filter(c => c.user_id === userId)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    },
    
    async createConversation(title, language, cropContext = '') {
        const userId = this.getUserId();
        const newConv = {
            id: 'c_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
            user_id: userId,
            title: title,
            language: language,
            crop_context: cropContext,
            archived: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('conversations')
                .insert([newConv])
                .select();
            if (!error && data && data[0]) return data[0];
            console.error('Supabase createConversation error, falling back:', error);
        }
        
        const convs = JSON.parse(localStorage.getItem('agrisaarthi_conversations') || '[]');
        convs.push(newConv);
        localStorage.setItem('agrisaarthi_conversations', JSON.stringify(convs));
        return newConv;
    },
    
    async updateConversationTitle(id, title) {
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('conversations')
                .update({ title: title, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select();
            if (!error && data && data[0]) return data[0];
            console.error('Supabase updateConversationTitle error, falling back:', error);
        }
        
        const convs = JSON.parse(localStorage.getItem('agrisaarthi_conversations') || '[]');
        const c = convs.find(item => item.id === id);
        if (c) {
            c.title = title;
            c.updated_at = new Date().toISOString();
            localStorage.setItem('agrisaarthi_conversations', JSON.stringify(convs));
            return c;
        }
        return null;
    },
    
    async deleteConversation(id) {
        if (this.supabase) {
            const { error } = await this.supabase
                .from('conversations')
                .delete()
                .eq('id', id);
            if (!error) return true;
            console.error('Supabase deleteConversation error, falling back:', error);
        }
        
        let convs = JSON.parse(localStorage.getItem('agrisaarthi_conversations') || '[]');
        convs = convs.filter(c => c.id !== id);
        localStorage.setItem('agrisaarthi_conversations', JSON.stringify(convs));
        
        let msgs = JSON.parse(localStorage.getItem('agrisaarthi_messages') || '[]');
        msgs = msgs.filter(m => m.conversation_id !== id);
        localStorage.setItem('agrisaarthi_messages', JSON.stringify(msgs));
        return true;
    },
    
    async getMessages(conversationId) {
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });
            if (!error) return data;
            console.error('Supabase getMessages error, falling back:', error);
        }
        
        const msgs = JSON.parse(localStorage.getItem('agrisaarthi_messages') || '[]');
        return msgs
            .filter(m => m.conversation_id === conversationId)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },
    
    async createMessage(conversationId, role, content, attachmentUrl = null, attachmentType = null, metadata = null) {
        const userId = this.getUserId();
        const newMsg = {
            id: 'm_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
            conversation_id: conversationId,
            user_id: userId,
            role: role,
            content: content,
            attachment_url: attachmentUrl,
            attachment_type: attachmentType,
            metadata: metadata,
            created_at: new Date().toISOString()
        };
        
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('messages')
                .insert([newMsg])
                .select();
            
            await this.supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', conversationId);
                
            if (!error && data && data[0]) return data[0];
            console.error('Supabase createMessage error, falling back:', error);
        }
        
        const msgs = JSON.parse(localStorage.getItem('agrisaarthi_messages') || '[]');
        msgs.push(newMsg);
        localStorage.setItem('agrisaarthi_messages', JSON.stringify(msgs));
        
        const convs = JSON.parse(localStorage.getItem('agrisaarthi_conversations') || '[]');
        const c = convs.find(item => item.id === conversationId);
        if (c) {
            c.updated_at = new Date().toISOString();
            localStorage.setItem('agrisaarthi_conversations', JSON.stringify(convs));
        }
        
        return newMsg;
    }
};

appState.currentConversationId = null;
appState.conversations = [];
appState.searchQuery = "";

async function initChatHistory() {
    ChatDatabase.init();
    await refreshConversationsList();
    
    if (appState.conversations.length > 0) {
        await loadConversation(appState.conversations[0].id);
    } else {
        await startNewConversation();
    }
}

async function startNewConversation() {
    appState.currentConversationId = null;
    document.getElementById('current-chat-title').textContent = appState.currentLanguage === 'telugu' ? 'కొత్త చాట్' : 'New Chat';
    
    const container = document.getElementById('chat-messages-container');
    if (container) {
        container.innerHTML = `
            <div class="chat-msg system">
                <div class="message-content">
                    <p>Namaste! I am AgriSaarthi AI, your farming companion. Ask me any question using text or voice, or upload crop pictures.</p>
                    <p>నమస్తే! నేను అగ్రిసారథి AI. నన్ను తెలుగులో కూడా అడగవచ్చు.</p>
                </div>
            </div>
        `;
    }
    
    removeChatAttachment();
    updateSidebarSelection(null);
}

async function loadConversation(id) {
    appState.currentConversationId = id;
    
    const c = appState.conversations.find(item => item.id === id);
    if (!c) return;
    
    if (c.language) {
        setLanguage(c.language);
    }
    if (c.crop_context) {
        appState.farmerProfile.crop = c.crop_context;
        const cropNameEl = document.getElementById('dash-crop-name');
        if (cropNameEl) cropNameEl.textContent = c.crop_context;
    }
    
    updateSidebarSelection(id);
    document.getElementById('current-chat-title').textContent = c.title;
    
    const messages = await ChatDatabase.getMessages(id);
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    
    container.innerHTML = "";
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="chat-msg system">
                <div class="message-content">
                    <p>Namaste! I am AgriSaarthi AI, your farming companion. Ask me any question using text or voice, or upload crop pictures.</p>
                    <p>నమస్తే! నేను అగ్రిసారథి AI. నన్ను తెలుగులో కూడా అడగవచ్చు.</p>
                </div>
            </div>
        `;
    } else {
        messages.forEach(m => {
            if (m.role === 'user') {
                appendChatUserMessageWithAttachment(m.content, m.attachment_url, m.attachment_type);
            } else if (m.role === 'assistant') {
                appendChatMessage('ai', m.content);
            } else {
                appendChatMessage('system', m.content);
            }
        });
    }
    
    container.scrollTop = container.scrollHeight;
}

function groupConversationsByDate(convs) {
    const groups = {
        today: [],
        yesterday: [],
        last7days: [],
        last30days: [],
        older: []
    };
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7);
    const startOf30DaysAgo = new Date(startOfToday);
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30);
    
    convs.forEach(c => {
        const date = new Date(c.updated_at);
        if (date >= startOfToday) {
            groups.today.push(c);
        } else if (date >= startOfYesterday) {
            groups.yesterday.push(c);
        } else if (date >= startOf7DaysAgo) {
            groups.last7days.push(c);
        } else if (date >= startOf30DaysAgo) {
            groups.last30days.push(c);
        } else {
            groups.older.push(c);
        }
    });
    
    return groups;
}

async function refreshConversationsList() {
    const listContainer = document.getElementById('conversations-history-list');
    if (!listContainer) return;
    
    let convs = await ChatDatabase.getConversations();
    appState.conversations = convs;
    
    if (appState.searchQuery) {
        const query = appState.searchQuery.toLowerCase();
        convs = convs.filter(c => {
            const matchesTitle = c.title.toLowerCase().includes(query);
            const matchesCrop = c.crop_context && c.crop_context.toLowerCase().includes(query);
            return matchesTitle || matchesCrop;
        });
    }
    
    listContainer.innerHTML = "";
    
    const groups = groupConversationsByDate(convs);
    const groupKeys = [
        { key: 'today', title: appState.currentLanguage === 'telugu' ? 'నేడు' : 'Today' },
        { key: 'yesterday', title: appState.currentLanguage === 'telugu' ? 'నిన్న' : 'Yesterday' },
        { key: 'last7days', title: appState.currentLanguage === 'telugu' ? 'గత 7 రోజులు' : 'Previous 7 days' },
        { key: 'last30days', title: appState.currentLanguage === 'telugu' ? 'గత 30 రోజులు' : 'Previous 30 days' },
        { key: 'older', title: appState.currentLanguage === 'telugu' ? 'మునుపటివి' : 'Older' }
    ];
    
    let hasAnyConversations = false;
    
    groupKeys.forEach(g => {
        const list = groups[g.key];
        if (list && list.length > 0) {
            hasAnyConversations = true;
            
            const header = document.createElement('div');
            header.className = "history-group-title";
            header.textContent = g.title;
            listContainer.appendChild(header);
            
            const groupDiv = document.createElement('div');
            groupDiv.className = "history-group";
            
            list.forEach(c => {
                const item = document.createElement('div');
                item.className = "history-item";
                if (c.id === appState.currentConversationId) {
                    item.classList.add('active');
                }
                item.setAttribute('onclick', `loadConversation('${c.id}')`);
                
                let emoji = "💬";
                if (c.crop_context === 'Rice') emoji = "🌾";
                else if (c.crop_context === 'Tomato') emoji = "🍅";
                else if (c.crop_context === 'Chilli') emoji = "🌶️";
                
                item.innerHTML = `
                    <div class="history-item-left" onclick="event.stopPropagation(); loadConversation('${c.id}')">
                        <span class="history-item-icon">${emoji}</span>
                        <span class="history-item-title" id="history-title-${c.id}">${c.title}</span>
                    </div>
                    <div class="history-item-actions">
                        <button class="history-action-btn edit" onclick="event.stopPropagation(); triggerRenameConversation('${c.id}')" title="Rename"><i class="fa-solid fa-pen"></i></button>
                        <button class="history-action-btn delete" onclick="event.stopPropagation(); triggerDeleteConversation('${c.id}')" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                `;
                groupDiv.appendChild(item);
            });
            
            listContainer.appendChild(groupDiv);
        }
    });
    
    if (!hasAnyConversations) {
        const noConvs = document.createElement('div');
        noConvs.style.padding = "20px 10px";
        noConvs.style.textAlign = "center";
        noConvs.style.color = "var(--text-muted)";
        noConvs.style.fontSize = "0.85rem";
        noConvs.textContent = appState.currentLanguage === 'telugu' ? 'సంభాషణలు లేవు' : 'No conversations found';
        listContainer.appendChild(noConvs);
    }
}

function updateSidebarSelection(id) {
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
    });
    if (id) {
        document.querySelectorAll('.history-item').forEach(item => {
            const attr = item.getAttribute('onclick') || '';
            if (attr.includes(id)) {
                item.classList.add('active');
            }
        });
    }
}

function handleSearchConversations(query) {
    appState.searchQuery = query;
    refreshConversationsList();
}

function generateAutomaticTitle(text) {
    if (!text) return "New Conversation";
    
    const words = text.replace(/[^\w\s\u0c00-\u0c7f]/gi, '').trim().split(/\s+/);
    const lowerText = text.toLowerCase();
    
    let crop = "";
    if (lowerText.includes("rice") || lowerText.includes("వరి")) crop = "Rice ";
    else if (lowerText.includes("tomato") || lowerText.includes("టమోటా")) crop = "Tomato ";
    else if (lowerText.includes("chilli") || lowerText.includes("మిరప")) crop = "Chilli ";
    
    if (lowerText.includes("yellow") || lowerText.includes("పసుపు")) {
        return crop ? `${crop}Leaf Yellowing` : "Leaf Yellowing";
    }
    if (lowerText.includes("irrigate") || lowerText.includes("నీరు") || lowerText.includes("నీటి")) {
        return crop ? `${crop}Irrigation Timing` : "Farm Irrigation";
    }
    if (lowerText.includes("weather") || lowerText.includes("వాతావరణం")) {
        return "Farm Weather";
    }
    if (lowerText.includes("pest") || lowerText.includes("పురుగు")) {
        return crop ? `${crop}Pest Control` : "Pest Control";
    }
    if (lowerText.includes("fertilizer") || lowerText.includes("మందు")) {
        return crop ? `${crop}Fertilizer Advice` : "Fertilizer Advice";
    }
    
    const titleWords = words.slice(0, 4).join(" ");
    return titleWords.length > 25 ? titleWords.substr(0, 22) + "..." : titleWords || "New Chat";
}

// Supervised AI: call /api/chat with full conversation history + farmer profile
async function processAiChatContextResponse(userText, convId, imageBase64, imageMimeType) {
    // Build message history for the API (last 10 messages for context)
    const allMessages = await ChatDatabase.getMessages(convId);
    const historyMessages = allMessages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
    }));
    
    // Ensure current user message is included
    const hasCurrentMsg = historyMessages.length > 0 && historyMessages[historyMessages.length - 1].content === userText;
    if (!hasCurrentMsg && userText) {
        historyMessages.push({ role: 'user', content: userText });
    }
    
    // Build farmer profile context from active state
    const profile = currentProfileData || appState.farmerProfile || {};
    
    const payload = {
        messages: historyMessages,
        language: appState.currentLanguage || 'english',
        profile: {
            name: profile.name || appState.farmerProfile.name || 'Farmer',
            crop: profile.crop || appState.farmerProfile.crop || '',
            variety: profile.variety || appState.farmerProfile.variety || '',
            stage: profile.stage || appState.farmerProfile.stage || '',
            soil: profile.soil || appState.farmerProfile.soil || '',
            irrigation: profile.irrigation || appState.farmerProfile.irrigation || '',
            district: profile.district || appState.farmerProfile.district || '',
            state: profile.state || appState.farmerProfile.state || '',
            size: profile.size || appState.farmerProfile.size || ''
        }
    };
    
    // Attach image data if available
    if (imageBase64) {
        payload.imageBase64 = imageBase64;
        payload.imageMimeType = imageMimeType || 'image/jpeg';
    }
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `API error ${response.status}`);
        }
        
        const data = await response.json();
        return data.text || 'I was unable to generate a response. Please try again.';
        
    } catch (e) {
        console.error('[AgriSaarthi AI] Chat API error:', e);
        // Graceful fallback message
        const fallback = appState.currentLanguage === 'telugu'
            ? 'క్షమించండి, ప్రస్తుతం AI సేవ అందుబాటులో లేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : appState.currentLanguage === 'hindi'
            ? 'क्षमा करें, AI सेवा अभी उपलब्ध नहीं है। कृपया पुनः प्रयास करें।'
            : 'I am unable to reach the AI service right now. Please check your connection and try again.';
        return fallback;
    }
}

function showCustomPrompt(titleText, placeholderText, initialValue, onConfirm) {
    const existing = document.getElementById('premium-custom-modal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'premium-custom-modal';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';
    overlay.style.animation = 'fadeIn 0.2s ease-out';
    
    const card = document.createElement('div');
    card.style.background = 'var(--bg-card)';
    card.style.borderRadius = 'var(--radius-lg)';
    card.style.padding = '25px';
    card.style.width = '90%';
    card.style.maxWidth = '400px';
    card.style.boxShadow = 'var(--shadow-lg)';
    card.style.border = '1px solid var(--border-color)';
    card.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    
    card.innerHTML = `
        <h4 style="margin-bottom: 12px; color: var(--primary-dark); font-weight: 700;">${titleText}</h4>
        <input type="text" id="custom-prompt-input" value="${initialValue}" placeholder="${placeholderText}" style="width:100%; padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-earth); color:var(--text-main); font-size:0.9rem; outline:none; margin-bottom: 18px;">
        <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn secondary sm" id="custom-prompt-cancel">Cancel</button>
            <button class="btn primary sm" id="custom-prompt-submit">Submit</button>
        </div>
    `;
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    const input = document.getElementById('custom-prompt-input');
    input.focus();
    input.select();
    
    document.getElementById('custom-prompt-cancel').onclick = () => overlay.remove();
    document.getElementById('custom-prompt-submit').onclick = () => {
        const val = input.value.trim();
        if (val) {
            onConfirm(val);
            overlay.remove();
        }
    };
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (val) {
                onConfirm(val);
                overlay.remove();
            }
        } else if (e.key === 'Escape') {
            overlay.remove();
        }
    };
}

function showCustomConfirm(titleText, messageText, onConfirm) {
    const existing = document.getElementById('premium-custom-modal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'premium-custom-modal';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '99999';
    
    const card = document.createElement('div');
    card.style.background = 'var(--bg-card)';
    card.style.borderRadius = 'var(--radius-lg)';
    card.style.padding = '25px';
    card.style.width = '90%';
    card.style.maxWidth = '400px';
    card.style.boxShadow = 'var(--shadow-lg)';
    card.style.border = '1px solid var(--border-color)';
    
    card.innerHTML = `
        <h4 style="margin-bottom: 12px; color: var(--primary-dark); font-weight: 700;">${titleText}</h4>
        <p style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">${messageText}</p>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button class="btn secondary sm" id="custom-confirm-cancel">Cancel</button>
            <button class="btn primary sm" id="custom-confirm-submit" style="background-color: var(--accent-red); border-color: var(--accent-red); color: white;">Delete</button>
        </div>
    `;
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    document.getElementById('custom-confirm-cancel').onclick = () => overlay.remove();
    document.getElementById('custom-confirm-submit').onclick = () => {
        onConfirm();
        overlay.remove();
    };
}

function triggerRenameConversation(id) {
    const c = appState.conversations.find(item => item.id === id);
    if (!c) return;
    
    showCustomPrompt(
        appState.currentLanguage === 'telugu' ? 'సంభాషణ పేరు మార్చండి' : 'Rename Conversation',
        appState.currentLanguage === 'telugu' ? 'కొత్త పేరు నమోదు చేయండి' : 'Enter new conversation name',
        c.title,
        async (newTitle) => {
            await ChatDatabase.updateConversationTitle(id, newTitle);
            if (id === appState.currentConversationId) {
                document.getElementById('current-chat-title').textContent = newTitle;
            }
            await refreshConversationsList();
            showToast(appState.currentLanguage === 'telugu' ? "పేరు విజయవంతంగా మార్చబడింది" : "Conversation renamed successfully!", "success");
        }
    );
}

function triggerRenameCurrentChat() {
    if (!appState.currentConversationId) {
        showToast(appState.currentLanguage === 'telugu' ? "మార్చడానికి సంభాషణ ఏదీ లేదు" : "No active conversation to rename.", "warning");
        return;
    }
    triggerRenameConversation(appState.currentConversationId);
}

function triggerDeleteConversation(id) {
    showCustomConfirm(
        appState.currentLanguage === 'telugu' ? 'ఈ సంభాషణను తొలగించాలా?' : 'Delete this conversation?',
        appState.currentLanguage === 'telugu' ? 'ఈ చర్యను వెనక్కి తీసుకోలేరు. అన్ని సందేశాలు తొలగించబడతాయి.' : 'Are you sure you want to delete this conversation? This will permanently delete all associated messages.',
        async () => {
            await ChatDatabase.deleteConversation(id);
            if (id === appState.currentConversationId) {
                await startNewConversation();
            }
            await refreshConversationsList();
            showToast(appState.currentLanguage === 'telugu' ? "సంభాషణ తొలగించబడింది" : "Conversation deleted successfully.", "success");
        }
    );
}

function triggerDeleteCurrentChat() {
    if (!appState.currentConversationId) {
        showToast(appState.currentLanguage === 'telugu' ? "తొలగించడానికి సంభాషణ ఏదీ లేదు" : "No active conversation to delete.", "warning");
        return;
    }
    triggerDeleteConversation(appState.currentConversationId);
}

function clearCurrentChatMessages() {
    if (!appState.currentConversationId) {
        startNewConversation();
        return;
    }
    
    showCustomConfirm(
        appState.currentLanguage === 'telugu' ? 'చాట్‌ను క్లియర్ చేయాలా?' : 'Clear current conversation?',
        appState.currentLanguage === 'telugu' ? 'ఈ చాట్ లోని సందేశాలన్నీ తొలగించబడతాయి.' : 'This will remove all messages from the current conversation but keep the thread history.',
        async () => {
            const id = appState.currentConversationId;
            let msgs = JSON.parse(localStorage.getItem('agrisaarthi_messages') || '[]');
            msgs = msgs.filter(m => m.conversation_id !== id);
            localStorage.setItem('agrisaarthi_messages', JSON.stringify(msgs));
            
            if (ChatDatabase.supabase) {
                await ChatDatabase.supabase
                    .from('messages')
                    .delete()
                    .eq('conversation_id', id);
            }
            
            await loadConversation(id);
            showToast(appState.currentLanguage === 'telugu' ? "చాట్ క్లియర్ చేయబడింది" : "Conversation cleared successfully.", "success");
        }
    );
}

function toggleChatHistorySidebar() {
    const sidebar = document.getElementById('chat-history-sidebar');
    const overlay = document.getElementById('chat-sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// AI Assistant Chat Consultations Simulator
async function sendChatMessage() {
    const input = document.getElementById('chat-text-input');
    const text = input.value.trim();
    const hasAttachment = !!appState.activeChatAttachmentUrl;
    
    if (!text && !hasAttachment) return;
    
    if (!appState.currentConversationId) {
        const title = generateAutomaticTitle(text || "Attachment Upload");
        const cropContext = appState.farmerProfile.crop || "Rice";
        const newConv = await ChatDatabase.createConversation(title, appState.currentLanguage, cropContext);
        appState.currentConversationId = newConv.id;
        document.getElementById('current-chat-title').textContent = title;
        await refreshConversationsList();
    }
    
    const convId = appState.currentConversationId;
    
    await ChatDatabase.createMessage(
        convId,
        'user',
        text || "Media Attached",
        appState.activeChatAttachmentUrl,
        appState.activeChatAttachmentType
    );
    
    appendChatUserMessageWithAttachment(text, appState.activeChatAttachmentUrl, appState.activeChatAttachmentType);
    
    input.value = "";
    const attachmentType = appState.activeChatAttachmentType;
    const attachmentName = appState.activeChatAttachment ? appState.activeChatAttachment.name : "";
    
    removeChatAttachment();
    
    showAiChatLoadingIndicator();
    
    try {
        removeAiChatLoadingIndicator();
        
        let responseText = '';
        
        if (hasAttachment && attachmentType === 'image' && appState.activeChatAttachment) {
            // Convert attached image to base64 and send to AI with vision
            try {
                const base64Data = await convertFileToBase64(appState.activeChatAttachment || null);
                responseText = await processAiChatContextResponse(
                    text || 'Please analyze this crop image and advise me.',
                    convId,
                    base64Data,
                    appState.activeChatAttachment ? appState.activeChatAttachment.type : 'image/jpeg'
                );
            } catch (imgErr) {
                console.warn('[AgriSaarthi AI] Image conversion failed, sending text only:', imgErr);
                responseText = await processAiChatContextResponse(text || 'I uploaded a crop image for analysis.', convId);
            }
        } else if (hasAttachment && attachmentType === 'video') {
            // For video: extract first frame and analyze, or send description
            const videoDesc = text
                ? text
                : `I uploaded a field video (${attachmentName || 'video file'}) for analysis. Please describe what agricultural issues I should look for.`;
            responseText = await processAiChatContextResponse(videoDesc, convId);
        } else {
            // Pure text conversation
            responseText = await processAiChatContextResponse(text, convId);
        }
        
        await ChatDatabase.createMessage(convId, 'assistant', responseText);
        appendChatMessage('ai', responseText);
        appendChatActionButtons();
        await refreshConversationsList();
        
    } catch (e) {
        console.error('[AgriSaarthi AI] sendChatMessage error:', e);
        removeAiChatLoadingIndicator();
        const errMsg = appState.currentLanguage === 'telugu'
            ? 'సందేశం పంపడంలో లోపం వచ్చింది. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : 'Failed to send message. Please try again.';
        appendChatMessage('ai', errMsg);
    }
}

function handleChatKeyDown(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function triggerChatUpload(type) {
    const fileInput = document.getElementById('chat-file-input');
    if (fileInput) {
        fileInput.accept = type === 'video' ? 'video/*' : 'image/*';
        fileInput.click();
    }
}

function handleChatFileUploaded(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
        showToast("Unsupported file type / మద్దతు లేని ఫైల్", "error");
        event.target.value = '';
        return;
    }
    
    const maxMB = isImage ? 15 : 50;
    const validation = validateFile(file, ['image/', 'video/'], maxMB);
    if (!validation.valid) {
        showToast(validation.error, 'error');
        event.target.value = '';
        return;
    }
    
    if (appState.activeChatAttachmentUrl) {
        URL.revokeObjectURL(appState.activeChatAttachmentUrl);
    }
    
    appState.activeChatAttachment = file;
    appState.activeChatAttachmentUrl = URL.createObjectURL(file);
    appState.activeChatAttachmentType = isImage ? 'image' : 'video';
    
    const previewBar = document.getElementById('chat-attachment-preview');
    const previewImg = document.getElementById('chat-preview-img');
    const previewVideo = document.getElementById('chat-preview-video');
    const filenameEl = document.getElementById('chat-preview-filename');
    const filesizeEl = document.getElementById('chat-preview-filesize');
    
    if (previewBar) {
        previewBar.classList.remove('hidden');
        filenameEl.textContent = file.name;
        filesizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        
        if (isImage) {
            if (previewVideo) previewVideo.classList.add('hidden');
            if (previewImg) {
                previewImg.classList.remove('hidden');
                previewImg.src = appState.activeChatAttachmentUrl;
            }
        } else {
            if (previewImg) previewImg.classList.add('hidden');
            if (previewVideo) {
                previewVideo.classList.remove('hidden');
                previewVideo.src = appState.activeChatAttachmentUrl;
            }
        }
    }
}

function removeChatAttachment() {
    const previewBar = document.getElementById('chat-attachment-preview');
    if (previewBar) previewBar.classList.add('hidden');
    
    if (appState.activeChatAttachmentUrl) {
        URL.revokeObjectURL(appState.activeChatAttachmentUrl);
        appState.activeChatAttachmentUrl = null;
    }
    appState.activeChatAttachment = null;
    appState.activeChatAttachmentType = null;
    
    const fileInput = document.getElementById('chat-file-input');
    if (fileInput) fileInput.value = '';
}

function appendChatUserMessageWithAttachment(text, url, type) {
    const msgContainer = document.getElementById('chat-messages-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = "chat-msg user";
    
    const contentDiv = document.createElement('div');
    contentDiv.className = "message-content";
    
    if (url) {
        const attachBox = document.createElement('div');
        attachBox.className = "chat-bubble-attachment";
        attachBox.style.marginBottom = "8px";
        attachBox.style.borderRadius = "8px";
        attachBox.style.overflow = "hidden";
        attachBox.style.maxWidth = "240px";
        attachBox.style.border = "1px solid var(--border-color)";
        
        if (type === 'video') {
            const video = document.createElement('video');
            video.src = url;
            video.controls = true;
            video.style.width = "100%";
            video.style.maxHeight = "180px";
            video.style.display = "block";
            attachBox.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = url;
            img.style.width = "100%";
            img.style.maxHeight = "180px";
            img.style.objectFit = "cover";
            img.style.display = "block";
            attachBox.appendChild(img);
        }
        contentDiv.appendChild(attachBox);
    }
    
    if (text) {
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        contentDiv.appendChild(textSpan);
    }
    
    const metaDiv = document.createElement('div');
    metaDiv.className = "msg-meta";
    metaDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    msgDiv.appendChild(contentDiv);
    msgDiv.appendChild(metaDiv);
    
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function parseMarkdownToHTML(markdown) {
    if (!markdown) return '';
    let html = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>')
        .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
        .replace(/\n/g, '<br>');
    return html;
}

function copyChatResponse(text, btnEl) {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
    const originalHTML = btnEl.innerHTML;
    btnEl.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
    setTimeout(() => {
        btnEl.innerHTML = originalHTML;
    }, 1500);
}

function appendChatMessage(sender, text) {
    const msgContainer = document.getElementById('chat-messages-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = "message-content";
    
    if (sender === 'ai') {
        contentDiv.innerHTML = parseMarkdownToHTML(text);
        
        // Actions row (Listen, Stop, Copy)
        const actionsRow = document.createElement('div');
        actionsRow.className = "chat-actions-row";
        actionsRow.style.display = "flex";
        actionsRow.style.gap = "8px";
        actionsRow.style.marginTop = "8px";
        
        // Clean speech text
        const speechText = text.replace(/[\*\-_`]/g, '').replace(/'/g, "\\'");
        
        actionsRow.innerHTML = `
            <button class="chat-bubble-action-btn" onclick="speakSpeech('${speechText.replace(/"/g, '&quot;')}', appState.currentLanguage)" style="border: none; background: rgba(0,0,0,0.04); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; color: var(--text-muted);">
                <i class="fa-solid fa-volume-high"></i> Listen
            </button>
            <button class="chat-bubble-action-btn" onclick="stopSpeaking()" style="border: none; background: rgba(0,0,0,0.04); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; color: var(--text-muted);">
                <i class="fa-solid fa-volume-xmark"></i> Stop
            </button>
            <button class="chat-bubble-action-btn" onclick="copyChatResponse('${speechText.replace(/"/g, '&quot;')}', this)" style="border: none; background: rgba(0,0,0,0.04); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; color: var(--text-muted);">
                <i class="fa-solid fa-copy"></i> Copy
            </button>
        `;
        
        msgDiv.appendChild(contentDiv);
        msgDiv.appendChild(actionsRow);
    } else {
        contentDiv.textContent = text;
        msgDiv.appendChild(contentDiv);
    }
    
    const metaDiv = document.createElement('div');
    metaDiv.className = "msg-meta";
    metaDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.appendChild(metaDiv);
    
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    
    if (sender === 'ai' && document.getElementById('settings-auto-speech').checked) {
        speakSpeech(text.replace(/[\*\-_`]/g, ''), appState.currentLanguage);
    }
}

function appendChatActionButtons() {
    const msgContainer = document.getElementById('chat-messages-container');
    const btnRow = document.createElement('div');
    btnRow.className = "chat-btn-options";
    
    const checkWeatherBtn = document.createElement('button');
    checkWeatherBtn.className = "chat-opt-btn";
    checkWeatherBtn.textContent = appState.currentLanguage === 'telugu' ? "వాతావరణం చూడండి" : "Check Weather";
    checkWeatherBtn.onclick = () => simulateUserChatQuery(appState.currentLanguage === 'telugu' ? "వాతావరణం ఎలా ఉంది?" : "Check Weather");
    
    const analyzeTreatmentBtn = document.createElement('button');
    analyzeTreatmentBtn.className = "chat-opt-btn";
    analyzeTreatmentBtn.textContent = appState.currentLanguage === 'telugu' ? "నివారణా చర్యలు" : "Analyze Treatment";
    analyzeTreatmentBtn.onclick = () => simulateUserChatQuery(appState.currentLanguage === 'telugu' ? "దీని నివారణ మార్గాలు ఏమిటి?" : "What is the treatment?");
    
    btnRow.appendChild(checkWeatherBtn);
    btnRow.appendChild(analyzeTreatmentBtn);
    
    msgContainer.appendChild(btnRow);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function showAiChatLoadingIndicator() {
    const msgContainer = document.getElementById('chat-messages-container');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "chat-msg ai chat-loader-msg";
    loadingDiv.id = "chat-loading-indicator";
    
    const contentDiv = document.createElement('div');
    contentDiv.className = "message-content";
    contentDiv.innerHTML = `<span class="recording-dot"></span> AI typing...`;
    
    loadingDiv.appendChild(contentDiv);
    msgContainer.appendChild(loadingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function removeAiChatLoadingIndicator() {
    const element = document.getElementById('chat-loading-indicator');
    if (element) {
        element.remove();
    }
}

function simulateUserChatQuery(text) {
    const input = document.getElementById('chat-text-input');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

// Farmer Connect Community section initialization
// Farmer Connect Community section initialization
const mockPosts = [
    {
        id: 1,
        author: "Srinivas M.",
        locTe: "చివ్వెంల (2 కి.మీ)",
        locEn: "Chivvemla (2 km)",
        cropTe: "వరి రైతు",
        cropEn: "Rice Farmer",
        content: "Found early blast spots in block A. Applied Kavach (Chlorothalonil) 2g/L. The spread stopped within 3 days.",
        lang: 'english',
        likes: 12,
        category: 'pest-disease',
        imageUrl: 'images/tomato_disease.png',
        audioUrl: null,
        comments: [
            { author: "Raju B.", text: "Thanks Srinivas, this is very helpful!", time: "2h ago" }
        ]
    },
    {
        id: 2,
        author: "Mallesh K.",
        locTe: "సూర్యాపేట (5 కి.మీ)",
        locEn: "Suryapet (5 km)",
        cropTe: "టమోటా రైతు",
        cropEn: "Tomato Farmer",
        content: "టమోటా తోటలో బిందు సేద్యం (Drip Irrigation) ద్వారా నీటి పారుదల చాలా సులువుగా ఉంది. నీరు బాగా పొదుపు అవుతుంది.",
        lang: 'telugu',
        likes: 8,
        category: 'irrigation',
        imageUrl: null,
        audioUrl: null,
        comments: []
    },
    {
        id: 3,
        author: "Yadagiri Reddy",
        locTe: "చివ్వెంల (4 కి.మీ)",
        locEn: "Chivvemla (4 km)",
        cropTe: "మిరప రైతు",
        cropEn: "Chilli Farmer",
        content: "Organic neem spray is working well against whiteflies on my chilli plants.",
        lang: 'english',
        likes: 19,
        category: 'organic',
        imageUrl: null,
        audioUrl: null,
        comments: []
    }
];

let communityPhotoFile = null;
let communityPhotoUrl = null;
let communityVoiceBlob = null;
let communityVoiceUrl = null;
let mediaRecorder = null;
let audioChunks = [];
let isCommunityRecording = false;

function handleCommunityPhotoSelected(input) {
    const file = input.files[0];
    if (!file) return;
    
    const validation = validateFile(file, ['image/'], 15);
    if (!validation.valid) {
        showToast(validation.error, 'error');
        input.value = '';
        return;
    }
    
    communityPhotoFile = file;
    communityPhotoUrl = URL.createObjectURL(file);
    
    const previewContainer = document.getElementById('comm-previews-container');
    const imgBox = document.getElementById('comm-img-preview-box');
    const previewImg = document.getElementById('comm-preview-img');
    
    if (previewContainer && imgBox && previewImg) {
        previewContainer.classList.remove('hidden');
        imgBox.classList.remove('hidden');
        previewImg.src = communityPhotoUrl;
    }
}

function removeCommunityPhoto() {
    const imgBox = document.getElementById('comm-img-preview-box');
    if (imgBox) imgBox.classList.add('hidden');
    
    if (communityPhotoUrl) {
        URL.revokeObjectURL(communityPhotoUrl);
        communityPhotoUrl = null;
    }
    communityPhotoFile = null;
    document.getElementById('comm-photo-input').value = '';
    checkCommunityPreviewsEmpty();
}

function toggleCommunityVoiceRecord() {
    if (isCommunityRecording) {
        stopCommunityVoiceRecord();
    } else {
        startCommunityVoiceRecord();
    }
}

function startCommunityVoiceRecord() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                communityVoiceBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                communityVoiceUrl = URL.createObjectURL(communityVoiceBlob);
                
                const previewContainer = document.getElementById('comm-previews-container');
                const voiceBox = document.getElementById('comm-voice-preview-box');
                const previewAudio = document.getElementById('comm-preview-audio');
                
                if (previewContainer && voiceBox && previewAudio) {
                    previewContainer.classList.remove('hidden');
                    voiceBox.classList.remove('hidden');
                    previewAudio.src = communityVoiceUrl;
                }
            };
            
            mediaRecorder.start();
            isCommunityRecording = true;
            
            const btn = document.getElementById('comm-voice-btn');
            if (btn) {
                btn.innerHTML = `<i class="fa-solid fa-stop text-danger"></i> Stop Rec`;
                btn.style.backgroundColor = '#D32F2F';
                btn.style.color = '#fff';
            }
            showToast("Recording started... మాట్లాడండి", "info");
        })
        .catch(err => {
            console.error("Microphone access failed for community voice note:", err);
            showToast("Microphone permission denied / మైక్రోఫోన్ అనుమతి లేదు", "error");
        });
}

function stopCommunityVoiceRecord() {
    if (mediaRecorder && isCommunityRecording) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isCommunityRecording = false;
        
        const btn = document.getElementById('comm-voice-btn');
        if (btn) {
            btn.innerHTML = `<i class="fa-solid fa-microphone"></i> Voice Note`;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }
        showToast("Recording stopped. Voice note attached.", "success");
    }
}

function removeCommunityVoice() {
    const voiceBox = document.getElementById('comm-voice-preview-box');
    if (voiceBox) voiceBox.classList.add('hidden');
    
    if (communityVoiceUrl) {
        URL.revokeObjectURL(communityVoiceUrl);
        communityVoiceUrl = null;
    }
    communityVoiceBlob = null;
    checkCommunityPreviewsEmpty();
}

function checkCommunityPreviewsEmpty() {
    const imgBox = document.getElementById('comm-img-preview-box');
    const voiceBox = document.getElementById('comm-voice-preview-box');
    const previewContainer = document.getElementById('comm-previews-container');
    
    if (imgBox && voiceBox && imgBox.classList.contains('hidden') && voiceBox.classList.contains('hidden')) {
        if (previewContainer) previewContainer.classList.add('hidden');
    }
}

function initCommunityPosts(categoryFilter = 'all') {
    const container = document.getElementById('community-posts-container');
    if (!container) return;
    
    container.innerHTML = "";
    
    const lang = appState.currentLanguage;
    const postsToRender = categoryFilter === 'all' ? mockPosts : mockPosts.filter(p => p.category === categoryFilter);
    
    postsToRender.forEach(post => {
        const card = document.createElement('div');
        card.className = "comm-post-card animate-float-delayed";
        
        const loc = lang === 'telugu' ? post.locTe : post.locEn;
        const crop = lang === 'telugu' ? post.cropTe : post.cropEn;
        const text = post.content;
        
        let mediaHTML = "";
        if (post.imageUrl) {
            mediaHTML += `
                <div class="post-image-attachment" style="margin-top: 10px; max-width: 320px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color);">
                    <img src="${post.imageUrl}" style="width: 100%; max-height: 200px; object-fit: cover; display: block;">
                </div>
            `;
        }
        
        if (post.audioUrl) {
            mediaHTML += `
                <div class="post-audio-attachment" style="margin-top: 10px; display: flex; align-items: center; gap: 10px; background: var(--bg-color); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); max-width: 320px;">
                    <div class="audio-play-circle" onclick="playAudioNode(this, '${post.audioUrl}')" style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;"><i class="fa-solid fa-play"></i></div>
                    <div class="audio-wave-lines" style="flex: 1; height: 12px; background: repeating-linear-gradient(90deg, var(--border-color) 0px, var(--border-color) 2px, transparent 2px, transparent 4px);"></div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Voice Note</span>
                </div>
            `;
        }

        const commentsBoxHTML = renderComments(post.id);

        card.innerHTML = `
            <div class="post-header">
                <div class="post-user">
                    <div class="post-avatar"><i class="fa-solid fa-circle-user"></i></div>
                    <div class="post-user-details">
                        <h5>${post.author} <span class="post-badge" style="font-size: 0.75rem; background: var(--primary-light); color: var(--primary); padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${loc}</span></h5>
                        <p>${crop}</p>
                    </div>
                </div>
                <div class="post-badge-time">Today</div>
            </div>
            <div class="post-content-text" id="post-text-${post.id}" style="margin-top: 10px; line-height: 1.5; color: var(--text-color);">${text}</div>
            ${mediaHTML}
            <div class="post-actions" style="display: flex; gap: 15px; margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border-color);">
                <button class="action-btn" onclick="likePost(this, ${post.likes})" style="border: none; background: none; cursor: pointer; color: var(--text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-heart"></i> <span>Like (${post.likes})</span></button>
                <button class="action-btn" onclick="toggleTranslatePost(${post.id}, this)" style="border: none; background: none; cursor: pointer; color: var(--text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-language"></i> Translate</button>
                <button class="action-btn" onclick="askAiAboutPost(${post.id})" style="border: none; background: none; cursor: pointer; color: var(--primary); font-size: 0.85rem; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-robot"></i> Ask AI</button>
            </div>
            ${commentsBoxHTML}
        `;
        
        container.appendChild(card);
    });
}

function renderComments(postId) {
    const post = mockPosts.find(p => p.id === postId);
    if (!post) return "";
    
    let commentsHTML = "";
    if (post.comments && post.comments.length > 0) {
        commentsHTML = `<div class="post-comments-list" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 6px;">`;
        post.comments.forEach(c => {
            commentsHTML += `
                <div class="comment-item" style="font-size: 0.8rem; background: var(--bg-color); padding: 6px 10px; border-radius: 6px;">
                    <strong style="color: var(--primary);">${c.author}:</strong> <span>${c.text}</span>
                </div>
            `;
        });
        commentsHTML += `</div>`;
    }
    
    return `
        <div id="comments-box-${postId}" class="comments-section-container" style="margin-top: 10px; border-top: 1px dashed var(--border-color); padding-top: 10px;">
            ${commentsHTML}
            <div class="comment-input-row" style="display: flex; gap: 8px; margin-top: 8px;">
                <input type="text" id="comment-input-${postId}" placeholder="Write a comment..." style="flex: 1; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.8rem; background: var(--bg-color); color: var(--text-color);">
                <button class="btn primary sm" onclick="submitComment(${postId})" style="padding: 4px 10px; font-size: 0.8rem; height: auto;">Comment</button>
            </div>
        </div>
    `;
}

function submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push({
            author: appState.farmerProfile.name || "Ravi Kumar",
            text: text,
            time: "Just now"
        });
        input.value = "";
        initCommunityPosts();
        showToast("Comment added! / కామెంట్ చేర్చబడింది", "success");
    }
}

function selectCommunityCategory(cat) {
    document.querySelectorAll('.community-left-bar .cat-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    initCommunityPosts(cat);
}

function likePost(button, initialCount) {
    if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        button.querySelector('span').textContent = `Like (${initialCount})`;
    } else {
        button.classList.add('liked');
        button.querySelector('span').textContent = `Like (${initialCount + 1})`;
    }
}

function submitCommunityPost() {
    const textarea = document.getElementById('comm-post-textarea');
    const text = textarea.value.trim();
    const category = document.getElementById('comm-post-category').value;
    
    if (!text && !communityVoiceUrl) {
        showToast("Please enter some text or record a voice note! / టెక్స్ట్ లేదా వాయిస్ జోడించండి", "warning");
        return;
    }
    
    const newPost = {
        id: mockPosts.length + 1,
        author: appState.farmerProfile.name || "Ravi Kumar",
        locTe: `${appState.farmerProfile.district || 'Suryapet'} (పొలం)`,
        locEn: `${appState.farmerProfile.district || 'Suryapet'} (Your Farm)`,
        cropTe: appState.currentLanguage === 'telugu' ? "వరి రైతు" : "Rice Farmer",
        cropEn: (appState.farmerProfile.crop || "Rice") + " Farmer",
        content: text || (appState.currentLanguage === 'telugu' ? "వాయిస్ నోట్ పోస్ట్ చేయబడింది" : "Voice Note Attached"),
        lang: appState.currentLanguage,
        likes: 0,
        category: category,
        imageUrl: communityPhotoUrl || null,
        audioUrl: communityVoiceUrl || null,
        comments: []
    };
    
    mockPosts.unshift(newPost);
    
    // Clear preview attachments
    communityPhotoFile = null;
    communityPhotoUrl = null;
    communityVoiceBlob = null;
    communityVoiceUrl = null;
    
    const imgBox = document.getElementById('comm-img-preview-box');
    const voiceBox = document.getElementById('comm-voice-preview-box');
    const previewContainer = document.getElementById('comm-previews-container');
    if (imgBox) imgBox.classList.add('hidden');
    if (voiceBox) voiceBox.classList.add('hidden');
    if (previewContainer) previewContainer.classList.add('hidden');
    
    textarea.value = "";
    document.getElementById('comm-photo-input').value = "";
    
    initCommunityPosts();
    showToast("Post submitted successfully! / మీ పోస్ట్ ప్రచురించబడింది", "success");
}

function toggleTranslatePost(postId, btnEl) {
    const post = mockPosts.find(p => p.id === postId);
    if (!post) return;
    
    const postTextEl = document.getElementById(`post-text-${postId}`);
    if (!postTextEl) return;
    
    const currentLang = appState.currentLanguage;
    
    if (btnEl.classList.contains('showing-translation')) {
        postTextEl.textContent = post.content;
        btnEl.classList.remove('showing-translation');
        btnEl.innerHTML = `<i class="fa-solid fa-language"></i> Translate`;
    } else {
        let translatedText = "";
        
        if (postId === 1) {
            const blastTranslations = {
                english: "Found early blast spots in block A. Applied Kavach (Chlorothalonil) 2g/L. The spread stopped within 3 days.",
                telugu: "బ్లాక్ ఎ లో ప్రారంభ దశ అగ్గి తెగులు మచ్చలు కనిపించాయి. కవచ్ (క్లోరోథలోనిల్) లీటరుకు 2 గ్రా పిచికారీ చేసాను. 3 రోజుల్లో వ్యాప్తి ఆగింది.",
                hindi: "ब्लॉक ए में ब्लास्ट के शुरुआती धब्बे मिले। कवच (क्लोरोथैलोनिल) 2 ग्राम/लीटर का छिड़काव किया। 3 दिनों के भीतर फैलाव रुक गया।",
                tamil: "தொகுதி ஏ-யில் ஆரம்ப குலை நோய் புள்ளிகள் கண்டறியப்பட்டன. கவாச் (குளோரோதலோனில்) 2 கிராம்/லிட்டர் தெளிக்கப்பட்டது. 3 நாட்களுக்குள் பரவுவது நின்றது.",
                kannada: "ಬ್ಲಾಕ್ ಎ ನಲ್ಲಿ ಆರಂಭಿಕ ಬೆಂಕಿ ರೋಗದ ಚುಕ್ಕೆಗಳು ಕಂಡುಬಂದವು. ಕವಾಚ್ (ಕ್ಲೋರೋಥಲೋನಿಲ್) 2ಗ್ರಾಂ/ಲೀಟರ್ ಸಿಂಪಡಿಸಲಾಗಿದೆ. 3 ದಿನಗಳಲ್ಲಿ ಹರಡುವುದು ನಿಂತಿತು."
            };
            translatedText = blastTranslations[currentLang] || blastTranslations.english;
        } else if (postId === 2) {
            const dripTranslations = {
                english: "Using drip irrigation has significantly improved tomato crop yield and cut down pumping power costs.",
                telugu: "టమోటా తోటలో బిందు సేద్యం (Drip Irrigation) ద్వారా నీటి పారుదల చాలా సులువుగా ఉంది. నీరు బాగా పొదుపు అవుతుంది.",
                hindi: "टमाटर की फसल में ड्रिप सिंचाई का उपयोग करने से उपज में काफी सुधार हुआ है और पंपिंग बिजली की लागत कम हुई है।",
                tamil: "சொட்டுநீர் பாசனத்தைப் பயன்படுத்துவது தக்காளியின் விளைச்சலை கணிசமாக மேம்படுத்தியுள்ளது மற்றும் பம்பிங் மின்சார செலவைக் குறைத்துள்ளது.",
                kannada: "ಟೊಮೆಟೊ ಬೆಳೆಯಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ಬಳಸುವುದರಿಂದ ಇಳುವರಿ ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚಾಗಿದೆ ಮತ್ತು ಪಂಪಿಂಗ್ ವೆಚ್ಚ ಕಡಿಮೆಯಾಗಿದೆ."
            };
            translatedText = dripTranslations[currentLang] || dripTranslations.english;
        } else if (postId === 3) {
            const neemTranslations = {
                english: "Organic neem spray is working well against whiteflies on my chilli plants.",
                telugu: "నా మిరప మొక్కలపై తెల్లదోమల నివారణకు సేంద్రీయ వేప నూనె పిచికారీ బాగా పనిచేస్తోంది.",
                hindi: "मेरे मिर्च के पौधों पर सफेद मक्खियों के खिलाफ जैविक नीम का छिड़काव अच्छा काम कर रहा है।",
                tamil: "என் மிளகாய் செடிகளில் வெள்ளை ஈக்களுக்கு எதிராக இயற்கை வேம்பு தெளிப்பு நன்றாக வேலை செய்கிறது.",
                kannada: "ನನ್ನ ಮೆಣಸಿನಕಾಯಿ ಗಿಡಗಳ ಮೇಲೆ ಬಿಳಿ ನೊಣಗಳ ವಿರುದ್ಧ ಸಾವಯವ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪರಣೆ ಚೆನ್ನಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿದೆ."
            };
            translatedText = neemTranslations[currentLang] || neemTranslations.english;
        } else {
            const prefixes = {
                english: "[Translated]: ",
                telugu: "[అనువదించబడింది]: ",
                hindi: "[अनुवादित]: ",
                tamil: "[மொழிபெயர்க்கப்பட்டது]: ",
                kannada: "[ಅನುವಾದಿಸಲಾಗಿದೆ]: "
            };
            translatedText = (prefixes[currentLang] || "[Translated]: ") + post.content;
        }
        
        postTextEl.textContent = translatedText;
        btnEl.classList.add('showing-translation');
        btnEl.innerHTML = `<i class="fa-solid fa-rotate-left"></i> Original`;
    }
}

function askAiAboutPost(postId) {
    const post = mockPosts.find(p => p.id === postId);
    if (!post) return;
    
    const promptText = appState.currentLanguage === 'telugu' ? 
        `ఫారమ్ కనెక్ట్ కమ్యూనిటీ పోస్ట్ గురించి సహాయం కావాలి. రచయిత: ${post.author}, పంట: ${post.cropEn}, విషయం: "${post.content}". దీనిని విశ్లేషించండి.` :
        `Help me analyze this community post from Farmer Connect. Author: ${post.author}, Crop: ${post.cropEn}, Content: "${post.content}". What is your recommendation?`;
    
    navigateTo('main-app-view');
    activatePane('ai-chat-pane');
    
    const input = document.getElementById('chat-text-input');
    if (input) {
        input.value = promptText;
        sendChatMessage();
    }
}

function playAudioNode(btn, url) {
    const icon = btn.querySelector('i');
    
    if (appState.activeAudioNode) {
        appState.activeAudioNode.pause();
        const activeBtn = appState.activeAudioBtn;
        if (activeBtn) {
            activeBtn.querySelector('i').className = "fa-solid fa-play";
        }
        if (appState.activeAudioNode.src === url) {
            appState.activeAudioNode = null;
            appState.activeAudioBtn = null;
            return;
        }
    }
    
    const audio = new Audio(url);
    audio.play();
    icon.className = "fa-solid fa-pause";
    
    appState.activeAudioNode = audio;
    appState.activeAudioBtn = btn;
    
    audio.onended = () => {
        icon.className = "fa-solid fa-play";
        appState.activeAudioNode = null;
        appState.activeAudioBtn = null;
    };
}

// Kept for legacy compatibility
function simulateCommunityVoiceRecord() {
    showToast("Recording simulated...", "info");
}

function playMockAudioNode(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-play')) {
        icon.className = "fa-solid fa-pause";
        speakSpeech(appState.currentLanguage === 'telugu' ? "వరి పంట నివారణకు పటాష్ వాడకం చాలా మంచిది అని సలహా ఇస్తున్నాము." : "Using potash helps control rice blast leaves.", appState.currentLanguage);
        
        setTimeout(() => {
            icon.className = "fa-solid fa-play";
        }, 4000);
    } else {
        icon.className = "fa-solid fa-play";
        appState.synth.cancel();
    }
}

// User Helpfulness Feedback submitter
function submitUserFeedback(verdict) {
    showToast(appState.currentLanguage === 'telugu' ? `ధన్యవాదాలు! మీ స్పందన ఆమోదించబడింది.` : `Thank you! Your feedback has been registered.`, 'success');
}

function submitWrittenFeedback() {
    const feedbackBox = document.getElementById('feedback-textbox');
    const val = feedbackBox.value.trim();
    if (val) {
        feedbackBox.value = "";
        showToast(appState.currentLanguage === 'telugu' ? "మీ ఫీడ్‌బ్యాక్ సేవ్‌ చేయబడింది." : "Your comments were saved successfully.", 'success');
    }
}

function handleSettingsLangChange(selectEl) {
    setLanguage(selectEl.value);
}

// Dynamic display of current date and time on dashboard
setInterval(() => {
    const clock = document.getElementById('current-decision-time');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + now.toLocaleDateString([], { month: 'short', day: '2-digit' });
    }
}, 1000);

// ============================================
// HACKATHON GUIDE STEPPING ENGINE
// ============================================
function initDemoStepsList() {
    const container = document.getElementById('demo-steps-list');
    if (!container) return;
    
    container.innerHTML = "";
    demoSteps.forEach((step, idx) => {
        const li = document.createElement('li');
        li.textContent = `${idx + 1}. ${step.title}`;
        li.id = `demo-list-item-${idx}`;
        li.onclick = () => jumpToDemoStep(idx);
        container.appendChild(li);
    });
    
    // Highlight step 0
    updateDemoControllerUI();
}

function toggleDemoWidget() {
    const widget = document.getElementById('demo-controller');
    widget.classList.toggle('collapsed');
}

function updateDemoControllerUI() {
    const stepIdx = appState.demoStep;
    const totalSteps = demoSteps.length;
    
    document.getElementById('current-demo-step').textContent = stepIdx + 1;
    document.getElementById('demo-progress-bar').style.width = `${((stepIdx + 1) / totalSteps) * 100}%`;
    
    // Update step description text based on active language
    const currentStep = demoSteps[stepIdx];
    const textEl = document.getElementById('demo-step-text');
    textEl.innerHTML = `<strong>${currentStep.title}</strong>: ${appState.currentLanguage === 'telugu' ? currentStep.descTe : currentStep.descEn}`;
    
    // Disable prev/next limits
    document.getElementById('prev-demo-btn').disabled = stepIdx === 0;
    document.getElementById('next-demo-btn').innerHTML = stepIdx === totalSteps - 1 ? 
        `Finish Demo <i class="fa-solid fa-flag-checkered"></i>` : 
        `Next Step <i class="fa-solid fa-arrow-right"></i>`;
        
    // Update step highlighted in list
    document.querySelectorAll('.demo-steps-list li').forEach((li, idx) => {
        li.className = "";
        if (idx < stepIdx) {
            li.classList.add('completed');
        } else if (idx === stepIdx) {
            li.classList.add('active');
        }
    });
}

function nextDemoStep() {
    const totalSteps = demoSteps.length;
    if (appState.demoStep < totalSteps - 1) {
        appState.demoStep++;
        executeCurrentDemoAction();
        updateDemoControllerUI();
    } else {
        showToast("Demo Complete! AgriSaarthi AI dashboard is ready for interactive exploration.", "success");
        toggleDemoWidget();
    }
}

function prevDemoStep() {
    if (appState.demoStep > 0) {
        appState.demoStep--;
        executeCurrentDemoAction();
        updateDemoControllerUI();
    }
}

function jumpToDemoStep(idx) {
    appState.demoStep = idx;
    executeCurrentDemoAction();
    updateDemoControllerUI();
}

function executeCurrentDemoAction() {
    const action = demoSteps[appState.demoStep].action;
    if (action && typeof action === 'function') {
        action();
    }
}

// Special function triggered at step 16 to submit final ratings
function submitGeneralFeedbackAndAlertDone() {
    document.getElementById('feedback-textbox').value = "వరి తడి ఆపమని వాతావరణ విభాగం ఇచ్చిన సలహా చాలా మేలు చేసింది. మా ఖర్చులు తగ్గాయి.";
    setTimeout(() => {
        showToast("Hackathon Demonstration Completed successfully! All components have been evaluated.", "success");
    }, 1500);
}
