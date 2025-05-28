import { Uri } from "vscode";
import { isPartialPath } from "../rails/partialPath";
import { MemoryEntry } from "../types";

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

  static addRecentPartial(fileName: string, uri: Uri): void {
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

  private static cleanup(): void {
    const cutoff = Date.now() - TEN_MINUTES;
    this.recentPartials = this.recentPartials.filter(p => p.timestamp > cutoff);
  }
}

const TEN_MINUTES = 10 * 60 * 1000;
