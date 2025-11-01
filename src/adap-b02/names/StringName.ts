import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;
    protected components: string[] = [];

    constructor(source: string, delimiter?: string) {
        this.name = source;
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.components = this.parseComponents(this.name);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
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

    public getComponent(x: number): string {
        return this.components[x];
    }

    public setComponent(n: number, c: string): void {
        this.components.splice(n, 0, c);
        this.name = this.components.join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        this.components.splice(n, 0, c);
        this.name = this.components.join(this.delimiter);
    }

    public append(c: string): void {
        this.components.push(c);
        this.name = this.components.join(this.delimiter);
    }

    public remove(n: number): void {
        this.components.splice(n, 1);
        this.name = this.components.join(this.delimiter)
    }

    public concat(other: Name): void {
        for(let i = 0 ; i < other.getNoComponents() ; i++){
            this.append(other.getComponent(i));
        }
    }


    // @methodtype helper-method
    /**
     * Helper method to parse components from a string
     * Handles escape characters before delimiters
     */
    private parseComponents(source: string): string[] {
        let result: string[] = [];
        let i = 0;
        let currentComponent : string = "";
        while (i < source.length) {
            if (source[i] === ESCAPE_CHARACTER && i + 1 < source.length) {
                const nextChar = source[i + 1];
                if (nextChar === this.delimiter) {
                    currentComponent += nextChar;
                    i += 2;
                    continue;
                }
            }
            if(source[i] === this.delimiter){
                result.push(currentComponent);
                currentComponent = "";
            }else{
                currentComponent+=source[i];
            }
            i++;
        }
        // Don't forget to add the last component!
        result.push(currentComponent);
        return result;
    }

}