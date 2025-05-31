import { humanName } from "../../rails/fileNames";
import { ScriptItem } from "../scriptItem";

export function openModelFileButton(className: string): ScriptItem {
  const modelName = humanName(className);
  return new ScriptItem('Model', modelName, 'eye', {
    command: 'railnami.openExpectedModelFile',
    title: 'View Expected Model File'
  });
}

export function openViewFileButton(className: string): ScriptItem {
  const modelName = humanName(className);
  return new ScriptItem('View', modelName, 'eye', {
    command: 'railnami.openExpectedViewFiles',
    title: 'View Expected View Files'
  });
}

export function openControllerFileButton(className: string): ScriptItem {
  const modelName = humanName(className);
  return new ScriptItem('Controller', modelName, 'eye', {
    command: 'railnami.openExpectedControllerFile',
    title: 'View Expected Controller File'
  });
}
