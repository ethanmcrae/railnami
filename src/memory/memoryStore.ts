import * as vscode from 'vscode';
import { isPartialPath } from "../rails/partialPath";
import { CounterEntry, FileInfo, MemoryEntry } from "../types";
import { WorkspaceLocals } from "../vscode/workspaceLocals";

/** In-memory store of recent partials; extensible to hold other kinds of memory later. */
export class MemoryStore {
  private static recentPartials: MemoryEntry[] = [];

  static editorUpdate(): void {
    this.cleanup();

    const [ partialName, partialUri ] = isPartialPath();
    if (partialName && partialUri) {
      this.addRecentPartial(partialName, partialUri);
    }
  }

  static addRecentPartial(fileName: string, uri: vscode.Uri): void {
    this.cleanup();
    const now = Date.now();
    this.recentPartials.push({ fileName, uri, timestamp: now });
  }

  static getRecentPartials(amount: number): MemoryEntry[] {
    this.cleanup();
    return this.recentPartials
      .slice(0, amount)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  static async getRecommendedPartials(amount: number): Promise<FileInfo[]> {
    const recent = this.getRecentPartials(amount);

    // Fetch most-used partials
    const counters = await WorkspaceLocals.read<{ [name: string]: CounterEntry }>('partialRenderCounter') || {};
    // Get partials not in recent, sorted by count
    const recentNames = new Set(recent.map(e => e.fileName));
    const top = Object.entries(counters)
      .filter(([name]) => !recentNames.has(name))
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, amount - recent.length)
      .map(([name, data]) => ({ fileName: name, uri: data.uri }));

    // Combine and return
    return [...recent, ...top].slice(0, amount);
  }

  static async partialSelectedForRender(fileName: string, uri: vscode.Uri) {
    const ininitializedDefaults = { fileName, uri, count: 0 };
    await WorkspaceLocals.incrementObject(['partialRenderCounter', fileName], 'count', ininitializedDefaults);
  }

  private static cleanup(): void {
    const cutoff = Date.now() - TEN_MINUTES;
    this.recentPartials = this.recentPartials.filter(p => p.timestamp > cutoff);
  }
}

const TEN_MINUTES = 10 * 60 * 1000;
