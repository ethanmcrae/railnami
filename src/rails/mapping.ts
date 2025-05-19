import { RailsGeneratorType, RailsMapping } from '../types';
import { classify } from '../utils/pathUtils';

interface Matcher<T extends RailsGeneratorType> {
  pattern: RegExp;
  generatorType: T;
  suffix?: string; // Suffix to strip from capture group
}

// Centralised regex definitions so new generators (e.g. helpers, mailboxes)
// can be added in exactly one place.
const sourceMatchers: Matcher<RailsGeneratorType>[] = [
  { pattern: /^app\/models\/(.+)\.rb$/, generatorType: 'model' },
  { pattern: /^app\/controllers\/(.+)_controller\.rb$/, generatorType: 'controller', suffix: '_controller' },
  { pattern: /^app\/jobs\/(.+)_job\.rb$/, generatorType: 'job', suffix: '_job' },
  { pattern: /^app\/mailers\/(.+)_mailer\.rb$/, generatorType: 'mailer', suffix: '_mailer' },
  { pattern: /^app\/channels\/(.+)_channel\.rb$/, generatorType: 'channel', suffix: '_channel' }
];

const testMatchers: Matcher<RailsGeneratorType>[] = [
  { pattern: /^test\/models\/(.+?)_model_test\.rb$/, generatorType: 'model' },
  { pattern: /^test\/controllers\/(.+?)_controller_test\.rb$/, generatorType: 'controller' },
  { pattern: /^test\/jobs\/(.+?)_job_test\.rb$/, generatorType: 'job' },
  { pattern: /^test\/mailers\/(.+?)_mailer_test\.rb$/, generatorType: 'mailer' },
  { pattern: /^test\/channels\/(.+?)_channel_test\.rb$/, generatorType: 'channel' }
];

export function getRailsMapping(filePath: string): RailsMapping | null {
  for (const m of sourceMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      let base = match[1];
      if (m.suffix) base = base.replace(new RegExp(`${m.suffix}$`), '');
      return {
        generatorType: m.generatorType,
        className: classify(base),
        fileType: 'source'
      } as const;
    }
  }

  for (const m of testMatchers) {
    const match = filePath.match(m.pattern);
    if (match) {
      return {
        generatorType: m.generatorType,
        className: classify(match[1]),
        fileType: 'test'
      } as const;
    }
  }

  return null;
}
