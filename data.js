// Realistic 6-Month Dataset (June – November 2026) for Margao Fitness & Strength Club
const GYM_DATA = {
  referenceDate: "2026-11-17",

  months: [
    { key: "2026-06", label: "Jun 2026", short: "Jun" },
    { key: "2026-07", label: "Jul 2026", short: "Jul" },
    { key: "2026-08", label: "Aug 2026", short: "Aug" },
    { key: "2026-09", label: "Sep 2026", short: "Sep" },
    { key: "2026-10", label: "Oct 2026", short: "Oct" },
    { key: "2026-11", label: "Nov 2026", short: "Nov" }
  ],

  classes: [
    "HIIT",
    "CrossFit",
    "Yoga",
    "Zumba",
    "Strength Training",
    "Spin"
  ],

  // Monthly attendance check-ins vs total monthly slot capacity per class
  attendance: [
    // June 2026
    { month: "2026-06", className: "HIIT", checkIns: 340, capacity: 420 },
    { month: "2026-06", className: "CrossFit", checkIns: 295, capacity: 360 },
    { month: "2026-06", className: "Yoga", checkIns: 310, capacity: 400 },
    { month: "2026-06", className: "Zumba", checkIns: 280, capacity: 380 },
    { month: "2026-06", className: "Strength Training", checkIns: 460, capacity: 540 },
    { month: "2026-06", className: "Spin", checkIns: 220, capacity: 300 },

    // July 2026
    { month: "2026-07", className: "HIIT", checkIns: 365, capacity: 420 },
    { month: "2026-07", className: "CrossFit", checkIns: 312, capacity: 360 },
    { month: "2026-07", className: "Yoga", checkIns: 335, capacity: 400 },
    { month: "2026-07", className: "Zumba", checkIns: 305, capacity: 380 },
    { month: "2026-07", className: "Strength Training", checkIns: 485, capacity: 540 },
    { month: "2026-07", className: "Spin", checkIns: 238, capacity: 300 },

    // August 2026
    { month: "2026-08", className: "HIIT", checkIns: 378, capacity: 420 },
    { month: "2026-08", className: "CrossFit", checkIns: 325, capacity: 360 },
    { month: "2026-08", className: "Yoga", checkIns: 348, capacity: 400 },
    { month: "2026-08", className: "Zumba", checkIns: 318, capacity: 380 },
    { month: "2026-08", className: "Strength Training", checkIns: 502, capacity: 540 },
    { month: "2026-08", className: "Spin", checkIns: 245, capacity: 300 },

    // September 2026
    { month: "2026-09", className: "HIIT", checkIns: 392, capacity: 440 },
    { month: "2026-09", className: "CrossFit", checkIns: 336, capacity: 380 },
    { month: "2026-09", className: "Yoga", checkIns: 360, capacity: 420 },
    { month: "2026-09", className: "Zumba", checkIns: 332, capacity: 400 },
    { month: "2026-09", className: "Strength Training", checkIns: 520, capacity: 560 },
    { month: "2026-09", className: "Spin", checkIns: 260, capacity: 320 },

    // October 2026
    { month: "2026-10", className: "HIIT", checkIns: 410, capacity: 440 },
    { month: "2026-10", className: "CrossFit", checkIns: 350, capacity: 380 },
    { month: "2026-10", className: "Yoga", checkIns: 374, capacity: 420 },
    { month: "2026-10", className: "Zumba", checkIns: 349, capacity: 400 },
    { month: "2026-10", className: "Strength Training", checkIns: 538, capacity: 560 },
    { month: "2026-10", className: "Spin", checkIns: 274, capacity: 320 },

    // November 2026
    { month: "2026-11", className: "HIIT", checkIns: 424, capacity: 440 },
    { month: "2026-11", className: "CrossFit", checkIns: 362, capacity: 380 },
    { month: "2026-11", className: "Yoga", checkIns: 388, capacity: 420 },
    { month: "2026-11", className: "Zumba", checkIns: 360, capacity: 400 },
    { month: "2026-11", className: "Strength Training", checkIns: 546, capacity: 560 },
    { month: "2026-11", className: "Spin", checkIns: 286, capacity: 320 }
  ],

  // Member roster & payment records (Margao / South Goa members)
  members: [
    { id: "MRG-101", name: "Rohan Desai", primaryClass: "Strength Training", plan: "Annual", joinDate: "2026-06-03", expiryDate: "2027-06-03", feePaid: 14500, paymentMonth: "2026-06" },
    { id: "MRG-102", name: "Priya Naik", primaryClass: "Yoga", plan: "Quarterly", joinDate: "2026-06-08", expiryDate: "2026-11-19", feePaid: 4800, paymentMonth: "2026-09" },
    { id: "MRG-103", name: "Savio Fernandes", primaryClass: "CrossFit", plan: "Annual", joinDate: "2026-06-12", expiryDate: "2027-06-12", feePaid: 16000, paymentMonth: "2026-06" },
    { id: "MRG-104", name: "Ananya Kamat", primaryClass: "Zumba", plan: "Monthly", joinDate: "2026-06-18", expiryDate: "2026-11-18", feePaid: 1800, paymentMonth: "2026-11" },
    { id: "MRG-105", name: "Nikhil Borkar", primaryClass: "HIIT", plan: "Quarterly", joinDate: "2026-06-24", expiryDate: "2026-12-24", feePaid: 5100, paymentMonth: "2026-09" },
    { id: "MRG-106", name: "Clarissa D'Souza", primaryClass: "Spin", plan: "Quarterly", joinDate: "2026-07-02", expiryDate: "2026-11-21", feePaid: 4800, paymentMonth: "2026-08" },
    { id: "MRG-107", name: "Siddharth Prabhudesai", primaryClass: "Strength Training", plan: "Personal Training", joinDate: "2026-07-07", expiryDate: "2026-12-07", feePaid: 9500, paymentMonth: "2026-11" },
    { id: "MRG-108", name: "Meera Sardesai", primaryClass: "Yoga", plan: "Annual", joinDate: "2026-07-11", expiryDate: "2027-07-11", feePaid: 13800, paymentMonth: "2026-07" },
    { id: "MRG-109", name: "Melwin Rodrigues", primaryClass: "CrossFit", plan: "Quarterly", joinDate: "2026-07-16", expiryDate: "2026-11-14", feePaid: 5200, paymentMonth: "2026-08" },
    { id: "MRG-110", name: "Sneha Verenkar", primaryClass: "HIIT", plan: "Monthly", joinDate: "2026-07-22", expiryDate: "2026-11-22", feePaid: 1900, paymentMonth: "2026-11" },
    { id: "MRG-111", name: "Gaurav Shirodkar", primaryClass: "Strength Training", plan: "Quarterly", joinDate: "2026-07-28", expiryDate: "2027-01-28", feePaid: 4900, paymentMonth: "2026-10" },
    { id: "MRG-112", name: "Valerie Mascarenhas", primaryClass: "Zumba", plan: "Annual", joinDate: "2026-08-03", expiryDate: "2027-08-03", feePaid: 14000, paymentMonth: "2026-08" },
    { id: "MRG-113", name: "Aditya Kakodkar", primaryClass: "Spin", plan: "Monthly", joinDate: "2026-08-09", expiryDate: "2026-11-12", feePaid: 1800, paymentMonth: "2026-10" },
    { id: "MRG-114", name: "Tanvi Pai", primaryClass: "Yoga", plan: "Quarterly", joinDate: "2026-08-14", expiryDate: "2026-11-25", feePaid: 4800, paymentMonth: "2026-08" },
    { id: "MRG-115", name: "Clifton Pereira", primaryClass: "CrossFit", plan: "Personal Training", joinDate: "2026-08-19", expiryDate: "2026-12-19", feePaid: 10200, paymentMonth: "2026-11" },
    { id: "MRG-116", name: "Divya Hegde", primaryClass: "HIIT", plan: "Quarterly", joinDate: "2026-08-25", expiryDate: "2026-11-26", feePaid: 5100, paymentMonth: "2026-08" },
    { id: "MRG-117", name: "Prashant Gaonkar", primaryClass: "Strength Training", plan: "Annual", joinDate: "2026-09-02", expiryDate: "2027-09-02", feePaid: 14500, paymentMonth: "2026-09" },
    { id: "MRG-118", name: "Rochelle Rebello", primaryClass: "Zumba", plan: "Quarterly", joinDate: "2026-09-06", expiryDate: "2026-12-06", feePaid: 4700, paymentMonth: "2026-09" },
    { id: "MRG-119", name: "Kedar Shenvi", primaryClass: "HIIT", plan: "Annual", joinDate: "2026-09-11", expiryDate: "2027-09-11", feePaid: 15200, paymentMonth: "2026-09" },
    { id: "MRG-120", name: "Neha Sawant", primaryClass: "Yoga", plan: "Monthly", joinDate: "2026-09-15", expiryDate: "2026-11-15", feePaid: 1800, paymentMonth: "2026-10" },
    { id: "MRG-121", name: "Alister Vaz", primaryClass: "CrossFit", plan: "Quarterly", joinDate: "2026-09-21", expiryDate: "2026-12-21", feePaid: 5200, paymentMonth: "2026-09" },
    { id: "MRG-122", name: "Shruti Tendulkar", primaryClass: "Spin", plan: "Quarterly", joinDate: "2026-09-27", expiryDate: "2026-12-27", feePaid: 4800, paymentMonth: "2026-09" },
    { id: "MRG-123", name: "Vikram Salgaonkar", primaryClass: "Strength Training", plan: "Personal Training", joinDate: "2026-10-02", expiryDate: "2027-01-02", feePaid: 9800, paymentMonth: "2026-10" },
    { id: "MRG-124", name: "Joanne Noronha", primaryClass: "HIIT", plan: "Quarterly", joinDate: "2026-10-05", expiryDate: "2027-01-05", feePaid: 5100, paymentMonth: "2026-10" },
    { id: "MRG-125", name: "Mandar Kulkarni", primaryClass: "CrossFit", plan: "Annual", joinDate: "2026-10-10", expiryDate: "2027-10-10", feePaid: 16000, paymentMonth: "2026-10" },
    { id: "MRG-126", name: "Pooja Dessai", primaryClass: "Zumba", plan: "Monthly", joinDate: "2026-10-14", expiryDate: "2026-11-28", feePaid: 1800, paymentMonth: "2026-10" },
    { id: "MRG-127", name: "Sanket Raikar", primaryClass: "Spin", plan: "Quarterly", joinDate: "2026-10-19", expiryDate: "2027-01-19", feePaid: 4800, paymentMonth: "2026-10" },
    { id: "MRG-128", name: "Fiona Colaco", primaryClass: "Yoga", plan: "Annual", joinDate: "2026-10-23", expiryDate: "2027-10-23", feePaid: 13800, paymentMonth: "2026-10" },
    { id: "MRG-129", name: "Rakesh Lotlikar", primaryClass: "Strength Training", plan: "Quarterly", joinDate: "2026-10-28", expiryDate: "2027-01-28", feePaid: 4900, paymentMonth: "2026-10" },
    { id: "MRG-130", name: "Aarti Phadke", primaryClass: "HIIT", plan: "Monthly", joinDate: "2026-11-01", expiryDate: "2026-12-01", feePaid: 1900, paymentMonth: "2026-11" },
    { id: "MRG-131", name: "Denzil Braganza", primaryClass: "CrossFit", plan: "Annual", joinDate: "2026-11-03", expiryDate: "2027-11-03", feePaid: 16000, paymentMonth: "2026-11" },
    { id: "MRG-132", name: "Kavita Kudchadkar", primaryClass: "Yoga", plan: "Quarterly", joinDate: "2026-11-05", expiryDate: "2027-02-05", feePaid: 4800, paymentMonth: "2026-11" },
    { id: "MRG-133", name: "Nitin Velip", primaryClass: "Strength Training", plan: "Quarterly", joinDate: "2026-11-08", expiryDate: "2027-02-08", feePaid: 4900, paymentMonth: "2026-11" },
    { id: "MRG-134", name: "Liza Goes", primaryClass: "Zumba", plan: "Quarterly", joinDate: "2026-11-10", expiryDate: "2027-02-10", feePaid: 4700, paymentMonth: "2026-11" },
    { id: "MRG-135", name: "Harish Nadkarni", primaryClass: "Spin", plan: "Personal Training", joinDate: "2026-11-12", expiryDate: "2027-02-12", feePaid: 9500, paymentMonth: "2026-11" },
    { id: "MRG-136", name: "Sonali Kenkre", primaryClass: "HIIT", plan: "Quarterly", joinDate: "2026-11-15", expiryDate: "2027-02-15", feePaid: 5100, paymentMonth: "2026-11" }
  ]
};