// Use 24h Convention: 12:30, 15:00
// So that we can split the string, then convert minutes to hours.
// make the calculation, then format it back to 24h convention.
export interface Time {
  hour: {
    type: Number;
    min: 0;
    max: 24;
  };
  minutes: {
    type: Number;
    min: 0;
    max: 60;
  };
}

export interface Location {
  type: {
    type: String;
  };
  coordinates: Number[];
}

export interface Product {
  baker: String;
  name: String;
  type: 'Sweets' | 'Salty';
  imageURL?: String;
  description: String;
  bakingTime: Time;
  price: Number;
}
