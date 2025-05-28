import * as vscode from 'vscode';
import { MemoryStore } from '../memory/memoryStore';
import { readFirstLine } from '../vscode/fileUtils';
import { buildRenderPartialSnippet, parseLocalsArgs } from '../rails/localParser';

export async function renderPartial(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const recentPartials = MemoryStore.getRecentPartials(7);
  const partialOptions = recentPartials.map(data => ({ ...data, label: data.fileName }));
  if (recentPartials.length > 0) {
    vscode.window.showQuickPick(partialOptions, {
      placeHolder: 'Select a partial to insert'
    }).then(selected => {
      if (!selected) { // Display default when use cancels selection
        displayDefaultSnippet(editor);
        return;
      }
      readFirstLine(selected.uri).then((firstLine) => {
        const args = parseLocalsArgs(firstLine); // Parse locales
        const snippet = buildRenderPartialSnippet(selected.fileName, args); // Prepare autocomplete
        editor.insertSnippet(snippet, editor.selection.active); // Apply autocomplete
      });
    });
  } else {
    displayDefaultSnippet(editor); // Display default when there are no partial options
  }
}

const displayDefaultSnippet = (editor: vscode.TextEditor) => {
  const snippet = new vscode.SnippetString('<%= render "$1"$0 %>');
  editor.insertSnippet(snippet);
};
