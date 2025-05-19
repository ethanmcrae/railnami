import { RailsMapping } from "../../types";
import { ScriptItem } from "../scriptItem";

export default function createGenerateTestButton(mapping: RailsMapping): ScriptItem {
  const humanName = mapping.className.split('::').pop();
  return new ScriptItem(`${humanName} Test`, mapping.generatorType, 'plus', {
    command: 'railnami.generateTestForCurrentFile',
    title: 'Create Test File'
  });
}
