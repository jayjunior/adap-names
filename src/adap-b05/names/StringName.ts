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
        IllegalArgumentException.assert(source !== null && source !== undefined, "source string is null or undefined");
        
        super(delimiter);
        
        this.name = source;
        this.components = this.parseComponents(this.name);
        
        this.assertClassInvariants();
    }

    public clone(): Name {
        const result = new StringName(this.name, this.delimiter);
        
        MethodFailedException.assert(result.isEqual(this), "clone did not create an equal object");
        
        return result;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(x: number): string {
        IllegalArgumentException.assert(x >= 0, "index must be non-negative");
        IllegalArgumentException.assert(x < this.getNoComponents(), "index out of bounds");
        
        const result = this.components[x];
        
        MethodFailedException.assert(result !== null && result !== undefined, "component is null or undefined");
        
        return result;
    }

    public setComponent(n: number, c: string): void {
        IllegalArgumentException.assert(n >= 0, "index must be non-negative");
        IllegalArgumentException.assert(n < this.getNoComponents(), "index out of bounds");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components[n] = c;
        this.name = this.components.join(this.delimiter);
        
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents, "setComponent changed number of components");
        MethodFailedException.assert(this.getComponent(n) === c, "setComponent did not set component correctly");
        
        this.assertClassInvariants();
    }

    public insert(n: number, c: string): void {
        IllegalArgumentException.assert(n >= 0, "index must be non-negative");
        IllegalArgumentException.assert(n <= this.getNoComponents(), "index out of bounds");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.splice(n, 0, c);
        this.name = this.components.join(this.delimiter);
        
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1, "insert did not add one component");
        MethodFailedException.assert(this.getComponent(n) === c, "insert did not insert component correctly");
        
        this.assertClassInvariants();
    }

    public append(c: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined, "component is null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.push(c);
        this.name = this.components.join(this.delimiter);
        
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + 1, "append did not add one component");
        MethodFailedException.assert(this.getComponent(this.getNoComponents() - 1) === c, "append did not append component correctly");
        
        this.assertClassInvariants();
    }

    public remove(n: number): void {
        IllegalArgumentException.assert(this.getNoComponents() > 1 || (this.getNoComponents() === 1 && this.getComponent(0) !== ""), "cannot remove from empty name");
        IllegalArgumentException.assert(n >= 0, "index must be non-negative");
        IllegalArgumentException.assert(n < this.getNoComponents(), "index out of bounds");
        
        const oldNoComponents = this.getNoComponents();
        
        this.components.splice(n, 1);
        this.name = this.components.join(this.delimiter);
        
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents - 1, "remove did not remove one component");
        
        this.assertClassInvariants();
    }

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

    protected assertClassInvariants(): void {
        super.assertClassInvariants();
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