// Popular cars used in Bangladesh
export const BANGLADESHI_CARS = [
  // Sedans
  { brand: 'Toyota', model: 'Allion', category: 'sedan', typical_price: 4500 },
  { brand: 'Toyota', model: 'Premio', category: 'sedan', typical_price: 5000 },
  { brand: 'Toyota', model: 'Corolla', category: 'sedan', typical_price: 4000 },
  { brand: 'Toyota', model: 'Axio', category: 'sedan', typical_price: 3500 },
  { brand: 'Honda', model: 'Civic', category: 'sedan', typical_price: 5500 },
  { brand: 'Honda', model: 'City', category: 'sedan', typical_price: 3800 },
  { brand: 'Mitsubishi', model: 'Lancer', category: 'sedan', typical_price: 3500 },
  { brand: 'Nissan', model: 'Sunny', category: 'sedan', typical_price: 3200 },
  { brand: 'Toyota', model: 'Vios', category: 'sedan', typical_price: 3800 },

  // SUVs
  { brand: 'Toyota', model: 'Prado', category: 'suv', typical_price: 12000 },
  { brand: 'Mitsubishi', model: 'Pajero', category: 'suv', typical_price: 10000 },
  { brand: 'Toyota', model: 'Land Cruiser', category: 'suv', typical_price: 15000 },
  { brand: 'Nissan', model: 'X-Trail', category: 'suv', typical_price: 8000 },
  { brand: 'Toyota', model: 'RAV4', category: 'suv', typical_price: 9000 },
  { brand: 'Mitsubishi', model: 'Outlander', category: 'suv', typical_price: 8500 },
  { brand: 'Honda', model: 'CR-V', category: 'suv', typical_price: 9500 },

  // Microbuses / MPVs
  { brand: 'Toyota', model: 'Noah', category: 'microbus', typical_price: 7000 },
  { brand: 'Toyota', model: 'Hi-Ace', category: 'microbus', typical_price: 8000 },
  { brand: 'Mitsubishi', model: 'Rosa', category: 'microbus', typical_price: 9000 },
  { brand: 'Toyota', model: 'Voxy', category: 'microbus', typical_price: 6500 },

  // Hatchbacks
  { brand: 'Toyota', model: 'Vitz', category: 'hatchback', typical_price: 2800 },
  { brand: 'Toyota', model: 'Aqua (Prius C)', category: 'hatchback', typical_price: 3200 },
  { brand: 'Honda', model: 'Fit', category: 'hatchback', typical_price: 3000 },
  { brand: 'Suzuki', model: 'Swift', category: 'hatchback', typical_price: 2500 },
  { brand: 'Nissan', model: 'March', category: 'hatchback', typical_price: 2500 },

  // Station Wagons / Pickups
  { brand: 'Toyota', model: 'Probox', category: 'sedan', typical_price: 3000 },
  { brand: 'Toyota', model: 'Fielder', category: 'sedan', typical_price: 3500 },
  { brand: 'Toyota', model: 'Hilux', category: 'pickup', typical_price: 6000 },

  // Luxury
  { brand: 'BMW', model: '3 Series', category: 'luxury', typical_price: 18000 },
  { brand: 'Mercedes-Benz', model: 'E-Class', category: 'luxury', typical_price: 20000 },
  { brand: 'Toyota', model: 'Lexus ES', category: 'luxury', typical_price: 16000 },
];

// Bangladesh divisions and major cities
export const DIVISIONS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'
];

export const CITIES_BY_DIVISION = {
  Dhaka: ['Dhaka City', 'Gazipur', 'Narayanganj', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Faridpur', 'Tangail'],
  Chittagong: ['Chittagong City', "Cox's Bazar", 'Comilla', 'Feni', 'Noakhali', 'Brahmanbaria', 'Chandpur'],
  Sylhet: ['Sylhet City', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rajshahi: ['Rajshahi City', 'Bogura', 'Natore', 'Pabna', 'Sirajganj', 'Naogaon', 'Chapai Nawabganj'],
  Khulna: ['Khulna City', 'Jessore', 'Satkhira', 'Bagerhat', 'Narail', 'Chuadanga', 'Magura'],
  Barisal: ['Barisal City', 'Patuakhali', 'Bhola', 'Jhalokathi', 'Pirojpur', 'Barguna'],
  Rangpur: ['Rangpur City', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari', 'Lalmonirhat', 'Thakurgaon', 'Panchagarh'],
  Mymensingh: ['Mymensingh City', 'Netrokona', 'Sherpur', 'Jamalpur'],
};

// Car categories
export const CATEGORIES = [
  { value: 'sedan', label: 'Sedan', icon: '🚗' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'microbus', label: 'Microbus', icon: '🚌' },
  { value: 'hatchback', label: 'Hatchback', icon: '🚘' },
  { value: 'pickup', label: 'Pickup', icon: '🛻' },
  { value: 'luxury', label: 'Luxury', icon: '🏎️' },
  { value: 'cng', label: 'CNG', icon: '🚕' },
  { value: 'jeep', label: 'Jeep', icon: '🚐' },
];

// Payment methods popular in Bangladesh
export const PAYMENT_METHODS = [
  { value: 'bkash', label: 'bKash', color: '#E2136E' },
  { value: 'nagad', label: 'Nagad', color: '#F15A29' },
  { value: 'rocket', label: 'Rocket (DBBL)', color: '#8A1C7C' },
  { value: 'card', label: 'Debit/Credit Card', color: '#1A56DB' },
  { value: 'bank_transfer', label: 'Bank Transfer', color: '#0F766E' },
  { value: 'cash', label: 'Cash on Pickup', color: '#15803D' },
];

// Format Taka currency
export const formatTaka = (amount) => {
  return `৳${amount?.toLocaleString('bn-BD') || '0'}`;
};

export const formatTakaEN = (amount) => {
  return `৳${(amount || 0).toLocaleString('en-BD')}`;
};
