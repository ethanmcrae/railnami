import * as vscode from 'vscode';

export class WorkspaceLocals {
  private static context: vscode.ExtensionContext;

  static init(context: vscode.ExtensionContext) {
    WorkspaceLocals.context = context;
  }

  private static get state() {
    if (!WorkspaceLocals.context) throw new Error('WorkspaceLocals not initialized!');
    return WorkspaceLocals.context.workspaceState;
  }

  // --- Single key methods ---
  static async read<T>(key: string): Promise<T | undefined> {
    return WorkspaceLocals.state.get<T>(key);
  }

  static async update<T>(key: string, value: T): Promise<void> {
    await WorkspaceLocals.state.update(key, value);
  }

  static async increment(key: string): Promise<number> {
    const current = WorkspaceLocals.state.get<number>(key) ?? 0;
    const updated = current + 1;
    await WorkspaceLocals.state.update(key, updated);
    return updated;
  }

  static async delete(key: string): Promise<void> {
    await WorkspaceLocals.state.update(key, undefined);
  }

  // --- Object methods ---
  static async readObject<T>(objectPath: string[], propertyKey: string): Promise<T | undefined> {
    const rootObj = WorkspaceLocals.state.get<any>(objectPath[0]) ?? {};
    const obj = this.deepGet(rootObj, objectPath.slice(1));
    return obj ? obj[propertyKey] : undefined;
  }

  static async updateObject<T>(objectPath: string[], propertyKey: string, value: T, initObject?: any): Promise<void> {
    const rootKey = objectPath[0];
    const rootObj = WorkspaceLocals.state.get<any>(rootKey) ?? {};
    const obj = this.deepGet(rootObj, objectPath.slice(1)) ?? initObject;
    obj[propertyKey] = value;
    this.deepSet(rootObj, objectPath.slice(1), obj);
    await WorkspaceLocals.state.update(rootKey, rootObj);
  }

  static async incrementObject(objectPath: string[], propertyKey: string, initObject?: any): Promise<number> {
    const rootKey = objectPath[0];
    const rootObj = WorkspaceLocals.state.get<any>(rootKey) ?? {};
    let obj = this.deepGet(rootObj, objectPath.slice(1)) ?? initObject;
    obj[propertyKey] = (obj[propertyKey] ?? 0) + 1;
    this.deepSet(rootObj, objectPath.slice(1), obj);
    await WorkspaceLocals.state.update(rootKey, rootObj);
    return obj[propertyKey];
  }

  static async deleteObject(objectPath: string[], propertyKey: string): Promise<void> {
    const rootKey = objectPath[0];
    const rootObj = WorkspaceLocals.state.get<any>(rootKey) ?? {};
    const obj = this.deepGet(rootObj, objectPath.slice(1));
    if (obj && propertyKey in obj) {
      delete obj[propertyKey];
      this.deepSet(rootObj, objectPath.slice(1), obj);
      await WorkspaceLocals.state.update(rootKey, rootObj);
    }
  }

  // --- Object helpers ---
  private static deepGet(obj: any, path: string[]): any {
    return path.reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  // Deep set helper (mutates the object)
  private static deepSet(obj: any, path: string[], value: any): void {
    path.slice(0, -1).reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, obj)[path[path.length - 1]] = value;
  }
}
