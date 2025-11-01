import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        this.components = [...other];
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(c => this.unmask(c)).join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for(let i = 0 ; i < other.getNoComponents() ; i++){
            this.append(other.getComponent(i));
        }
    }

    // @methodtype helper-method
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

}