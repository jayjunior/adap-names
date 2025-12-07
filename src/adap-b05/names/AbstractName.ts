import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "delimiter is null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        this.delimiter = delimiter;
    }

    public abstract clone(): Name;

    public asString(delimiter?: string): string {
        if (delimiter === undefined) {
            delimiter = this.delimiter;
        }
        
        IllegalArgumentException.assert(delimiter !== null, "delimiter is null");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = components.join(delimiter);
        
        MethodFailedException.assert(result !== null && result !== undefined, "asString returned null or undefined");
        
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const result = this.asString(DEFAULT_DELIMITER);
        
        MethodFailedException.assert(result !== null && result !== undefined, "asDataString returned null or undefined");
        
        return result;
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name is null or undefined");
        
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return this.delimiter === other.getDelimiterCharacter();
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        
        MethodFailedException.assert(
            this.getNoComponents() === oldNoComponents + other.getNoComponents(),
            "concat did not add the correct number of components"
        );
        
        this.assertClassInvariants();
    }

    protected assertClassInvariants(): void {
        InvalidStateException.assert(
            this.delimiter !== null && this.delimiter !== undefined,
            "class invariant violated: delimiter is null or undefined"
        );
        InvalidStateException.assert(
            this.delimiter.length === 1,
            "class invariant violated: delimiter must be a single character"
        );
    }

}