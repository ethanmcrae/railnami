import { RailsMapping } from "../../types";
import { ScriptItem } from "../scriptItem";

export default function createStimulusController(mapping: RailsMapping): ScriptItem {
  return new ScriptItem('Stimulus controller', mapping.resourceType, 'plus', {
    command: 'railnami.createStimulusController',
    title: 'Create Stimulus Controller'
  });
}