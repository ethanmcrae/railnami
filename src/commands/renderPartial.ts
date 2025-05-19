import * as vscode from 'vscode';
import { MemoryStore } from '../memory/memoryStore';

export async function renderPartial(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const snippet = new vscode.SnippetString('<%= render "${1:partial_name}"$0 %>');
  editor.insertSnippet(snippet);

  const recentPartials = MemoryStore.getRecentPartials(5);
  if (recentPartials.length > 0) {
    const partialsString = recentPartials.join(', ');
    vscode.window.showInformationMessage('Recent partials: ' + partialsString);
  }
}
