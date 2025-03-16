import { Brick } from "./Brick";

export class BrickDirectory {
    private reg = new Map<string, Brick<any>>();
    private static _instance = new BrickDirectory();

    static getInstance(): BrickDirectory {
        return this._instance;
    }

    registerBrick(name: string, brick: Brick<any>): void {
        this.reg.set(name, brick);
    }
}
