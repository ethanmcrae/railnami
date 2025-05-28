import * as vscode from 'vscode';
import { MemoryStore } from '../memory/memoryStore';

export async function renderPartial(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const snippet = new vscode.SnippetString('<%= render "$1"$0 %>');
  editor.insertSnippet(snippet);

  const recentPartials = MemoryStore.getRecentPartials(7);
  if (recentPartials.length > 0) {
    vscode.window.showQuickPick(recentPartials, {
      placeHolder: 'Select a partial to insert'
    }).then(selected => {
      if (!selected) { return; } // User canceled
      editor.edit(editBuilder => {
        // Insert at current cursor position(s)
        editor.selections.forEach(selection => {
          editBuilder.insert(selection.active, selected);
        });
      });
    });
  }
}
