import { AppItem } from "./types";

export const initialApps: AppItem[] = [
  {
    id: "khmer-dict",
    name: "Khmer Dictionary Pro",
    nameKhmer: "វចនានុក្រមខ្មែរជំនាន់ថ្មី",
    category: "Education",
    categoryKhmer: "ការអប់រំ",
    rating: 4.8,
    reviewsCount: 1240,
    developer: "Buddhist Institute of Cambodia",
    size: "45 MB",
    version: "3.2.1",
    description: "The ultimate modern Khmer-Khmer, Khmer-English dictionary with smart spell check, pronunciation audio, and high-performance search.",
    descriptionKhmer: "វចនានុក្រមខ្មែរ-ខ្មែរ និងខ្មែរ-អង់គ្លេសទំនើបបំផុតដែលមានប្រព័ន្ធពិនិត្យអក្ខរាវិរុទ្ធឆ្លាតវៃ សំឡេងបញ្ចេញ音 និងស្វែងរករហ័ស។",
    iconName: "BookOpen",
    isVerified: true,
    downloadCount: "250K+",
    lastUpdated: "June 24, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 100,
    permissions: ["Storage Access", "Internet Connection"],
    versionHistory: [
      {
        version: "3.2.1",
        date: "June 24, 2026",
        changes: ["Improved search index speed by 40%", "Fixed spellchecker bug with compound Khmer words", "Reduced app initial load time"],
        changesKhmer: ["បង្កើនល្បឿនស្វែងរកពាក្យលឿនជាងមុន ៤០%", "ជួសជុលកំហុសអក្ខរាវិរុទ្ធលើពាក្យផ្សំភាសាខ្មែរ", "កាត់បន្ថយពេលវេលាបើកដំណើរការកម្មវិធីដំបូង"]
      },
      {
        version: "3.1.0",
        date: "May 10, 2026",
        changes: ["Added high-quality audio pronunciation for over 5,000 words", "Introduced custom dictionary theme backgrounds"],
        changesKhmer: ["បន្ថែមសំឡេងបញ្ចេញសំឡេងច្បាស់ល្អជាង ៥,០០០ ពាក្យ", "ដាក់បញ្ចូលផ្ទៃខាងក្រោយរចនាថ្មីសម្រាប់វចនានុក្រម"]
      }
    ]
  },
  {
    id: "bakong-link",
    name: "Bakong Link & Pay",
    nameKhmer: "បាគង ផេ លីង",
    category: "Fintech",
    categoryKhmer: "ហិរញ្ញវត្ថុទំនើប",
    rating: 4.9,
    reviewsCount: 4890,
    developer: "National Bank of Cambodia (NBC)",
    size: "38 MB",
    version: "2.4.0",
    description: "Direct secure integration with the Bakong system. Send and receive money instantaneously using KHQR code scans.",
    descriptionKhmer: "ការរួមបញ្ចូលប្រព័ន្ធបាគងប្រកបដោយសុវត្ថិភាព។ ផ្ញើ និងទទួលប្រាក់ភ្លាមៗតាមរយៈការស្កែនកូដ KHQR ងាយស្រួល និងរហ័ស។",
    iconName: "Wallet",
    isVerified: true,
    downloadCount: "1.2M+",
    lastUpdated: "May 12, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 100,
    permissions: ["Camera (for KHQR)", "Biometric Auth", "Internet Connection"],
    versionHistory: [
      {
        version: "2.4.0",
        date: "May 12, 2026",
        changes: ["Added support for international cross-border KHQR codes", "Implemented biometric transaction speed improvements", "Enhanced security logging for compliance"],
        changesKhmer: ["បន្ថែមការគាំទ្រសម្រាប់កូដ KHQR អន្តរជាតិឆ្លងដែន", "កែលម្អល្បឿនប្រតិបត្តិការដោយប្រើជីវមាត្រ (ស្កែនមុខ/ម្រាមដៃ)", "ពង្រឹងសុវត្ថិភាពនិងការកត់ត្រាប្រតិបត្តិការឱ្យស្របតាមបទដ្ឋាន"]
      },
      {
        version: "2.3.5",
        date: "March 18, 2026",
        changes: ["Fixed transaction history display delays", "Minor UI spacing adjustments"],
        changesKhmer: ["ដោះស្រាយបញ្ហាយឺតយ៉ាវក្នុងការបង្ហាញប្រវត្តិប្រតិបត្តិការ", "ការកែលម្អគម្លាតប៊ូតុង និងរូបរាងទូទៅ"]
      }
    ]
  },
  {
    id: "krama-notes",
    name: "Krama Safe Notes",
    nameKhmer: "សៀវភៅកត់ត្រា ក្រមា",
    category: "Productivity",
    categoryKhmer: "ផលិតភាព",
    rating: 4.6,
    reviewsCount: 312,
    developer: "Sabaicode Labs",
    size: "12 MB",
    version: "1.0.8",
    description: "Minimalist note-taking application encrypted on-device. Write thoughts, draw sketches, and protect your private notes with high-level encryption.",
    descriptionKhmer: "កម្មវិធីកត់ត្រាបែបសាមញ្ញនិងទាក់ទាញភ្នែកដែលមានការកូដនីយកម្មលើឧបករណ៍។ កត់ត្រាគំនិត គូររូប និងការពារភាពឯកជនរបស់អ្នក។",
    iconName: "FileText",
    isVerified: true,
    downloadCount: "50K+",
    lastUpdated: "April 05, 2026",
    status: "installed", // Let's make some pre-installed to demonstrate update features
    downloadProgress: 0,
    fileSafetyScore: 99,
    permissions: ["Storage Access", "Biometric Auth"],
    versionHistory: [
      {
        version: "1.0.8",
        date: "April 05, 2026",
        changes: ["Added on-device backup key export features", "Improved dark mode readability and contrast", "Fixed file syncing issue with local storage"],
        changesKhmer: ["បន្ថែមមុខងារនាំចេញកូនសោចម្លងទុកដោយផ្ទាល់លើឧបករណ៍", "កែលម្អការអាននិងកម្រិតពន្លឺក្នុងមុខងារងងឹត (Dark Mode)", "ជួសជុលបញ្ហាស៊ីសង្វាក់ឯកសារជាមួយអង្គចងចាំមូលដ្ឋាន"]
      }
    ]
  },
  {
    id: "angkor-antivirus",
    name: "Angkor Guard Security",
    nameKhmer: "អង្គរហ្គាដ ការពារមេរោគ",
    category: "Utility",
    categoryKhmer: "ឧបករណ៍ប្រើប្រាស់",
    rating: 4.7,
    reviewsCount: 950,
    developer: "Cambodia Cyber Sec Group",
    size: "24 MB",
    version: "1.5.0",
    description: "Keep your system free from spywares, adware, and permission exploitation. Automatically runs integrity checks on all installed applications.",
    descriptionKhmer: "រក្សាឧបករណ៍របស់អ្នកឱ្យឆ្ងាយពីមេរោគ ចារកម្ម ការលួចទិន្នន័យ និងការបំពានសិទ្ធិផ្សេងៗ។ ដំណើរការត្រួតពិនិត្យដោយស្វ័យប្រវត្ត។",
    iconName: "ShieldAlert",
    isVerified: true,
    downloadCount: "340K+",
    lastUpdated: "June 29, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 100,
    permissions: ["Read Package State", "Storage Access"],
    versionHistory: [
      {
        version: "1.5.0",
        date: "June 29, 2026",
        changes: ["Added Real-Time Permission Guard for background apps", "Updated malware and spyware definition databases", "Optimized background battery consumption by 15%"],
        changesKhmer: ["បន្ថែមមុខងារការពារសិទ្ធិភ្លាមៗ (Real-Time Guard) សម្រាប់កម្មវិធីផ្ទៃក្រោយ", "ធ្វើបច្ចុប្បន្នភាពមូលដ្ឋានទិន្នន័យមេរោគ និងកម្មវិធីចារកម្មថ្មីៗបំផុត", "កាត់បន្ថយការប្រើប្រាស់ថ្មនៅផ្ទៃក្រោយរហូតដល់ ១៥%"]
      }
    ]
  },
  {
    id: "sabay-chess",
    name: "Sabay Ouk Chatrang",
    nameKhmer: "ល្បែងអុកខ្មែរ សប្បាយ",
    category: "Games",
    categoryKhmer: "ហ្គេម",
    rating: 4.5,
    reviewsCount: 780,
    developer: "Angkor Games Co.",
    size: "82 MB",
    version: "4.1.2",
    description: "The classic Khmer Chess (Ouk Chatrang) simulator. Play with local AI players or participate in multiplayer online matchmaking tournaments.",
    descriptionKhmer: "ល្បែងអុកខ្មែរបុរាណបែបឌីជីថល។ លេងជាមួយកុំព្យូទ័រវៃឆ្លាត (AI) ក្នុងស្រុក ឬចូលរួមការប្រកួតអនឡាញជាមួយអ្នកលេងផ្សេងទៀត។",
    iconName: "Gamepad2",
    isVerified: true,
    downloadCount: "100K+",
    lastUpdated: "February 18, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 98,
    permissions: ["Internet Connection", "Vibration Control"],
    versionHistory: [
      {
        version: "4.1.2",
        date: "February 18, 2026",
        changes: ["Added local Chess AI Level 5 (Grandmaster difficulty)", "Improved online matchmaking pairing algorithm", "Fixed board rotation bug during match restarts"],
        changesKhmer: ["បន្ថែមគូប្រកួត AI កម្រិតទី៥ (កម្រិតកំពូល Grandmaster)", "កែលម្អប្រព័ន្ធស្វែងរកគូប្រកួតលេងអនឡាញឱ្យលឿនជាងមុន", "ជួសជុលបញ្ហាការបង្វិលក្តារអុកពេលចាប់ផ្តើមប្រកួតឡើងវិញ"]
      }
    ]
  },
  {
    id: "pp-transit",
    name: "Phnom Penh Transit Map",
    nameKhmer: "ផែនទីឡានក្រុងភ្នំពេញ",
    category: "Utility",
    categoryKhmer: "ឧបករណ៍ប្រើប្រាស់",
    rating: 4.4,
    reviewsCount: 215,
    developer: "Phnom Penh Municipality",
    size: "18 MB",
    version: "2.0.1",
    description: "Real-time tracking of public city buses, arrivals, route schedules, and ticket pricing details for convenient transit within the capital.",
    descriptionKhmer: "តាមដានឡានក្រុងសាធារណៈភ្លាមៗ (Real-time) ពេលវេលាមកដល់ តារាងម៉ោងធ្វើដំណើរ និងតម្លៃសំបុត្រសម្រាប់ទីក្រុងភ្នំពេញ។",
    iconName: "Map",
    isVerified: true,
    downloadCount: "80K+",
    lastUpdated: "May 30, 2026",
    status: "update_available", // Set this to update available to show automatic/manual update flows
    downloadProgress: 0,
    fileSafetyScore: 97,
    permissions: ["Geolocation Access", "Internet Connection"],
    versionHistory: [
      {
        version: "2.0.1",
        date: "May 30, 2026",
        changes: ["Added real-time bus locations on GPS interactive map", "Introduced Khmer TTS voice alerts for bus arrivals", "Optimized data consumption for slower connections"],
        changesKhmer: ["បង្ហាញទីតាំងឡានក្រុងផ្ទាល់លើផែនទីអន្តរកម្ម GPS", "ដាក់បញ្ចូលប្រព័ន្ធប្រកាសជាសំឡេងភាសាខ្មែរសម្រាប់ការមកដល់", "កាត់បន្ថយការប្រើប្រាស់ទិន្នន័យអ៊ីនធឺណិតសម្រាប់ការតភ្ជាប់ខ្សោយ"]
      },
      {
        version: "1.9.0",
        date: "April 15, 2026",
        changes: ["Added route planning schedule optimizer", "Updated municipal fare structure documentation"],
        changesKhmer: ["បន្ថែមកម្មវិធីបង្កើនប្រសិទ្ធភាពតារាងម៉ោងធ្វើដំណើរ", "ធ្វើបច្ចុប្បន្នភាពព័ត៌មានតម្លៃសំបុត្រឡានក្រុងក្រុងភ្នំពេញ"]
      }
    ]
  },
  {
    id: "khmer-music-box",
    name: "Pleng Khmer Player",
    nameKhmer: "ភ្លេងខ្មែរ ផ្លេយ័រ",
    category: "Games", // Let's put in Games / Entertainment
    categoryKhmer: "កម្សាន្ត",
    rating: 4.3,
    reviewsCount: 1620,
    developer: "Pleng Media Group",
    size: "35 MB",
    version: "5.0.3",
    description: "Listen to thousands of classic Khmer golden age hits alongside brand new releases by modern indie artists.",
    descriptionKhmer: "ស្តាប់បទចម្រៀងខ្មែររាប់ពាន់បទ ចាប់ពីសម័យមាស រហូតដល់បទចម្រៀងយុវវ័យថ្មីៗ ជាមួយគុណភាពសំឡេងកម្រិតខ្ពស់។",
    iconName: "Music",
    isVerified: true,
    downloadCount: "850K+",
    lastUpdated: "June 02, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 98,
    permissions: ["Internet Connection", "Audio/Media Output"],
    versionHistory: [
      {
        version: "5.0.3",
        date: "June 02, 2026",
        changes: ["Major offline music synchronization improvements", "Added streaming support for Hi-Fi lossless audio format", "Added widget control for device home lock screens"],
        changesKhmer: ["កែលម្អការទាញយកតន្ត្រីទុកស្តាប់ក្រៅបណ្តាញ (Offline Music Sync)", "បន្ថែមការស្តាប់សំឡេងកម្រិតច្បាស់ខ្ពស់ឥតបាត់បង់ (Hi-Fi Lossless)", "បន្ថែមផ្ទាំងបញ្ជាកម្មវិធីតន្ត្រីលើអេក្រង់ចាក់សោរទូរស័ព្ទ"]
      }
    ]
  },
  {
    id: "angkor-odyssey",
    name: "Angkor Odyssey Adventure",
    nameKhmer: "ដំណើរផ្សងព្រេងអង្គរ",
    category: "Games",
    categoryKhmer: "ហ្គេម",
    rating: 4.9,
    reviewsCount: 2315,
    developer: "Nokor Studios",
    size: "240 MB",
    version: "1.0.2",
    description: "Immersive 3D open-world history exploration game of the Khmer Empire. Solve riddles, collect ancient relics, and explore legendary temples.",
    descriptionKhmer: "ហ្គេមផ្សងព្រេងបែបប្រវត្តិសាស្ត្រលក្ខណៈ 3D ស្វែងយល់ពីអាណាចក្រខ្មែរដ៏រុងរឿង ដោះស្រាយប្រស្នា និងទស្សនាប្រាសាទបុរាណ។",
    iconName: "Compass",
    isVerified: true,
    downloadCount: "500K+",
    lastUpdated: "January 14, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 100,
    permissions: ["Storage Access", "Internet Connection (Optional)"],
    versionHistory: [
      {
        version: "1.0.2",
        date: "January 14, 2026",
        changes: ["New historic expansion chapter detailing the Preah Vihear Temple storyline", "Fixed visual shadows glitch on modern mobile processors", "Performance optimization for mid-range and budget smartphones"],
        changesKhmer: ["បន្ថែមដំណើររឿងស្វែងរកបុរាណថ្មីនៅប្រាសាទព្រះវិហារ", "ជួសជុលបញ្ហាស្រមោល និងពន្លឺសម្រាប់ទូរស័ព្ទទំនើបៗ", "កែលម្អការដំណើរការហ្គេមឱ្យកាន់តែរលូនសម្រាប់ទូរស័ព្ទកម្រិតមធ្យម"]
      }
    ]
  },
  {
    id: "phsar-khmer",
    name: "Phsar Khmer Market",
    nameKhmer: "ផ្សារខ្មែរ ម៉ាកឃីត",
    category: "E-commerce",
    categoryKhmer: "ពាណិជ្ជកម្មអេឡិចត្រូនិច",
    rating: 4.7,
    reviewsCount: 345,
    developer: "Khmer Retail Tech",
    size: "28 MB",
    version: "1.1.0",
    description: "Leading online shopping platform in Cambodia. Buy local products, clothes, electronic goods, and enjoy fast home delivery with local payment support.",
    descriptionKhmer: "ផ្លេតហ្វមទិញទំនិញអនឡាញឈានមុខគេនៅកម្ពុជា។ ទិញផលិតផលក្នុងស្រុក សម្លៀកបំពាក់ គ្រឿងអេឡិចត្រូនិច និងទទួលបានសេវាដឹកជញ្ជូនរហ័ស។",
    iconName: "ShoppingBag",
    isVerified: true,
    downloadCount: "120K+",
    lastUpdated: "June 20, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 99,
    permissions: ["Storage Access", "Internet Connection", "Location Services"],
    versionHistory: [
      {
        version: "1.1.0",
        date: "June 20, 2026",
        changes: ["Added seamless direct payment via Bakong KHQR checkout", "Implemented real-time delivery courier location tracking on map", "Optimized image loading for faster shopping and lower data usage"],
        changesKhmer: ["បន្ថែមការទូទាត់ប្រាក់ដោយផ្ទាល់ភ្លាមៗតាមរយៈ KHQR របស់បាគង", "បន្ថែមការតាមដានអ្នកដឹកជញ្ជូនផ្ទាល់លើផែនទីក្នុងកម្មវិធី", "កាត់បន្ថយការប្រើប្រាស់អ៊ីនធឺណិតដោយបង្កើនល្បឿនបង្ហោះរូបភាពទំនិញ"]
      }
    ]
  },
  {
    id: "angkor-lens",
    name: "Angkor Lens Studio",
    nameKhmer: "ស្ទូឌីយ៉ូថតរូប អង្គរឡេន",
    category: "Photography",
    categoryKhmer: "រូបថត",
    rating: 4.8,
    reviewsCount: 156,
    developer: "Nokor Creative",
    size: "52 MB",
    version: "1.2.0",
    description: "Professional photo editor with custom Khmer filters, historic temple presets, and high-quality exposure tools designed for Cambodian scenery.",
    descriptionKhmer: "កម្មវិធីកែសម្រួលរូបភាពអាជីពដែលមានតម្រងពណ៌បែបវប្បធម៌ខ្មែរ ស្ទីលរូបភាពប្រាសាទបុរាណ និងឧបករណ៍កម្រិតពន្លឺខ្ពស់ដែលរចនាឡើងសម្រាប់ទេសភាពប្រទេសកម្ពុជា។",
    iconName: "Camera",
    isVerified: true,
    downloadCount: "45K+",
    lastUpdated: "June 15, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 100,
    permissions: ["Camera Access", "Storage Access"],
    versionHistory: [
      {
        version: "1.2.0",
        date: "June 15, 2026",
        changes: ["Added Preah Vihear Sunset filter", "Improved portrait detail enhancement", "Fixed photo saving delay on Android 14"],
        changesKhmer: ["បន្ថែមតម្រងពណ៌ថ្ងៃលិចប្រាសាទព្រះវិហារ", "កែលម្អការបង្កើនភាពច្បាស់នៃរូបថតមនុស្ស", "ដោះស្រាយបញ្ហាយឺតយ៉ាវពេលរក្សាទុករូបថតលើប្រព័ន្ធប្រតិបត្តិការ Android 14"]
      }
    ]
  },
  {
    id: "khmer-health-care",
    name: "Khmer Health Guard",
    nameKhmer: "ថែទាំសុខភាពខ្មែរ",
    category: "Health",
    categoryKhmer: "សុខភាព",
    rating: 4.7,
    reviewsCount: 220,
    developer: "Cambodia e-Health Initiative",
    size: "34 MB",
    version: "2.1.5",
    description: "Comprehensive healthcare companion. Track your daily steps, monitor water intake, access local medical directory, and read verified wellness tips in Khmer.",
    descriptionKhmer: "ជំនួយការថែទាំសុខភាពទូទៅ។ តាមដានជំហានដើរប្រចាំថ្ងៃ ការទទួលទានទឹក ស្វែងរកអាសយដ្ឋានមន្ទីរពេទ្យ និងគន្លឹះថែទាំសុខភាពដែលបានផ្ទៀងផ្ទាត់ជាភាសាខ្មែរ។",
    iconName: "Heart",
    isVerified: true,
    downloadCount: "90K+",
    lastUpdated: "July 01, 2026",
    status: "not_installed",
    downloadProgress: 0,
    fileSafetyScore: 100,
    permissions: ["Physical Activity Tracking", "Internet Connection", "Notification Access"],
    versionHistory: [
      {
        version: "2.1.5",
        date: "July 01, 2026",
        changes: ["Added daily step counter widget", "Updated emergency medical contact list for 25 provinces", "Improved notification reminder system"],
        changesKhmer: ["បន្ថែម Widget រាប់ជំហានដើរប្រចាំថ្ងៃ", "ធ្វើបច្ចុប្បន្នភាពលេខទំនាក់ទំនងសង្គ្រោះបន្ទាន់ទូទាំង ២៥ ខេត្តក្រុង", "កែលម្អប្រព័ន្ធរំលឹកសារឲ្យកាន់តែប្រសើរឡើង"]
      }
    ]
  }
];
