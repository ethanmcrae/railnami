import { demodulizeToFileName } from "../utils/pathUtils";

export function humanName(className: string): string {
  return className.split('::').pop() || '';
}

export function controllerFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'plural') + '_controller';
  return fileName + fileEnding;
}

export function modelFileName(className: string, fileType = true): string {
  const fileEnding = fileType ? '.rb' : '';
  const fileName = demodulizeToFileName(className, 'singular');
  return fileName + fileEnding;
}
