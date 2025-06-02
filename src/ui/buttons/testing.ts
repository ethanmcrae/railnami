import { humanName } from "../../rails/fileNames";
import { RailsMapping } from "../../types";
import { ScriptItem } from "../scriptItem";

export function createGenerateTestButton(mapping: RailsMapping): ScriptItem {
  const modelName = humanName(mapping.className);
  return new ScriptItem('Test', `${modelName} ${mapping.generatorType}`, 'plus', {
    command: 'railnami.generateTestForCurrentFile',
    title: 'Create Test File'
  });
}

export function openTestFileButton(mapping: RailsMapping): ScriptItem {
  const modelName = humanName(mapping.className);
  return new ScriptItem('Test', `${modelName} ${mapping.generatorType}`, 'eye', {
    command: 'railnami.openTestForCurrentFile',
    title: 'View Test File'
  });
}

export function createRunTestButton(mapping: RailsMapping | null): ScriptItem {
  const description = mapping ? `${mapping.className} ${mapping.generatorType}` : '';
  return new ScriptItem('Run Test', description, 'play', {
    command: 'railnami.runTestForCurrentFile',
    title: 'Run Test'
  });
}