import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = [];

    constructor(source: string, delimiter?: string) {
        // Precondition: source must not be null or undefined
        IllegalArgumentException.assert(source !== null && source !== undefined, "source string is null or undefined");
        
        super(delimiter);
        
        this.name = source;
        this.components = this.parseComponents(this.name);
        
        // Class invariant (check after initialization)
        this.assertClassInvariants();
    }

    public clone(): Name {
        const result = new StringName(this.name, this.delimiter);
        
        // Postcondition: cloned object should be equal
        MethodFailedException.assert(result.isEqual(this), "clone did not create an equal object");
        
        return result;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(x: number): string {
        // Precondition: index must be valid
        IllegalArgumentException.assert(x >= 0, "index must be non-negative");
        IllegalArgumentException.assert(x < this.getNoComponents(), "index out of bounds");
        
        const result = this.components[x];
        
        // Postcondition: result should not be null or undefined
        MethodFailedException.assert(result !== null && result !== undefined, "component is null or undefined");
        
        return result;
    }

    public setComponent(n: number, c: string): void {
        // Precondition: index must be valid
        IllegalArgumentException.assert(n >= 0, "index must be non-negative");
        IllegalArgumentException.assert(n < this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components[n] = c;
        this.name = this.components.join(this.delimiter);
        
        // Postcondition: number of components should remain the same
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents, "setComponent changed number of components");
        // Postcondition: component should be set correctly
        MethodFailedException.assert(this.getComponent(n) === c, "setComponent did not set component correctly");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public insert(n: number, c: string): void {
        // Precondition: index must be valid (can be equal to length for append)
        IllegalArgumentException.assert(n >= 0, "index must be non-negative");
        IllegalArgumentException.assert(n <= this.getNoComponents(), "index out of bounds");
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.splice(n, 0, c);
        this.name = this.components.join(this.delimiter);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1, "insert did not add one component");
        // Postcondition: component should be inserted correctly
        MethodFailedException.assert(this.getComponent(n) === c, "insert did not insert component correctly");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public append(c: string): void {
        // Precondition: component must not be null or undefined
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.push(c);
        this.name = this.components.join(this.delimiter);
        
        // Postcondition: number of components should increase by 1
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1, "append did not add one component");
        // Postcondition: component should be appended correctly
        MethodFailedException.assert(this.getComponent(this.getNoComponents() - 1) === c, "append did not append component correctly");
        
        // Class invariant
        this.assertClassInvariants();
    }

    public remove(n: number): void {
        // Precondition: cannot remove from empty name (check first)
        IllegalArgumentException.assert(this.getNoComponents() > 1 || (this.getNoComponents() === 1 && this.getComponent(0) !== ""), "cannot remove from empty name");
        // Precondition: index must be valid
        IllegalArgumentException.assert(n >= 0, "index must be non-negative");
        IllegalArgumentException.assert(n < this.getNoComponents(), "index out of bounds");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.splice(n, 1);
        this.name = this.components.join(this.delimiter);
        
        // Postcondition: number of components should decrease by 1
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents - 1, "remove did not remove one component");
        
        // Class invariant
        this.assertClassInvariants();
    }

    /**
     * Helper method to parse components from a string
     * Handles escape characters before delimiters
     */
    private parseComponents(source: string): string[] {
        let result: string[] = [];
        let i = 0;
        let currentComponent: string = "";
        while (i < source.length) {
            if (source[i] === ESCAPE_CHARACTER && i + 1 < source.length) {
                const nextChar = source[i + 1];
                if (nextChar === this.delimiter) {
                    currentComponent += nextChar;
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
        // Additional invariant: components array should match the parsed name
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