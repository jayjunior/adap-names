import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

/**
 * StringArrayName stores name components as an immutable array of strings.
 * This is a VALUE TYPE - all instances are immutable.
 * 
 * All mutation methods return new StringArrayName instances instead of
 * modifying the current instance.
 */
export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[];

    constructor(other: string[], delimiter?: string);
    constructor(other: StringArrayName);
    constructor(other: string[] | StringArrayName, delimiter?: string) {
        if (other instanceof StringArrayName) {
            // Copy constructor
            super(other.delimiter);
            this.components = other.components; // Already frozen
        } else {
            // Precondition: source must not be null or undefined
            IllegalArgumentException.assert(other !== null && other !== undefined, "source array is null or undefined");
            
            super(delimiter);
            
            // Create immutable copy of the array
            this.components = Object.freeze([...other]);
        }
        
        // Class invariant (check after initialization)
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
     * Returns a new StringArrayName with the component at index i replaced.
     */
    public setComponent(i: number, c: string): Name {
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const newComponents = [...this.components];
        newComponents[i] = c;
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        // Postcondition: new name should have same number of components
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents(), 
            "setComponent changed number of components");
        // Postcondition: component should be set correctly
        MethodFailedException.assert(result.getComponent(i) === c, 
            "setComponent did not set component correctly");
        
        return result;
    }

    /**
     * Returns a new StringArrayName with component c inserted at index i.
     */
    public insert(i: number, c: string): Name {
        // Precondition: index must be valid (can be equal to length for append)
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i <= this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents() + 1, 
            "insert did not add one component");
        // Postcondition: component should be inserted correctly
        MethodFailedException.assert(result.getComponent(i) === c, 
            "insert did not insert component correctly");
        
        return result;
    }

    /**
     * Returns a new StringArrayName with component c appended at the end.
     */
    public append(c: string): Name {
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const newComponents = [...this.components, c];
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents() + 1, 
            "append did not add one component");
        // Postcondition: component should be appended correctly
        MethodFailedException.assert(result.getComponent(result.getNoComponents() - 1) === c, 
            "append did not append component correctly");
        
        return result;
    }

    /**
     * Returns a new StringArrayName with the component at index i removed.
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
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        // Postcondition: number of components should decrease by 1
        MethodFailedException.assert(result.getNoComponents() === this.getNoComponents() - 1, 
            "remove did not remove one component");
        
        return result;
    }

    /**
     * Returns a new StringArrayName that is the concatenation of this name and other.
     */
    public concat(other: Name): Name {
        // Precondition: other must not be null or undefined
        IllegalArgumentException.assert(other !== null && other !== undefined, "other name is null or undefined");
        
        const newComponents = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            newComponents.push(other.getComponent(i));
        }
        
        const result = new StringArrayName(newComponents, this.delimiter);
        
        // Postcondition: number of components should be sum of both
        MethodFailedException.assert(
            result.getNoComponents() === this.getNoComponents() + other.getNoComponents(),
            "concat did not add the correct number of components"
        );
        
        return result;
    }

    /**
     * Asserts class invariants for StringArrayName
     */
    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        // Additional invariant: components array should not be null
        InvalidStateException.assert(
            this.components !== null && this.components !== undefined,
            "class invariant violated: components is null or undefined"
        );
    }
}
