import { Uri } from "vscode";

export type RailsResourceType =
  | 'model'
  | 'controller'
  | 'job'
  | 'mailer'
  | 'channel'
  | 'stimulusController'
  | 'modelConcern'
  | 'controllerConcern'
  | 'helper'
  | 'mailbox'
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
  resourceType: RailsResourceType;
  className: string;
  fileType: RailsFileType;
}

export interface FileInfo {
  fileName: string;
  uri: Uri;
}

export interface MemoryEntry extends FileInfo {
  timestamp: number;
}

export interface CounterEntry extends FileInfo {
  count: number;
}
