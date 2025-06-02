import * as vscode from 'vscode';
import { RailsFileType, RailsResourceType, RailsMapping } from '../types';
import { classify } from '../utils/pathUtils';

interface Matcher<T extends RailsResourceType, F extends RailsFileType> {
  pattern: RegExp;
  resourceType: T;
  fileType: F;
  suffix?: string;
}

const sourceMatchers: Matcher<any, any>[] = [
  // Concerns
  { pattern: /^app\/models\/concerns\/(.+)\.rb$/, resourceType: 'model', fileType: 'modelConcern' },
  { pattern: /^app\/controllers\/concerns\/(.+)\.rb$/, resourceType: 'controller', fileType: 'controllerConcern' },

  // Stimulus controller
  { pattern: /^app\/javascript\/controllers\/(.+)_controller\.(js|ts)$/, resourceType: 'controller', fileType: 'stimulusController', suffix: '_controller' },

  // Models, Controllers, Views
  { pattern: /^app\/models\/(.+)\.rb$/, resourceType: 'model', fileType: 'model' },
  { pattern: /^app\/controllers\/(.+)_controller\.rb$/, resourceType: 'controller', fileType: 'controller', suffix: '_controller' },
  { pattern: /^app\/views\/(.+?)\//, resourceType: 'controller', fileType: 'view' }, // Matches folders in views

  // Rails channels, mailers, jobs
  { pattern: /^app\/jobs\/(.+)_job\.rb$/, resourceType: 'job', fileType: 'job', suffix: '_job' },
  { pattern: /^app\/mailers\/(.+)_mailer\.rb$/, resourceType: 'mailer', fileType: 'mailer', suffix: '_mailer' },
  { pattern: /^app\/channels\/(.+)_channel\.rb$/, resourceType: 'channel', fileType: 'channel', suffix: '_channel' },

  // Other catch-all
  { pattern: /^app\/.+/, resourceType: 'other', fileType: 'other' },
];

const testMatchers: Matcher<any, any>[] = [
  { pattern: /^test\/models\/(.+?)_model_test\.rb$/, resourceType: 'model', fileType: 'test' },
  { pattern: /^test\/controllers\/(.+?)_controller_test\.rb$/, resourceType: 'controller', fileType: 'test' },
  { pattern: /^test\/jobs\/(.+?)_job_test\.rb$/, resourceType: 'job', fileType: 'test' },
  { pattern: /^test\/mailers\/(.+?)_mailer_test\.rb$/, resourceType: 'mailer', fileType: 'test' },
  { pattern: /^test\/channels\/(.+?)_channel_test\.rb$/, resourceType: 'channel', fileType: 'test' }
];

export function getRailsMapping(filePath?: string): RailsMapping | null {
  if (!filePath) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;

    filePath = vscode.workspace.asRelativePath(editor.document.uri.fsPath);
  }

  for (const m of sourceMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      let base = match[1] || match[0]; // for view, may not have group
      if (m.suffix && base) {
        base = base.replace(new RegExp(`${m.suffix}$`), '');
      }
      return {
        resourceType: m.resourceType,
        className: classify(base),
        fileType: m.fileType,
      } as const;
    }
  }

  for (const m of testMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      return {
        resourceType: m.resourceType,
        className: classify(match[1]),
        fileType: m.fileType,
      } as const;
    }
  }

  return null;
}
