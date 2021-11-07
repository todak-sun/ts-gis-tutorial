export type FeatureCollection = {
  type: string;
  features: Feature[];
};

export type Feature = {
  type: string;
  geometry: Point;
  properties: Properties;
};

export type Point = {
  type: string;
  coordinates: number[];
};

export type Properties = {
  mmsi: string;
  imo: string;
  length: number;
  width: number;
  destination: string;
  eta: string;
  draught: number;
  heading: number;
  sog: number;
  cog: number;
  rot: number;
  ship_name: string;
  ship_type: string;
  call_sign: string;
  lng: number;
  lat: number;
  status: number;
  time: string;
  source: string;
  time_static: string;
  position: any;
};

export type SpireResponseModel = {
  paging: Pagination;
  data: SpireData[];
};

export type Position = {
  timestamp: '2020-08-06T07:38:13+00:00';
  geometry: Point;
  heading: number;
  speed: number;
  rot: number;
  accuracy: any;
  collection_type: string;
  draught: number;
  maneuver: number;
  course: number;
};

export type Dimensions = {
  A: any;
  B: any;
  C: any;
  D: any;
};

export type Port = {
  unlocode: string;
  port_name: string;
  center_point: Point;
};

export type Voyage = {
  eta: null;
  destination: string;
  matched_port: Port;
};

export type SpireData = {
  id: string;
  name: string;
  mmsi: string;
  imo: null;
  call_sign: string;
  ship_type: string;
  class: string;
  flag: string;
  length: number;
  width: number;
  dimensions: Dimensions;
  ais_version: number;
  created_at: string;
  updated_at: string;
  static_updated_at: string;
  position_updated_at: string;
  last_known_position: Position;
  most_recent_voyage: Voyage;
  predicted_position: Position;
  general_classification: string;
  individual_classification: string;
  gross_tonnage: string;
  lifeboats: any;
  person_capacity: any;
  navigational_status: string;
};

export type Pagination = {
  limiit: number;
  toal: number;
  next: string | undefined;
};
