export type RailsGeneratorType =
  | 'model'
  | 'controller'
  | 'job'
  | 'mailer'
  | 'channel'
  | 'stimulusController'
  | 'modelConcern'
  | 'controllerConcern'
  | 'other';

export type RailsFileType =
  | 'other'
  | 'test'
  | 'stimulusController'
  | 'modelConcern'
  | 'controllerConcern'
  | 'model'
  | 'view'
  | 'controller'
  | 'job'
  | 'mailer'
  | 'channel';

export interface RailsMapping {
  generatorType: RailsGeneratorType;
  className: string;
  fileType: RailsFileType;
}

export interface MemoryEntry {
  fileName: string;
  timestamp: number;
}
