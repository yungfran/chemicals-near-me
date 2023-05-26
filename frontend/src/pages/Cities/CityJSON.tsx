export default interface CityJSON {
  id: number;
  name: string;
  county: string;
  state: string;
  population: number;
  disability: number;
  no_health_insurance: number;
  median_household_income: number;
  longitude: number;
  latitude: number;
  image_url: string;
  map_url: string;
}

export interface CitiesJSON {
  num_results: number;
  num_pages: number;
  cities: Array<CityInstanceJSON>;
}

export interface CityInstanceJSON {
  id: number;
  name: string;
  state: string;
  county: string;
  population: number;
  median_household_income: number;
  disability: number;
  no_health_insurance: number;
  image_url: string;
}

export interface CityMinJSON {
  id: number;
  name: string;
  state: string;
}
