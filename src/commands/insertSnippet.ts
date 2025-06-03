import * as vscode from 'vscode';

export function registerSnippetCommands(context: vscode.ExtensionContext) {
  const snippets: Record<string, string> = {
    htmlComment: '<!-- ${1:comment} -->',
    erbComment: '<%# ${1:comment} %>',
    empty: '<% ${1:code} %>',
    erb: '<%= ${1:code} %>',
    if: '<% if ${1:condition} %>',
    elsif: '<% elsif ${1:condition} %>',
    else: '<% else %>',
    unless: '<% unless ${1:condition} %>',
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
