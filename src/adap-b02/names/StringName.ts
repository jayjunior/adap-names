import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import {StringArrayName } from "./StringArrayName"

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected length: number = 0;
    private stringArray : StringArrayName;

    constructor(other: string, delimiter?: string) {
        this.name = other;
        this.delimiter = delimiter ?? this.delimiter;
        this.stringArray = new StringArrayName(this.name.split(this.delimiter),this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        let result : string  = "";
        for(let i = 0 ; i < this.getNoComponents() - 1 ; i++){
            result += this.getComponent(i) + delimiter;
        }
        return result+this.getComponent(this.getNoComponents()-1);
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.stringArray?.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return this.stringArray.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.stringArray.getNoComponents();
    }

    public getComponent(x: number): string {
        return this.stringArray.getComponent(x);
    }

    public setComponent(n: number, c: string): void {
        return this.stringArray.setComponent(n,c);
    }

    public insert(n: number, c: string): void {
        return this.stringArray.insert(n,c);
    }

    public append(c: string): void {
        return this.stringArray.append(c);
    }

    public remove(n: number): void {
        return this.stringArray.remove(n);
    }

    public concat(other: Name): void {
        return this.stringArray.concat(other);
    }

}