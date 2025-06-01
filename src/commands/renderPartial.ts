import * as vscode from 'vscode';
import { MemoryStore } from '../memory/memoryStore';
import { readFirstLine } from '../vscode/fileUtils';
import { buildRenderPartialSnippet, parseLocalsArgs } from '../rails/localParser';
import { WorkspaceLocals } from '../vscode/workspaceLocals';

export async function renderPartial(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const recentPartials = await MemoryStore.getRecommendedPartials(7);
  const partialOptions = recentPartials
    .filter(data => data.uri.toString() !== editor.document.uri.toString()) // Filter current file
    .map(data => ({ ...data, label: data.fileName })); // Comply with type: QuickPickOptions
  if (recentPartials.length > 0) {
    vscode.window.showQuickPick(partialOptions, {
      placeHolder: 'Select a partial to insert'
    }).then(selected => {
      if (!selected) { // Display default when use cancels selection
        displayDefaultSnippet(editor);
        return;
      }
      // Keep track of the popularity of this choice
      MemoryStore.partialSelectedForRender(selected.fileName, selected.uri);

      // Create the snippet
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
