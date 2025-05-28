import * as vscode from 'vscode';
import { buildLocalsSnippetArgs } from "../vscode/completion";

/**
 * Parses argument list from template locals string.
 * @param input The string to parse
 * @returns Object mapping variable names to values (or undefined if empty)
 */
export function parseLocalsArgs(input: string): Record<string, string | undefined> {
  // Match content inside parentheses after 'locals:'
  const match = input.match(/locals:\s*\(([^)]*)\)/);
  if (!match) return {};

  const argsStr = match[1];
  // RegEx to match 'variable: value' or 'variable:' (value optional)
  const regex = /\s*([\w$]+)\s*:\s*([^,)]*)/g;

  const result: Record<string, string | undefined> = {};
  let argMatch: RegExpExecArray | null;
  while ((argMatch = regex.exec(argsStr)) !== null) {
    const key = argMatch[1].trim();
    // If value is empty or only whitespace, set as undefined
    const value = argMatch[2].trim();
    result[key] = value.length > 0 ? value : undefined;
  }

  return result;
}

/**
 * Builds a render partial snippet string with snippet placeholders for arguments.
 * @param partialName The name of the partial (string)
 * @param args Record of variable names and their default values (can be undefined)
 * @returns A SnippetString instance
 */

export function buildRenderPartialSnippet(
  partialName: string,
  args: Record<string, string | undefined>
): vscode.SnippetString {
  const localsArgs = buildLocalsSnippetArgs(args);
  const localsPart = localsArgs ? `, ${localsArgs}` : '';
  return new vscode.SnippetString(`<%= render "${partialName}"${localsPart} %>`);
}
