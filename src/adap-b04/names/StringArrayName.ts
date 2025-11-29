import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        // Precondition: source must not be null or undefined
        IllegalArgumentException.assert(source !== null && source !== undefined, "source array is null or undefined");
        
        super(delimiter);
        
        this.components = [...source];
        
        // Class invariant (check after initialization)
        this.assertClassInvariants();
    }

    public clone(): Name {
        const result = new StringArrayName(this.components, this.delimiter);
        
        // Postcondition: cloned object should be equal
        MethodFailedException.assert(result.isEqual(this), "clone did not create an equal object");
        
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        // Set default if undefined (but still check for null)
        if (delimiter === undefined) {
            delimiter = this.delimiter;
        }
        // Precondition: delimiter must be a single character
        IllegalArgumentException.assert(delimiter !== null, "delimiter is null");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        const result = this.components.map(c => this.unmask(c)).join(delimiter);
        
        // Postcondition: result should not be null
        MethodFailedException.assert(result !== null && result !== undefined, "asString returned null or undefined");
        
        return result;
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

    public setComponent(i: number, c: string): void {
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components[i] = c;
        
        // Postcondition: number of components should remain the same
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents, "setComponent changed number of components");
        // Postcondition: component should be set correctly
        MethodFailedException.assert(this.getComponent(i) === c, "setComponent did not set component correctly");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public insert(i: number, c: string): void {
        // Precondition: index must be valid (can be equal to length for append)
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i <= this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.splice(i, 0, c);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1, "insert did not add one component");
        // Postcondition: component should be inserted correctly
        MethodFailedException.assert(this.getComponent(i) === c, "insert did not insert component correctly");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public append(c: string): void {
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.push(c);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1, "append did not add one component");
        // Postcondition: component should be appended correctly
        MethodFailedException.assert(this.getComponent(this.getNoComponents() - 1) === c, "append did not append component correctly");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public remove(i: number): void {
        // Precondition: cannot remove from empty name (check first)
        IllegalArgumentException.assert(this.getNoComponents() > 1 || (this.getNoComponents() === 1 && this.getComponent(0) !== ""), "cannot remove from empty name");
        // Precondition: index must be valid
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index out of bounds");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.splice(i, 1);
        
        // Postcondition: number of components should decrease by 1
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents - 1, "remove did not remove one component");
        
        // Class invariant
        this.assertClassInvariants();
    }

    /**
     * Helper method to unmask a component string
     * Removes escape characters before special characters
     */
    private unmask(component: string): string {
        let result = '';
        let i = 0;
        while (i < component.length) {
            if (component[i] === ESCAPE_CHARACTER && i + 1 < component.length) {
                // Check if next character is a special character
                const nextChar = component[i + 1];
                if (nextChar === this.delimiter) {
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