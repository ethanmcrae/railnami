import { humanName } from "../../rails/fileNames";
import { RailsMapping } from "../../types";
import { ScriptItem } from "../scriptItem";

export default function createGenerateTestButton(mapping: RailsMapping): ScriptItem {
  const modelName = humanName(mapping.className);
  return new ScriptItem(`${modelName} Test`, mapping.generatorType, 'plus', {
    command: 'railnami.generateTestForCurrentFile',
    title: 'Create Test File'
  });
}
