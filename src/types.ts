export type RailsGeneratorType = 'model' | 'controller' | 'job' | 'mailer' | 'channel';

export type FileType = 'source' | 'test';

export interface RailsMapping {
  generatorType: RailsGeneratorType;
  className: string;
  fileType: FileType;
}

export interface MemoryEntry {
  fileName: string;
  timestamp: number;
}
