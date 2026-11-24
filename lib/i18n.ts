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
  orderHistory: string;
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
  reviews: {
    title: string;
    subtitle: string;
    overallRating: string;
    foodQuality: string;
    ambiance: string;
    serviceHospitality: string;
    selectTags: string;
    commentPlaceholder: string;
    submitReview: string;
    reviewSuccess: string;
    recentFeedback: string;
  };
  water: {
    title: string;
    requestWater: string;
    normal: string;
    chilled: string;
    warm: string;
    mineral: string;
    dispatchedToast: string;
    waterTankTitle: string;
    tankLevel: string;
    roHealth: string;
    refillTank: string;
  };
  cleanTable: {
    cleanTableBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    wipeTable: string;
    clearPlates: string;
    spillCleanup: string;
    freshCutlery: string;
    quickCleanPrompt: string;
    requestSentToast: string;
    cancel: string;
    confirmBtn: string;
    waiterCleaningAlert: string;
    markCleaned: string;
    cleaningActiveBadge: string;
  };
  security: {
    badge: string;
    title: string;
    subtitle: string;
    enterPin: string;
    pinPlaceholder: string;
    joinTable: string;
    lockedDesc: string;
    unlockedSuccess: string;
    securityDashboard: string;
    activeSessions: string;
    lockTable: string;
    resetSession: string;
  };
  stock: {
    title: string;
    subtitle: string;
    inStock: string;
    lowStock: string;
    critical: string;
    restockBtn: string;
    costPerUnit: string;
    lastRestocked: string;
  };
  production: {
    title: string;
    batchSummary: string;
    liveStations: string;
    allStations: string;
    tandoor: string;
    wok: string;
    biryani: string;
    breads: string;
    bar: string;
  };
  admin: {
    totalRevenue: string;
    itemsSold: string;
    grossProfit: string;
    profitMargin: string;
    avgRating: string;
    overviewTab: string;
    productionTab: string;
    stockTab: string;
    securityTab: string;
    reviewsTab: string;
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
    orderHistory: 'Order History',
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
    reviews: {
      title: 'Rate Your Dining Experience',
      subtitle: 'Help us celebrate what was delicious and elevate your next feast.',
      overallRating: 'Overall Dining Experience',
      foodQuality: 'Food Taste & Flavors',
      ambiance: 'Ambiance & Atmosphere',
      serviceHospitality: 'Service & Hospitality',
      selectTags: 'Highlight what you loved',
      commentPlaceholder: 'Tell the head chef what made your meal memorable...',
      submitReview: 'Submit Review & Feedback',
      reviewSuccess: 'Thank you! Your feedback reached our team.',
      recentFeedback: 'Guest Reviews & Ratings',
    },
    water: {
      title: 'Table Water Request',
      requestWater: 'Request Water',
      normal: 'Room Temp Water',
      chilled: 'Chilled Water',
      warm: 'Warm Water',
      mineral: 'Packaged Mineral Water',
      dispatchedToast: 'Water request dispatched to your table captain!',
      waterTankTitle: 'Commercial Water Tank & RO Plant',
      tankLevel: 'Water Tank Level',
      roHealth: 'RO Filtration Health',
      refillTank: 'Refill Water Tank',
    },
    cleanTable: {
      cleanTableBtn: 'Clean Table',
      modalTitle: 'Request Table Cleaning',
      modalSubtitle: 'Let our floor captain know how we can freshen up your table.',
      wipeTable: 'Wipe & Sanitize Table Surface',
      clearPlates: 'Clear Used Plates & Bowls',
      spillCleanup: 'Clean Liquid / Beverage Spill',
      freshCutlery: 'Fresh Cutlery & Napkins',
      quickCleanPrompt: 'Our floor captain will arrive promptly to assist with table cleaning.',
      requestSentToast: 'Cleaning request dispatched! Captain will arrive at your table shortly.',
      cancel: 'Cancel',
      confirmBtn: 'Request Cleaning',
      waiterCleaningAlert: 'Table Needs Cleaning',
      markCleaned: 'Mark Table Cleaned',
      cleaningActiveBadge: 'Cleaning Requested',
    },
    security: {
      badge: 'Active ODG Session',
      title: 'Table Session Protected',
      subtitle: 'This table is currently occupied by an active dining party.',
      enterPin: 'Enter Table Passcode or Scan PIN',
      pinPlaceholder: '4-digit Table PIN (e.g. 4107)',
      joinTable: 'Verify & Join Table Session',
      lockedDesc: 'Unauthorized devices cannot modify the bill or place phantom orders.',
      unlockedSuccess: 'Session Verified! Welcome to the table feast.',
      securityDashboard: 'QR & ODG Table Security',
      activeSessions: 'Active Floor Sessions',
      lockTable: 'Lock Table',
      resetSession: 'Reset Session',
    },
    stock: {
      title: 'Inventory & Stock Maintenance',
      subtitle: 'Real-time commodity reserves, utility tracking & reorder alerts',
      inStock: 'Optimal Stock',
      lowStock: 'Low Stock Alert',
      critical: 'Critical Shortage',
      restockBtn: 'Quick Restock',
      costPerUnit: 'Cost per Unit',
      lastRestocked: 'Last Restocked',
    },
    production: {
      title: 'Kitchen Production & Station Routing',
      batchSummary: 'Live Batch Production Summary',
      liveStations: 'Active Kitchen Stations',
      allStations: 'All Stations',
      tandoor: 'Tandoor & Charcoal',
      wok: 'Curry & Wok',
      biryani: 'Dum Biryani Handi',
      breads: 'Tandoor Breads',
      bar: 'Beverages & Desserts',
    },
    admin: {
      totalRevenue: 'Total Revenue Spent',
      itemsSold: 'Dishes Sold Today',
      grossProfit: 'Estimated Gross Profit',
      profitMargin: 'Gross Profit Margin',
      avgRating: 'Average Guest Rating',
      overviewTab: 'Overview & Sales',
      productionTab: 'Kitchen Production',
      stockTab: 'Stock & Water Tank',
      securityTab: 'Table Security (ODG)',
      reviewsTab: 'Guest Reviews',
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
    orderHistory: 'ఆర్డర్ చరిత్ర',
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
    reviews: {
      title: 'భోజన అనుభవాన్ని సమీక్షించండి',
      subtitle: 'రుచులు మరియు సేవ ఎలా ఉన్నాయో మీ విలువైన అభిప్రాయం తెలియజేయండి.',
      overallRating: 'మొత్తం భోజన అనుభవం',
      foodQuality: 'ఆహార రుచి & నాణ్యత',
      ambiance: 'వాతావరణం & పరిశుభ్రత',
      serviceHospitality: 'సేవ & ఆతిథ్యం',
      selectTags: 'మీకు నచ్చిన అంశాలు',
      commentPlaceholder: 'చెఫ్‌కు మీ అభిప్రాయాన్ని చెప్పండి...',
      submitReview: 'సమీక్షను సమర్పించండి',
      reviewSuccess: 'ధన్యవాదాలు! మీ సమీక్ష నమోదు చేయబడింది.',
      recentFeedback: 'అతిథుల సమీక్షలు & రేటింగ్‌లు',
    },
    water: {
      title: 'నీటి అభ్యర్థన',
      requestWater: 'నీరు కావాలి',
      normal: 'సాధారణ నీరు',
      chilled: 'చల్లని నీరు',
      warm: 'గోరువెచ్చని నీరు',
      mineral: 'ప్యాకేజ్డ్ మినరల్ వాటర్',
      dispatchedToast: 'మీ టేబుల్‌కు నీటి అభ్యర్థన పంపబడింది!',
      waterTankTitle: 'రెస్టారెంట్ వాటర్ ట్యాంక్ & ఆర్వో ప్లాంట్',
      tankLevel: 'వాటర్ ట్యాంక్ స్థాయి',
      roHealth: 'ఆర్వో ఫిల్టర్ నాణ్యత',
      refillTank: 'ట్యాంక్ రీఫిల్ చేయండి',
    },
    cleanTable: {
      cleanTableBtn: 'టేబుల్ క్లీన్ చేయండి',
      modalTitle: 'టేబుల్ క్లీనింగ్ రిక్వెస్ట్',
      modalSubtitle: 'మీ టేబుల్‌ను శుభ్రం చేయడానికి ఫ్లోర్ కెప్టెన్‌కు తెలియజేయండి.',
      wipeTable: 'టేబుల్ తుడవడం & శానిటైజ్ చేయడం',
      clearPlates: 'ఖాళీ ప్లేట్లు & గిన్నెలు తీసివేయండి',
      spillCleanup: 'పారిన పానీయం శుభ్రం చేయండి',
      freshCutlery: 'కొత్త స్పూన్లు & నాప్‌కిన్లు',
      quickCleanPrompt: 'కెప్టెన్ త్వరలో మీ టేబుల్ వద్దకు వచ్చి క్లీన్ చేస్తారు.',
      requestSentToast: 'క్లీనింగ్ అభ్యర్థన పంపబడింది! కెప్టెన్ వెంటనే వస్తారు.',
      cancel: 'రద్దు చేయండి',
      confirmBtn: 'క్లీనింగ్ కోరండి',
      waiterCleaningAlert: 'టేబుల్ క్లీనింగ్ అవసరం',
      markCleaned: 'క్లీన్ చేసినట్లు గుర్తించండి',
      cleaningActiveBadge: 'క్లీనింగ్ కోరబడింది',
    },
    security: {
      badge: 'యాక్టివ్ డైనింగ్ సెషన్',
      title: 'టేబుల్ సెషన్ రక్షించబడింది',
      subtitle: 'ఈ టేబుల్ ప్రస్తుతం వేరొక అతిథి సెషన్‌లో ఉంది.',
      enterPin: 'టేబుల్ సెక్యూరిటీ పిన్ నమోదు చేయండి',
      pinPlaceholder: '4 అంకెల పిన్ (ఉదా: 4107)',
      joinTable: 'ధృవీకరించి టేబుల్‌లో చేరండి',
      lockedDesc: 'అనధికారిక వ్యక్తులు ఆర్డర్ మార్పులు చేయలేరు.',
      unlockedSuccess: 'ధృవీకరించబడింది! స్వాగతం.',
      securityDashboard: 'టేబుల్ సెక్యూరిటీ & ODG రక్షణ',
      activeSessions: 'ప్రస్తుత ఫ్లోర్ సెషన్లు',
      lockTable: 'టేబుల్ లాక్ చేయండి',
      resetSession: 'సెషన్ రీసెట్ చేయండి',
    },
    stock: {
      title: 'స్టాక్ & ఇన్వెంటరీ నిర్వహణ',
      subtitle: 'ముడి పదార్థాల నిల్వలు మరియు వాటర్ ట్యాంక్ పర్యవేక్షణ',
      inStock: 'తగినంత నిల్వ ఉంది',
      lowStock: 'తక్కువ నిల్వ హెచ్చరిక',
      critical: 'తీవ్ర కొరత',
      restockBtn: 'వెంటనే రీస్టాక్ చేయండి',
      costPerUnit: 'యూనిట్ ఖర్చు',
      lastRestocked: 'చివరి రీస్టాక్ తేదీ',
    },
    production: {
      title: 'కిచెన్ ప్రొడక్షన్ & స్టేషన్ రౌటింగ్',
      batchSummary: 'లైవ్ బ్యాచ్ ప్రొడక్షన్ సారాంశం',
      liveStations: 'వంటగది స్టేషన్లు',
      allStations: 'అన్ని స్టేషన్లు',
      tandoor: 'తందూరీ నిప్పులు',
      wok: 'కర్రీ & కడాయి',
      biryani: 'దమ్ బిర్యానీ హాండీ',
      breads: 'రోటీ & నాన్',
      bar: 'పానీయాలు & మిఠాయిలు',
    },
    admin: {
      totalRevenue: 'మొత్తం అమ్మకాల ఆదాయం',
      itemsSold: 'ఈరోజు అమ్ముడైన వంటకాలు',
      grossProfit: 'అంచనా వేసిన స్థూల లాభం',
      profitMargin: 'లాభ శాతం',
      avgRating: 'సగటు అతిథి రేటింగ్',
      overviewTab: 'అమ్మకాలు & సమీక్ష',
      productionTab: 'కిచెన్ ప్రొడక్షన్',
      stockTab: 'స్టాక్ & వాటర్ ట్యాంక్',
      securityTab: 'సెక్యూరిటీ (ODG)',
      reviewsTab: 'కస్టమర్ రివ్యూలు',
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
    orderHistory: 'ஆர்டர் வரலாறு',
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
    reviews: {
      title: 'உணவு அனுபவத்தை மதிப்பிடுங்கள்',
      subtitle: 'சுவை மற்றும் உபசரிப்பு பற்றிய உங்கள் கருத்தைப் பகிருங்கள்.',
      overallRating: 'ஒட்டுமொத்த உணவு அனுபவம்',
      foodQuality: 'உணவு சுவை & தரம்',
      ambiance: 'சுற்றுச்சூழல் & தூய்மை',
      serviceHospitality: 'சேவை & உபசரிப்பு',
      selectTags: 'உங்களுக்குப் பிடித்த சிறப்பம்சங்கள்',
      commentPlaceholder: 'உங்கள் கருத்துக்களைப் பகிருங்கள்...',
      submitReview: 'மதிப்பாய்வைச் சமர்ப்பிக்கவும்',
      reviewSuccess: 'நன்றி! உங்கள் கருத்து பதிவு செய்யப்பட்டது.',
      recentFeedback: 'விருந்தினர் மதிப்புரைகள் & மதிப்பீடுகள்',
    },
    water: {
      title: 'தண்ணீர் தேவை',
      requestWater: 'தண்ணீர் கோரிக்கை',
      normal: 'சாதாரண தண்ணீர்',
      chilled: 'குளிர்ந்த தண்ணீர்',
      warm: 'வெதுவெதுப்பான தண்ணீர்',
      mineral: 'மினரல் வாட்டர் பாட்டில்',
      dispatchedToast: 'தண்ணீர் கோரிக்கை அனுப்பப்பட்டது!',
      waterTankTitle: 'நீர் தொட்டி & சுத்திகரிப்பு அமைப்பு',
      tankLevel: 'தொட்டி நீர் அளவு',
      roHealth: 'வடிகட்டி தரம்',
      refillTank: 'தொட்டியை நிரப்பவும்',
    },
    cleanTable: {
      cleanTableBtn: 'மேசையை சுத்தம் செய்க',
      modalTitle: 'மேஜை சுத்தம் செய்யும் கோரிக்கை',
      modalSubtitle: 'உங்கள் மேஜையை சுத்தம் செய்ய பணியாளருக்கு தெரிவிக்கவும்.',
      wipeTable: 'மேஜையை துடைத்து சுத்தம் செய்க',
      clearPlates: 'காலியான தட்டுகளை அகற்றுக',
      spillCleanup: 'சிந்தியதை சுத்தம் செய்க',
      freshCutlery: 'புதிய கரண்டிகள் & துடைப்பான்கள்',
      quickCleanPrompt: 'பணியாளர் விரைவில் வந்து மேஜையை சுத்தம் செய்வார்.',
      requestSentToast: 'சுத்தம் செய்ய கோரிக்கை அனுப்பப்பட்டது! பணியாளர் விரைவில் வருவார்.',
      cancel: 'ரத்துசெய்',
      confirmBtn: 'சுத்தம் செய்யக் கோருக',
      waiterCleaningAlert: 'மேஜை சுத்தம் செய்யப்பட வேண்டும்',
      markCleaned: 'சுத்தம் செய்யப்பட்டதாக குறிக்கவும்',
      cleaningActiveBadge: 'சுத்தம் செய்யக் கோரப்பட்டது',
    },
    security: {
      badge: 'செயலில் உள்ள உணவு அமர்வு',
      title: 'மேஜை அமர்வு பாதுகாக்கப்பட்டுள்ளது',
      subtitle: 'இந்த மேஜை ஏற்கனவே விருந்தினர் பயன்பாட்டில் உள்ளது.',
      enterPin: 'மேஜை கடவுச்சொல் (PIN) உள்ளிடவும்',
      pinPlaceholder: '4 இலக்க பின் (எ.கா. 4107)',
      joinTable: 'சரிபார்த்து மேஜையில் இணையுங்கள்',
      lockedDesc: 'அனுமதியற்ற நபர்கள் ஆர்டரை மாற்ற முடியாது.',
      unlockedSuccess: 'சரிபார்க்கப்பட்டது! நல்வரவு.',
      securityDashboard: 'மேஜை பாதுகாப்பு மற்றும் ODG முறைமை',
      activeSessions: 'செயலில் உள்ள அமர்வுகள்',
      lockTable: 'பூட்டு செய்க',
      resetSession: 'மீட்டமைக்க',
    },
    stock: {
      title: 'பொருட்கள் இருப்பு மேலாண்மை',
      subtitle: 'மூலப்பொருட்கள் இருப்பு மற்றும் நீர் தொட்டி கண்காணிப்பு',
      inStock: 'போதுமான இருப்பு',
      lowStock: 'குறைந்த இருப்பு எச்சரிக்கை',
      critical: 'அவசர தட்டுப்பாடு',
      restockBtn: 'உடனடி இருப்பு நிரப்பு',
      costPerUnit: 'யூனிட் விலை',
      lastRestocked: 'கடைசியாக நிரப்பப்பட்ட தேதி',
    },
    production: {
      title: 'சமையலறை தயாரிப்பு மற்றும் நிலைகள்',
      batchSummary: 'மொத்த தயாரிப்பு சுருக்கம்',
      liveStations: 'சமையல் நிலைகள்',
      allStations: 'அனைத்து நிலைகள்',
      tandoor: 'தந்தூரி அடுப்பு',
      wok: 'கிரேவி & கடாய்',
      biryani: 'தம் பிரியாணி பாண்டம்',
      breads: 'ரோட்டி & நான்',
      bar: 'பானங்கள் & இனிப்புகள்',
    },
    admin: {
      totalRevenue: 'மொத்த வருமானம்',
      itemsSold: 'விற்பனையான உணவுகள்',
      grossProfit: 'மதிப்பிடப்பட்ட மொத்த லாபம்',
      profitMargin: 'லாப வரம்பு',
      avgRating: 'சராசரி மதிப்பீடு',
      overviewTab: 'கண்ணோட்டம் & விற்பனை',
      productionTab: 'சமையல் தயாரிப்பு',
      stockTab: 'இருப்பு & நீர் தொட்டி',
      securityTab: 'மேஜை பாதுகாப்பு (ODG)',
      reviewsTab: 'மதிப்புரைகள்',
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
    orderHistory: 'ऑर्डर इतिहास',
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
    reviews: {
      title: 'भोजन अनुभव की समीक्षा करें',
      subtitle: 'आपके सुझाव हमारे शेफ और स्टाफ को और बेहतर सेवा देने में मदद करते हैं।',
      overallRating: 'समग्र भोजन अनुभव',
      foodQuality: 'स्वाद और गुणवत्ता',
      ambiance: 'माहौल और स्वच्छता',
      serviceHospitality: 'स्टाफ सेवा और शिष्टाचार',
      selectTags: 'आपको क्या सबसे अच्छा लगा',
      commentPlaceholder: 'शेफ और रेस्टोरेंट के लिए अपनी टिप्पणी लिखें...',
      submitReview: 'समीक्षा जमा करें',
      reviewSuccess: 'धन्यवाद! आपकी समीक्षा दर्ज कर ली गई है।',
      recentFeedback: 'अतिथि समीक्षाएं और रेटिंग',
    },
    water: {
      title: 'पानी का अनुरोध',
      requestWater: 'पानी मंगाएं',
      normal: 'सामान्य पानी',
      chilled: 'ठंडा पानी',
      warm: 'हल्का गरम पानी',
      mineral: 'मिनरल वाटर बोतल',
      dispatchedToast: 'आपकी टेबल पर पानी भेजा जा रहा है!',
      waterTankTitle: 'कमर्शियल वाटर टैंक और आरओ प्लांट',
      tankLevel: 'टैंक जल स्तर',
      roHealth: 'आरओ फिल्टर गुणवत्ता',
      refillTank: 'टैंक रिफिल करें',
    },
    cleanTable: {
      cleanTableBtn: 'टेबल साफ करें',
      modalTitle: 'टेबल सफाई का अनुरोध',
      modalSubtitle: 'अपनी टेबल को साफ करवाने के लिए कैप्टन को सूचित करें।',
      wipeTable: 'टेबल पोंछें और साफ करें',
      clearPlates: 'खाली प्लेटें और कटोरियां हटाएं',
      spillCleanup: 'गिरा हुआ पानी/ड्रिंक साफ करें',
      freshCutlery: 'ताजा कटलरी और नैपकिन',
      quickCleanPrompt: 'कैप्टन तुरंत आकर आपकी टेबल को साफ करेंगे।',
      requestSentToast: 'सफाई का अनुरोध भेजा गया! कैप्टन शीघ्र ही उपस्थित होंगे।',
      cancel: 'रद्द करें',
      confirmBtn: 'सफाई का अनुरोध करें',
      waiterCleaningAlert: 'टेबल सफाई की आवश्यकता है',
      markCleaned: 'साफ किया गया चिह्नित करें',
      cleaningActiveBadge: 'सफाई का अनुरोध किया गया',
    },
    security: {
      badge: 'सक्रिय डाइनिंग सत्र',
      title: 'टेबल सत्र सुरक्षित है',
      subtitle: 'इस टेबल पर पहले से ग्राहक भोजन कर रहे हैं।',
      enterPin: 'टेबल पासकोड (पिन) दर्ज करें',
      pinPlaceholder: '4 अंकों का पिन (उदा. 4107)',
      joinTable: 'सत्यापित करें और टेबल से जुड़ें',
      lockedDesc: 'अनधिकृत व्यक्ति बिल या ऑर्डर में छेड़छाड़ नहीं कर सकते।',
      unlockedSuccess: 'सत्यापित! टेबल में आपका स्वागत है।',
      securityDashboard: 'टेबल सुरक्षा और ODG सुरक्षा प्रणाली',
      activeSessions: 'सक्रिय फ्लोर सत्र',
      lockTable: 'टेबल लॉक करें',
      resetSession: 'सत्र रीसेट करें',
    },
    stock: {
      title: 'स्टॉक और इन्वेंट्री प्रबंधन',
      subtitle: 'कच्चे माल और रेस्टोरेंट वाटर टैंक की लाइव स्थिति',
      inStock: 'उपयुक्त स्टॉक',
      lowStock: 'कम स्टॉक चेतावनी',
      critical: 'गंभीर कमी',
      restockBtn: 'तुरंत स्टॉक भरें',
      costPerUnit: 'प्रति इकाई लागत',
      lastRestocked: 'अंतिम रीस्टॉक तारीख',
    },
    production: {
      title: 'किचन प्रोडक्शन और स्टेशन रूटिंग',
      batchSummary: 'लाइव बैच प्रोडक्शन सारांश',
      liveStations: 'सक्रिय किचन स्टेशन',
      allStations: 'सभी स्टेशन',
      tandoor: 'तंदूर और अंगीठी',
      wok: 'कड़ाही और ग्रेवी',
      biryani: 'दम बिरयानी हांडी',
      breads: 'नान और रोटी',
      bar: 'पेय और मिठाइयां',
    },
    admin: {
      totalRevenue: 'कुल बिक्री राजस्व',
      itemsSold: 'आज बेचे गए व्यंजन',
      grossProfit: 'अनुमानित सकल लाभ',
      profitMargin: 'लाभ मार्जिन',
      avgRating: 'औसत ग्राहक रेटिंग',
      overviewTab: 'बिक्री और समीक्षा',
      productionTab: 'किचन प्रोडक्शन',
      stockTab: 'स्टॉक और वाटर टैंक',
      securityTab: 'टेबल सुरक्षा (ODG)',
      reviewsTab: 'ग्राहक समीक्षाएं',
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
