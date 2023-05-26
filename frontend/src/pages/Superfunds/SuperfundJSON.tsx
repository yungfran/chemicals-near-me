import { ContaminantMinJSON } from "../contaminants/ContaminantJSON";

export default interface SuperfundJSON {
  id: number;
  epa_id: string;
  name: string;
  site_id: string;
  npl_status: string;
  num_chem: string;
  city_name: string;
  state: string;
  county: string;
  zipcode: number;
  federal_facility: string;
  longitude: number;
  latitude: number;
  image_url: string;
  city_id: number;
  contaminants: Array<ContaminantMinJSON>;
}

export interface SuperfundsJSON {
  num_results: number;
  num_pages: number;
  superfunds: Array<SuperfundInstanceJSON>;
}

export interface SuperfundInstanceJSON {
  id: number;
  name: string;
  npl_status: string;
  num_chem: string;
  city_name: string;
  state: string;
  county: string;
  image_url: string;
  city_id: number;
}

export interface SuperfundMinJSON {
  id: number;
  name: string;
}
