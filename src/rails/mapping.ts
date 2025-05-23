import { RailsFileType, RailsGeneratorType, RailsMapping } from '../types';
import { classify } from '../utils/pathUtils';

interface Matcher<T extends RailsGeneratorType, F extends RailsFileType> {
  pattern: RegExp;
  generatorType: T;
  fileType: F;
  suffix?: string;
}

const sourceMatchers: Matcher<any, any>[] = [
  // Concerns
  { pattern: /^app\/models\/concerns\/(.+)\.rb$/, generatorType: 'model', fileType: 'modelConcern' },
  { pattern: /^app\/controllers\/concerns\/(.+)\.rb$/, generatorType: 'controller', fileType: 'controllerConcern' },

  // Stimulus controller
  { pattern: /^app\/javascript\/controllers\/(.+)_controller\.(js|ts)$/, generatorType: 'controller', fileType: 'stimulusController', suffix: '_controller' },

  // Models, Controllers, Views
  { pattern: /^app\/models\/(.+)\.rb$/, generatorType: 'model', fileType: 'model' },
  { pattern: /^app\/controllers\/(.+)_controller\.rb$/, generatorType: 'controller', fileType: 'controller', suffix: '_controller' },
  { pattern: /^app\/views\/(.+?)\//, generatorType: 'controller', fileType: 'view' }, // Matches folders in views

  // Rails channels, mailers, jobs
  { pattern: /^app\/jobs\/(.+)_job\.rb$/, generatorType: 'job', fileType: 'job', suffix: '_job' },
  { pattern: /^app\/mailers\/(.+)_mailer\.rb$/, generatorType: 'mailer', fileType: 'mailer', suffix: '_mailer' },
  { pattern: /^app\/channels\/(.+)_channel\.rb$/, generatorType: 'channel', fileType: 'channel', suffix: '_channel' },

  // Other catch-all
  { pattern: /^app\/.+/, generatorType: 'other', fileType: 'other' },
];

const testMatchers: Matcher<any, any>[] = [
  { pattern: /^test\/models\/(.+?)_model_test\.rb$/, generatorType: 'model', fileType: 'test' },
  { pattern: /^test\/controllers\/(.+?)_controller_test\.rb$/, generatorType: 'controller', fileType: 'test' },
  { pattern: /^test\/jobs\/(.+?)_job_test\.rb$/, generatorType: 'job', fileType: 'test' },
  { pattern: /^test\/mailers\/(.+?)_mailer_test\.rb$/, generatorType: 'mailer', fileType: 'test' },
  { pattern: /^test\/channels\/(.+?)_channel_test\.rb$/, generatorType: 'channel', fileType: 'test' }
];

export function getRailsMapping(filePath: string): RailsMapping | null {
  for (const m of sourceMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      let base = match[1] || match[0]; // for view, may not have group
      if (m.suffix && base) {
        base = base.replace(new RegExp(`${m.suffix}$`), '');
      }
      return {
        generatorType: m.generatorType,
        className: classify(base),
        fileType: m.fileType,
      } as const;
    }
  }

  for (const m of testMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      return {
        generatorType: m.generatorType,
        className: classify(match[1]),
        fileType: m.fileType,
      } as const;
    }
  }

  return null;
}
