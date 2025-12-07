import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        this.assertClassInvariants();
        const result: Set<Node> = super.findNodes(bn);
        for (let child of this.childNodes) {
            const childResult: Set<Node> = child.findNodes(bn);
            childResult.forEach(n => result.add(n));
        }
        return result;
    }

}