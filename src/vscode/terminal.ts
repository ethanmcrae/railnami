import * as vscode from 'vscode';

/**
 * Get (or lazily create) a named VS Code terminal instance.
 * Keeps different logical streams separated (e.g. generators vs. tests).
 */
export function getOrCreateTerminal(name: string): vscode.Terminal {
  return vscode.window.terminals.find(t => t.name === name) ?? vscode.window.createTerminal({ name });
}

// Add helpers like sendRailsCommand("bin/rails …") if repeated further.
