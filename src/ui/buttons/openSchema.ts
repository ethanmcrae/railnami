import { demodulizeToFileName } from "../../utils/pathUtils";
import { ScriptItem } from "../scriptItem";

export default function openSchemaButton(className: string): ScriptItem {
  const table_name = demodulizeToFileName(className, "plural");
  return new ScriptItem(`Schema`, table_name, 'eye', {
    command: 'railnami.openSchemaToTable',
    title: 'Open Schema.rb File to View The Expected Table'
  });
}
