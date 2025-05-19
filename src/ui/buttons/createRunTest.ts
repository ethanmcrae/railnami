import { RailsMapping } from "../../types";
import { ScriptItem } from "../scriptItem";

export default function createRunTestButton(mapping: RailsMapping | null): ScriptItem {
  const description = mapping ? `${mapping.className} ${mapping.generatorType}` : '';
  return new ScriptItem('Run Test', description, 'play', {
    command: 'railnami.runTestForCurrentFile',
    title: 'Run Test'
  });
}
