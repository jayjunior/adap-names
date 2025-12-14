import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

/**
 * Abstract base class for Name implementations.
 * Name is a VALUE TYPE - all instances are immutable.
 * 
 * The equality contract for value objects:
 * 1. Reflexive: x.isEqual(x) returns true
 * 2. Symmetric: x.isEqual(y) returns true iff y.isEqual(x) returns true
 * 3. Transitive: if x.isEqual(y) and y.isEqual(z), then x.isEqual(z)
 * 4. Consistent: multiple invocations return the same result
 * 5. Null-Object: x.isEqual(null) returns false
 * 
 * Additionally for value types:
 * - The interface represents the value type
 * - Implementation classes represent an equivalency set
 */
export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // Precondition: delimiter must be a single character
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "delimiter is null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        this.delimiter = delimiter;
        
        // Note: assertClassInvariants() is NOT called here because
        // subclass fields are not yet initialized. Subclasses must call
        // assertClassInvariants() at the end of their constructors.
    }

    /**
     * For immutable value types, clone can return the same instance
     * since the object cannot be modified.
     */
    public clone(): Name {
        // For immutable objects, returning this is safe and efficient
        return this;
    }

    public asString(delimiter?: string): string {
        // Handle undefined by using default delimiter
        if (delimiter === undefined) {
            delimiter = this.delimiter;
        }
        
        // Precondition: delimiter must not be null and must be a single character
        IllegalArgumentException.assert(delimiter !== null, "delimiter is null");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            // Unmask the component for display
            components.push(this.unmaskComponent(this.getComponent(i), delimiter));
        }
        const result = components.join(delimiter);
        
        // Postcondition: result should not be null
        MethodFailedException.assert(result !== null && result !== undefined, "asString returned null or undefined");
        
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            // Keep components as stored (masked) for data string
            components.push(this.getComponent(i));
        }
        const result = components.join(DEFAULT_DELIMITER);
        
        // Postcondition: result should not be null
        MethodFailedException.assert(result !== null && result !== undefined, "asDataString returned null or undefined");
        
        return result;
    }

    /**
     * Value equality: two Names are equal if they have the same components
     * and the same delimiter. Implementation classes form an equivalency set.
     */
    public isEqual(other: Name): boolean {
        // Precondition: other must not be null or undefined
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name is null or undefined");
        
        // Check if same reference (optimization for immutable objects)
        if (this === other) {
            return true;
        }
        
        // Check number of components
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        
        // Check each component
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        
        // Check delimiter
        return this.delimiter === other.getDelimiterCharacter();
    }

    /**
     * Hash code must be consistent with equals:
     * If x.isEqual(y) then x.getHashCode() === y.getHashCode()
     */
    public getHashCode(): number {
        let hash = 0;
        
        // Include delimiter in hash
        hash = this.hashString(this.delimiter, hash);
        
        // Include each component
        for (let i = 0; i < this.getNoComponents(); i++) {
            hash = this.hashString(this.getComponent(i), hash);
        }
        
        return hash;
    }

    /**
     * Helper method to hash a string into an existing hash value.
     */
    private hashString(str: string, existingHash: number): number {
        let hash = existingHash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /**
     * Helper method to unmask a component string for display.
     * Removes escape characters before special characters.
     */
    protected unmaskComponent(component: string, delimiter: string): string {
        let result = '';
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                const nextChar = component[i + 1];
                if (nextChar === delimiter || nextChar === ESCAPE_CHARACTER) {
                    result += nextChar;
                    i += 2;
                    continue;
                }
            }
            result += component[i];
            i++;
        }
        return result;
    }

    /**
     * Asserts class invariants:
     * - delimiter must be a single character
     * - delimiter must not be null or undefined
     */
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

    // Abstract methods - to be implemented by subclasses
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    
    // Immutable mutation methods - return new instances
    abstract setComponent(i: number, c: string): Name;
    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;
    abstract concat(other: Name): Name;
}
