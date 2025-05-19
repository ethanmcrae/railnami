import { isPartialPath } from "../rails/partialPath";
import { MemoryEntry } from "../types";

/** In-memory store of recent partials; extensible to hold other kinds of memory later. */
export class MemoryStore {
  private static recentPartials: MemoryEntry[] = [];

  static editorUpdate(): void {
    this.cleanup();

    const partialName = isPartialPath();
    if (partialName) {
      this.addRecentPartial(partialName);
    }
  }

  static addRecentPartial(fileName: string): void {
    this.cleanup();
    const now = Date.now();
    this.recentPartials.push({ fileName, timestamp: now });
  }

  static getRecentPartials(amount: number): string[] {
    this.cleanup();
    return this.recentPartials
      .slice(0, amount)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(p => p.fileName);
  }

  private static cleanup(): void {
    const cutoff = Date.now() - FIVE_MINUTES;
    this.recentPartials = this.recentPartials.filter(p => p.timestamp > cutoff);
  }
}

const FIVE_MINUTES = 5 * 60 * 1000;
