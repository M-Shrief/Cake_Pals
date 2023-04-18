// Use 24h Convention: 12:30, 15:00
// So that we can split the string, then convert minutes to hours.
// make the calculation, then format it back to 24h convention.
export interface Time {
  hours: number;
  minutes: number;
}

export interface Location {
  type: {
    type: string;
  };
  coordinates: number[];
}

export interface Product {
  baker: string;
  name: string;
  type: 'Sweets' | 'Salty';
  imageURL?: string;
  description: string;
  bakingTime: Time;
  price: number;
}

export interface Person {
  firstName: string;
  lastName: string;
  phone: string;
  location: Location;
}
