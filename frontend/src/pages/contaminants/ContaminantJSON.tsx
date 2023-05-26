export default interface ContaminantJSON {
  id: number;
  pubchem_id: string;
  name: string;
  description: string;
  cas_num: string;
  molecular_weight: number;
  chemical_formula: string;
  density: string;
  boiling_point: string;
  melting_point: number;
  pubchem_url: string;
  diagram_url: string;
}

export interface ContaminantInstanceJSON {
  id: number;
  name: string;
  cas_num: string;
  molecular_weight: number;
  chemical_formula: string;
  boiling_point: string;
  melting_point: number;
}

export interface ContaminantMinJSON {
  id: number;
  name: string;
}

export interface ContaminantsJSON {
  num_results: number;
  num_pages: number;
  contaminants: Array<ContaminantInstanceJSON>;
}
