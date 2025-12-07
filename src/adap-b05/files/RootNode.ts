import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";
import { Node } from "./Node";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    protected assertClassInvariants(): void {
        // RootNode is allowed to have empty basename
    }

    public findNodes(bn: string): Set<Node> {
        try {
            return super.findNodes(bn);
        } catch (ex) {
            if (ex instanceof Exception) {
                throw new ServiceFailureException("file system service failed", ex);
            }
            throw ex;
        }
    }

}