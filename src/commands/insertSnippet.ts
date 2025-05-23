import * as vscode from 'vscode';

export function registerSnippetCommands(context: vscode.ExtensionContext) {
  const snippets: Record<string, string> = {
    empty: '<% ${1:condition} %>',
    erb: '<%= ${1:condition} %>',
    if: '<% if ${1:condition} %>',
    elsif: '<% elsif ${1:condition} %>',
    else: '<% else %>',
    end: '<% end %>',
    ifend: '<% if ${1:condition} %>\n  $0\n<% end %>',
    ifelsend: '<% if \${1:condition1} %>\n' +
              '\t\${2:# code for condition1}\n' +
              '<% elsif \${3:condition2} %>\n' +
              '\t\${4:# code for condition2}\n' +
              '<% end %>\n$0',
    partialLocals: '<%# locals: (${1:variable}: ${2:value}) -%>$0',
  };

  for (const [name, snippet] of Object.entries(snippets)) {
    const commandId = `railnami.insertSnippet.${name}`;
    const disposable = vscode.commands.registerCommand(commandId, () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { return; }
      editor.insertSnippet(new vscode.SnippetString(snippet));
    });
    context.subscriptions.push(disposable);
  }
}
