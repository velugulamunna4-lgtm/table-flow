import { RestaurantConfig } from '@/types';

export const restaurantConfig: RestaurantConfig = {
  id: 'rest_tableflow_demo',
  name: 'Table Flow',
  tagline: 'Authentic Indian Flavors & Modern Comfort',
  logo: '/logo.svg',
  phone: '+91 98765 43210',
  email: 'hello@tableflow.demo',
  address: '14, Jubilee Enclave, Hitec City',
  city: 'Hyderabad, Telangana 500081',
  currencySymbol: '₹',
  currencyCode: 'INR',
  gstRatePercent: 5.0,
  serviceChargePercent: 5.0,
  defaultTheme: 'sunny-family',
  activeTheme: 'sunny-family',
  defaultLanguage: 'en',
  splitBillPolicy: 'customer_and_counter',
  requireWaiterVerification: false,
  openingHours: '11:30 AM – 11:00 PM',
};

export default restaurantConfig;
