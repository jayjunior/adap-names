import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        // Precondition: basename must not be null or undefined
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "basename is null or undefined");
        // Precondition: parent node must not be null or undefined
        IllegalArgumentException.assert(pn !== null && pn !== undefined, "parent node is null or undefined");
        
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        // Precondition: target directory must not be null or undefined
        IllegalArgumentException.assert(to !== null && to !== undefined, "target directory is null or undefined");
        
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
        
        // Postcondition: parent node should be updated
        MethodFailedException.assert(this.parentNode === to, "move did not update parent node");
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        
        // Postcondition: result should not be null
        MethodFailedException.assert(result !== null && result !== undefined, "getFullName returned null or undefined");
        
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        // Precondition: basename must not be null or undefined
        IllegalArgumentException.assert(bn !== null && bn !== undefined, "basename is null or undefined");
        
        this.doSetBaseName(bn);
        
        // Postcondition: basename should be updated
        MethodFailedException.assert(this.getBaseName() === bn, "rename did not update basename");
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
