import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

/**
 * StringName stores name as an immutable string.
 * This is a VALUE TYPE - all instances are immutable.
 * 
 * All mutation methods return new StringName instances instead of
 * modifying the current instance.
 */
export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly components: readonly string[];

    constructor(other: string, delimiter?: string);
    constructor(other: StringName);
    constructor(other: string | StringName, delimiter?: string) {
        if (other instanceof StringName) {
            // Copy constructor
            super(other.delimiter);
            this.name = other.name;
            this.components = other.components; // Already frozen
        } else {
            // Precondition: source must not be null or undefined
            IllegalArgumentException.assert(other !== null && other !== undefined, "source string is null or undefined");
            
            super(delimiter);
            
            this.name = other;
            this.components = Object.freeze(this.parseComponents(other));
        }
        
        // Assert class invariants after construction
        this.assertClassInvariants();
    }

    /**
     * For immutable value types, clone returns the same instance.
     */
    public clone(): Name {
        return this;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
        
        const result = this.components[i];
        
        // Postcondition: result should not be null or undefined
        MethodFailedException.assert(result !== null && result !== undefined, "component is null or undefined");
        
        return result;
    }

    /**
     * Returns a new StringName with the component at index i replaced.
     */
    public setComponent(i: number, c: string): Name {
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const newComponents = [...this.components];
        newComponents[i] = c;
        
        const result = this.createFromComponents(newComponents);
        
        // Postcondition: new name should have same number of components
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents(), 
            "setComponent changed number of components");
        // Postcondition: component should be set correctly
        MethodFailedException.assert(result.getComponent(i) === c, 
            "setComponent did not set component correctly");
        
        return result;
    }

    /**
     * Returns a new StringName with component c inserted at index i.
     */
    public insert(i: number, c: string): Name {
        // Precondition: index must be valid (can be equal to length for append)
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i <= this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        
        const result = this.createFromComponents(newComponents);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents() + 1, 
            "insert did not add one component");
        // Postcondition: component should be inserted correctly
        MethodFailedException.assert(result.getComponent(i) === c, 
            "insert did not insert component correctly");
        
        return result;
    }

    /**
     * Returns a new StringName with component c appended at the end.
     */
    public append(c: string): Name {
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const newComponents = [...this.components, c];
        
        const result = this.createFromComponents(newComponents);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents() + 1, 
            "append did not add one component");
        // Postcondition: component should be appended correctly
        MethodFailedException.assert(result.getComponent(result.getNoComponents() - 1) === c, 
            "append did not append component correctly");
        
        return result;
    }

    /**
     * Returns a new StringName with the component at index i removed.
     */
    public remove(i: number): Name {
        // Precondition: cannot remove from empty name (check first)
        IllegalArgumentException.assert(
            this.getNoComponents() > 1 || (this.getNoComponents() === 1 && this.getComponent(0) !== ""), 
            "cannot remove from empty name"
        );
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
        
        const newComponents = [...this.components];
        newComponents.splice(i, 1);
        
        const result = this.createFromComponents(newComponents);
        
        // Postcondition: number of components should decrease by 1
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents() - 1, 
            "remove did not remove one component");
        
        return result;
    }

    /**
     * Returns a new StringName that is the concatenation of this name and other.
     */
    public concat(other: Name): Name {
        // Precondition: other must not be null or undefined
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name is null or undefined");
        
        const newComponents = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            newComponents.push(other.getComponent(i));
        }
        
        const result = this.createFromComponents(newComponents);
        
        // Postcondition: number of components should be sum of both
        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() + other.getNoComponents(),
            "concat did not add the correct number of components"
        );
        
        return result;
    }

    /**
     * Helper method to create a new StringName from an array of components.
     */
    private createFromComponents(components: string[]): StringName {
        const newName = components.join(this.delimiter);
        return new StringName(newName, this.delimiter);
    }

    /**
     * Parse the source string into components, respecting escape characters.
     */
    private parseComponents(source: string): string[] {
        const result: string[] = [];
        let i = 0;
        let currentComponent = "";
        
        while (i < source.length) {
            if (source[i] === ESCAPE_CHARACTER && i + 1 < source.length) {
                const nextChar = source[i + 1];
                if (nextChar === this.delimiter || nextChar === ESCAPE_CHARACTER) {
                    // Escaped special character - include escape and character in component
                    currentComponent += source[i] + nextChar;
                    i += 2;
                    continue;
                }
            }
            if (source[i] === this.delimiter) {
                result.push(currentComponent);
                currentComponent = "";
            } else {
                currentComponent += source[i];
            }
            i++;
        }
        result.push(currentComponent);
        return result;
    }

    /**
     * Asserts class invariants for StringName
     */
    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        // Additional invariants
        InvalidStateException.assert(
            this.components !== null && this.components !== undefined,
            "class invariant violated: components is null or undefined"
        );
        InvalidStateException.assert(
            this.name !== null && this.name !== undefined,
            "class invariant violated: name is null or undefined"
        );
    }
}
