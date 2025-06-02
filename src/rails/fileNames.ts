import pluralize from 'pluralize';
import { RailsGeneratorType } from '../types';
import { demodulizeToFileName } from '../utils/pathUtils';

export function humanName(className: string): string {
  return className.split('::').pop() || '';
}

export function buildFileNameFromGenerator(
  generatorType: RailsGeneratorType,
  className: string,
  fileEnding = true
): string | null {
  let fileName: string | undefined;

  switch (generatorType) {
    case 'model':
      fileName = modelFileName(className, false);
      break;
    case 'controller':
      fileName = controllerFileName(className, false);
      break;
    case 'mailer':
      fileName = mailerFileName(className, false);
      break;
    case 'job':
      fileName = jobFileName(className, false);
      break;
    case 'channel':
      fileName = channelFileName(className, false);
      break;
    case 'helper':
      fileName = helperFileName(className, false);
      break;
    case 'mailbox':
      fileName = mailboxFileName(className, false);
      break;
    default:
      return null;
  }
  if (fileName && fileEnding) fileName += '.rb';
  return fileName ?? null;
}

export function assumePlurality(generatorType: RailsGeneratorType, className: string): string {
  switch (generatorType) {
    case 'model':
    case 'mailer':
    case 'job':
    case 'channel':
    case 'mailbox':
      return pluralize.singular(className);

    case 'controller':
    case 'helper':
      return pluralize.plural(className);

    default:
      return className;
  }
}

// ----------- Helper Functions Below -----------

export function modelFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'singular');
  return fileName + fileEnding;
}

export function controllerFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'plural') + '_controller';
  return fileName + fileEnding;
}

export function mailerFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'singular') + '_mailer';
  return fileName + fileEnding;
}

export function jobFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'singular') + '_job';
  return fileName + fileEnding;
}

export function channelFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'singular') + '_channel';
  return fileName + fileEnding;
}

export function helperFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'plural') + '_helper';
  return fileName + fileEnding;
}

export function mailboxFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  // Mailbox is singular + '_mailbox'
  const fileName = demodulizeToFileName(className, 'singular') + '_mailbox';
  return fileName + fileEnding;
}
