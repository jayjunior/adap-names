import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        // Precondition: Don't open an open file
        IllegalArgumentException.assert(
            this.state !== FileState.OPEN, 
            "cannot open an already open file"
        );
        // Precondition: Don't open a deleted file
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED, 
            "cannot open a deleted file"
        );
        
        const oldState = this.state;
        this.state = FileState.OPEN;
        
        // Postcondition: file should be open
        MethodFailedException.assert(
            this.state === FileState.OPEN,
            "open failed to set file state to OPEN"
        );
    }

    public read(noBytes: number): Int8Array {
        // Precondition: Don't read from a closed file
        IllegalArgumentException.assert(
            this.state !== FileState.CLOSED, 
            "cannot read from a closed file"
        );
        // Precondition: Don't read from a deleted file
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED, 
            "cannot read from a deleted file"
        );
        // Precondition: noBytes must be non-negative
        IllegalArgumentException.assert(
            noBytes >= 0,
            "number of bytes must be non-negative"
        );
        
        // read something
        const result = new Int8Array(noBytes);
        
        // Postcondition: result should not be null
        MethodFailedException.assert(
            result !== null && result !== undefined,
            "read returned null or undefined"
        );
        
        return result;
    }

    public close(): void {
        // Precondition: Don't close a closed file
        IllegalArgumentException.assert(
            this.state !== FileState.CLOSED, 
            "cannot close an already closed file"
        );
        // Precondition: Don't close a deleted file
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED, 
            "cannot close a deleted file"
        );
        
        this.state = FileState.CLOSED;
        
        // Postcondition: file should be closed
        MethodFailedException.assert(
            this.state === FileState.CLOSED,
            "close failed to set file state to CLOSED"
        );
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}