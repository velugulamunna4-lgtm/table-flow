export type Language = 'en' | 'te' | 'ta' | 'hi';

export interface TranslationDictionary {
  welcomeLine: string;
  tableLabel: string;
  searchPlaceholder: string;
  categories: {
    specials: string;
    starters: string;
    mains: string;
    biryani: string;
    desserts: string;
    drinks: string;
  };
  filterVeg: string;
  filterNonVeg: string;
  filterAll: string;
  addBtn: string;
  soldOut: string;
  viewOrder: string;
  itemsWord: string;
  itemWord: string;
  cartTitle: string;
  emptyCart: string;
  emptyCartSub: string;
  addSpecialNotes: string;
  notesPlaceholder: string;
  subtotal: string;
  taxesAndCharges: string;
  totalPayable: string;
  placeOrder: string;
  orderMore: string;
  callWaiter: string;
  waiterCalledToast: string;
  playGameTitle: string;
  playGameSub: string;
  playNow: string;
  viewBill: string;
  orderStages: {
    sent: { title: string; desc: string };
    accepted: { title: string; desc: string };
    cooking: { title: string; desc: string };
    ready: { title: string; desc: string };
    served: { title: string; desc: string };
  };
  bill: {
    title: string;
    splitEqually: string;
    splitByItem: string;
    customSplit: string;
    payOnline: string;
    payCounter: string;
    paymentSuccess: string;
    thankYou: string;
  };
  onboarding: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    getStarted: string;
    skip: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    welcomeLine: 'Welcome! Pick what you like.',
    tableLabel: 'Table',
    searchPlaceholder: 'Search dishes, biryani, starters...',
    categories: {
      specials: "Chef's Specials",
      starters: 'Starters',
      mains: 'Main Course',
      biryani: 'Dum Biryani',
      desserts: 'Desserts',
      drinks: 'Beverages',
    },
    filterVeg: 'Pure Veg',
    filterNonVeg: 'Non-Veg',
    filterAll: 'All Items',
    addBtn: 'Add',
    soldOut: 'Sold out right now',
    viewOrder: 'View order',
    itemsWord: 'items',
    itemWord: 'item',
    cartTitle: 'Your Table Order',
    emptyCart: 'Your plate is empty',
    emptyCartSub: 'Explore our menu and tap items to add them here!',
    addSpecialNotes: 'Cooking notes for chef',
    notesPlaceholder: 'e.g. Less spicy, extra onions, no coriander...',
    subtotal: 'Item Subtotal',
    taxesAndCharges: 'GST & Service Charge',
    totalPayable: 'Total Amount',
    placeOrder: 'Place Order Now',
    orderMore: 'Order more food',
    callWaiter: 'Call Waiter',
    waiterCalledToast: 'A captain is heading to your table right now!',
    playGameTitle: 'While you wait, play a fun game!',
    playGameSub: 'Win up to 50 Spice Points and unlock sweet treats.',
    playNow: 'Play Mini-Game',
    viewBill: 'View Bill & Pay',
    orderStages: {
      sent: {
        title: 'Sent to Kitchen',
        desc: 'Your order reached our digital kitchen display.',
      },
      accepted: {
        title: 'Order Confirmed',
        desc: 'The head chef reviewed and accepted your dishes.',
      },
      cooking: {
        title: 'Cooking in Wok',
        desc: 'Fresh spices and ingredients are sizzling on the flame.',
      },
      ready: {
        title: 'Plated & Ready',
        desc: 'Dishes are freshly garnished and ready for your table.',
      },
      served: {
        title: 'Enjoy Your Feast!',
        desc: 'Served hot at your table. Have a wonderful meal!',
      },
    },
    bill: {
      title: 'Itemized Table Bill',
      splitEqually: 'Split Equally',
      splitByItem: 'Split by Items',
      customSplit: 'Custom Amount',
      payOnline: 'Pay with UPI / Card',
      payCounter: 'Pay at Counter',
      paymentSuccess: 'Payment Successful!',
      thankYou: 'Thank you for dining with Table Flow!',
    },
    onboarding: {
      step1Title: 'Pick Your Food',
      step1Desc: 'Browse authentic recipes with live photos, spice markers & dietary tags.',
      step2Title: 'Tap Order',
      step2Desc: 'Confirm your items with one tap. No waiting for physical menus.',
      step3Title: 'Watch It Cook',
      step3Desc: 'Follow real-time cooking progress from pan to your table.',
      getStarted: 'Start Ordering',
      skip: 'Skip Tour',
    },
  },
  te: {
    welcomeLine: 'స్వాగతం! మీకు నచ్చిన వంటకాలను ఎంచుకోండి.',
    tableLabel: 'టేబుల్',
    searchPlaceholder: 'వంటకాలు, బిర్యానీ, స్టార్టర్స్ వెతకండి...',
    categories: {
      specials: 'ప్రత్యేక వంటకాలు',
      starters: 'స్టార్టర్స్',
      mains: 'ప్రధాన భోజనం',
      biryani: 'దమ్ బిర్యానీ',
      desserts: 'మిఠాయిలు',
      drinks: 'పానీయాలు',
    },
    filterVeg: 'శాకాహారం',
    filterNonVeg: 'మాంసాహారం',
    filterAll: 'అన్నీ',
    addBtn: 'చేర్చండి',
    soldOut: 'ప్రస్తుతం అందుబాటులో లేదు',
    viewOrder: 'ఆర్డర్ చూడండి',
    itemsWord: 'వస్తువులు',
    itemWord: 'వస్తువు',
    cartTitle: 'మీ టేబుల్ ఆర్డర్',
    emptyCart: 'మీ ప్లేట్ ఖాళీగా ఉంది',
    emptyCartSub: 'మెనూ చూసి మీకు నచ్చిన రుచులను ఇక్కడ చేర్చండి!',
    addSpecialNotes: 'వంట మార్పుల గమనికలు',
    notesPlaceholder: 'ఉదాహరణ: కారం తక్కువ, ఉల్లిపాయలు ఎక్కువ...',
    subtotal: 'వస్తువుల మొత్తం',
    taxesAndCharges: 'జీఎస్టీ మరియు సర్వీస్ రుసుము',
    totalPayable: 'మొత్తం చెల్లించవలసినది',
    placeOrder: 'ఆర్డర్ ఇవ్వండి',
    orderMore: 'మరిన్ని ఆర్డర్ చేయండి',
    callWaiter: 'సర్వర్‌ను పిలవండి',
    waiterCalledToast: 'మా సిబ్బంది మీ టేబుల్ వద్దకు వస్తున్నారు!',
    playGameTitle: 'ఆహారం తయారవుతుండగా సరదా ఆట ఆడండి!',
    playGameSub: 'పాయింట్లు గెలుచుకోండి మరియు బహుమతులు పొందండి.',
    playNow: 'ఆట ఆడండి',
    viewBill: 'బిల్లు చూడండి & చెల్లించండి',
    orderStages: {
      sent: {
        title: 'వంటగదికి పంపబడింది',
        desc: 'మీ ఆర్డర్ మా వంటగదికి విజయవంతంగా చేరింది.',
      },
      accepted: {
        title: 'స్వీకరించబడింది',
        desc: 'ప్రధాన చెఫ్ మీ ఆర్డర్‌ను పరిశీలించి ఆమోదించారు.',
      },
      cooking: {
        title: 'వండబడుతోంది',
        desc: 'తాజా దినుసులతో ఆహారం తయారవుతోంది.',
      },
      ready: {
        title: 'వడ్డించడానికి సిద్ధం',
        desc: 'వేడి వేడి వంటకాలు మీ టేబుల్ కోసం సిద్ధంగా ఉన్నాయి.',
      },
      served: {
        title: 'ఆస్వాదించండి!',
        desc: 'మీ టేబుల్ వద్ద వడ్డించబడింది. చక్కటి భోజనం ఆనందించండి!',
      },
    },
    bill: {
      title: 'టేబుల్ బిల్లు వివరాలు',
      splitEqually: 'సమానంగా పంచుకోండి',
      splitByItem: 'వస్తువుల ప్రకారం',
      customSplit: 'ఇష్టానుసార మొత్తం',
      payOnline: 'యూపీఐ / కార్డ్ ద్వారా చెల్లించండి',
      payCounter: 'కౌంటర్ వద్ద చెల్లించండి',
      paymentSuccess: 'చెల్లింపు విజయవంతమైంది!',
      thankYou: 'టేబుల్ ఫ్లో వద్ద భోజనం చేసినందుకు ధన్యవాదాలు!',
    },
    onboarding: {
      step1Title: 'రుచులు ఎంచుకోండి',
      step1Desc: 'ఫోటోలు మరియు కారం గుర్తులు చూసి మీకు నచ్చినది ఎంపిక చేసుకోండి.',
      step2Title: 'ఒక్క ట్యాప్‌తో ఆర్డర్',
      step2Desc: 'సులభంగా త్వరితంగా ఆర్డర్ నమోదు చేయండి.',
      step3Title: 'వంట పురోగతి చూడండి',
      step3Desc: 'మీ ఆహారం వండటం నుండి టేబుల్ చేరే వరకు లైవ్ అప్‌డేట్స్ పొందండి.',
      getStarted: 'ఆర్డర్ మొదలుపెట్టండి',
      skip: 'దాటవేయి',
    },
  },
  ta: {
    welcomeLine: 'வணக்கம்! உங்களுக்குப் பிடித்த உணவுகளைத் தேர்ந்தெடுக்கவும்.',
    tableLabel: 'மேஜை',
    searchPlaceholder: 'உணவுகள், பிரியாணி, ஸ்டார்ட்டர்ஸ் தேடுக...',
    categories: {
      specials: 'சிறப்பு உணவுகள்',
      starters: 'ஸ்டார்ட்டர்ஸ்',
      mains: 'முக்கிய உணவு',
      biryani: 'தம் பிரியாணி',
      desserts: 'இனிப்புகள்',
      drinks: 'பானங்கள்',
    },
    filterVeg: 'சைவம்',
    filterNonVeg: 'அசைவம்',
    filterAll: 'அனைத்தும்',
    addBtn: 'சேர்க்கவும்',
    soldOut: 'தற்போது இருப்பு இல்லை',
    viewOrder: 'ஆர்டரைக் காண்க',
    itemsWord: 'உணவுகள்',
    itemWord: 'உணவு',
    cartTitle: 'உங்கள் மேஜை ஆர்டர்',
    emptyCart: 'உங்கள் தட்டு காலியாக உள்ளது',
    emptyCartSub: 'பட்டியலில் இருந்து சுவையான உணவுகளைத் தேர்ந்தெடுக்கவும்!',
    addSpecialNotes: 'சமையல் குறிப்புகள்',
    notesPlaceholder: 'எ.கா: காரம் குறைக்கவும், வெங்காயம் அதிகம்...',
    subtotal: 'மொத்த தொகை',
    taxesAndCharges: 'ஜிஎஸ்டி & சேவைக் கட்டணம்',
    totalPayable: 'செலுத்த வேண்டிய தொகை',
    placeOrder: 'ஆர்டர் செய்க',
    orderMore: 'கூடுதல் உணவு ஆர்டர்',
    callWaiter: 'சர்வரை அழைக்கவும்',
    waiterCalledToast: 'எங்கள் பணியாளர் உங்கள் மேஜைக்கு வருகிறார்!',
    playGameTitle: 'உணவு சமைக்கும் போது ஒரு விளையாட்டு விளையாடுங்கள்!',
    playGameSub: 'புள்ளிகள் வென்று இனிப்பு சலுகைகளைப் பெறுங்கள்.',
    playNow: 'விளையாடுங்கள்',
    viewBill: 'பில் பார்க்க & செலுத்த',
    orderStages: {
      sent: {
        title: 'சமையலறைக்கு அனுப்பப்பட்டது',
        desc: 'உங்கள் ஆர்டர் சமையலறைக்குச் சென்று சேர்ந்தது.',
      },
      accepted: {
        title: 'ஆர்டர் ஏற்கப்பட்டது',
        desc: 'தலைமை சமையல்காரர் உங்கள் ஆர்டரை ஏற்றுக்கொண்டார்.',
      },
      cooking: {
        title: 'சமைக்கப்படுகிறது',
        desc: 'சுவையான மசாலாக்களுடன் உணவு தயாராகிறது.',
      },
      ready: {
        title: 'பரிமாற தயார்',
        desc: 'சூடான உணவு உங்கள் மேஜைக்கு வரத் தயாராக உள்ளது.',
      },
      served: {
        title: 'சுவைத்து மகிழுங்கள்!',
        desc: 'உணவு பரிமாறப்பட்டது. இனிய உணவு நேரம்!',
      },
    },
    bill: {
      title: 'மேஜை பில் விவரம்',
      splitEqually: 'சமமாகப் பிரிக்கவும்',
      splitByItem: 'உணவு வாரியாக',
      customSplit: 'தனிப்பயன் தொகை',
      payOnline: 'யுபிஐ / கார்டு மூலம் செலுத்தவும்',
      payCounter: 'கவுண்டரில் செலுத்தவும்',
      paymentSuccess: 'பணம் செலுத்தப்பட்டது!',
      thankYou: 'டேபிள் ஃப்ளோவில் உணவருந்தியதற்கு நன்றி!',
    },
    onboarding: {
      step1Title: 'உணவை தேர்ந்தெடுக்கவும்',
      step1Desc: 'புகைப்படங்கள் மற்றும் காரக் குறியீடுகளுடன் உணவை தேர்வு செய்யுங்கள்.',
      step2Title: 'எளிதாக ஆர்டர் செய்யுங்கள்',
      step2Desc: 'காத்திருக்காமல் ஒரே தொடுதலில் ஆர்டர் செய்யவும்.',
      step3Title: 'சமையல் நிலையைக் கவனியுங்கள்',
      step3Desc: 'மேஜைக்கு வரும் வரையிலான நேரடி நிலையைப் பாருங்கள்.',
      getStarted: 'தொடங்கவும்',
      skip: 'தவிர்',
    },
  },
  hi: {
    welcomeLine: 'स्वागत है! अपनी पसंद का स्वादिष्ट भोजन चुनें।',
    tableLabel: 'मेज',
    searchPlaceholder: 'व्यंजन, बिरयानी, स्टार्टर्स खोजें...',
    categories: {
      specials: 'शेफ की पसंद',
      starters: 'स्टार्टर्स',
      mains: 'मुख्य भोजन',
      biryani: 'दम बिरयानी',
      desserts: 'मिठाइयां',
      drinks: 'पेय पदार्थ',
    },
    filterVeg: 'शुद्ध शाकाहारी',
    filterNonVeg: 'मांसाहारी',
    filterAll: 'सभी',
    addBtn: 'जोड़ें',
    soldOut: 'अभी उपलब्ध नहीं है',
    viewOrder: 'ऑर्डर देखें',
    itemsWord: 'आइटम',
    itemWord: 'आइटम',
    cartTitle: 'आपकी टेबल का ऑर्डर',
    emptyCart: 'आपकी थाली खाली है',
    emptyCartSub: 'मेनू से अपनी पसंद के व्यंजन यहाँ जोड़ें!',
    addSpecialNotes: 'शेफ के लिए निर्देश',
    notesPlaceholder: 'उदा. कम तीखा, अतिरिक्त प्याज, बिना धनिया...',
    subtotal: 'आइटम कुल',
    taxesAndCharges: 'जीएसटी और सेवा शुल्क',
    totalPayable: 'कुल देय राशि',
    placeOrder: 'ऑर्डर करें',
    orderMore: 'और ऑर्डर करें',
    callWaiter: 'वेटर को बुलाएं',
    waiterCalledToast: 'हमारा स्टाफ आपकी टेबल पर आ रहा है!',
    playGameTitle: 'खाना पकने तक एक मजेदार गेम खेलें!',
    playGameSub: 'पॉइंट्स जीतें और खास ऑफर्स पाएं।',
    playNow: 'गेम खेलें',
    viewBill: 'बिल देखें और भुगतान करें',
    orderStages: {
      sent: {
        title: 'रसोई में भेजा गया',
        desc: 'आपका ऑर्डर किचन स्क्रीन पर पहुंच चुका है।',
      },
      accepted: {
        title: 'स्वीकार किया गया',
        desc: 'मुख्य शेफ ने आपका ऑर्डर स्वीकार कर लिया है।',
      },
      cooking: {
        title: 'खाना पक रहा है',
        desc: 'ताजा मसालों के साथ आपका भोजन तैयार किया जा रहा है।',
      },
      ready: {
        title: 'परोसने के लिए तैयार',
        desc: 'गरमा-गरम खाना आपकी टेबल पर आने के लिए तैयार है।',
      },
      served: {
        title: 'आनंद लें!',
        desc: 'खाना परोस दिया गया है। स्वादिष्ट भोजन का आनंद लें!',
      },
    },
    bill: {
      title: 'टेबल का बिल',
      splitEqually: 'बराबर बांटें',
      splitByItem: 'आइटम के अनुसार',
      customSplit: 'अपनी पसंद की राशि',
      payOnline: 'यूपीआई / कार्ड से भुगतान करें',
      payCounter: 'काउंटर पर भुगतान करें',
      paymentSuccess: 'भुगतान सफल रहा!',
      thankYou: 'टेबल फ्लो में पधारने के लिए धन्यवाद!',
    },
    onboarding: {
      step1Title: 'खाना चुनें',
      step1Desc: 'तस्वीरों और तीखेपन के स्तर के साथ व्यंजन चुनें।',
      step2Title: 'एक टैप में ऑर्डर करें',
      step2Desc: 'बिना वेटर के इंतजार के तुरंत ऑर्डर भेजें।',
      step3Title: 'लाइव स्टेटस देखें',
      step3Desc: 'कड़ाही से टेबल तक हर चरण की जानकारी पाएं।',
      getStarted: 'ऑर्डर शुरू करें',
      skip: 'छोड़ें',
    },
  },
};
