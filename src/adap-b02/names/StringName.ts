import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import {StringArrayName } from "./StringArrayName"

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected length: number = 0;


    constructor(other: string, delimiter?: string) {
        this.name = other;
        this.delimiter = delimiter ?? this.delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for(let i = 0 ; i < this.getNoComponents() - 1 ; i++){
            result += (this.getComponent(i) + delimiter);
        }
        return result + this.getComponent(this.getNoComponents() - 1);
    }

    public asDataString(): string {
        let result : string[]= []
        for(let i = 0 ; i < this.getNoComponents()  ; i++){
            result.push(this.getComponent(i).replace(this.delimiter,`${ESCAPE_CHARACTER}${this.delimiter}`))
        }
        return result.join(this.delimiter);
        
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
     }


    public getDelimiterCharacter(): string {
        return this.delimiter;
    }


    getNoComponents(): number {
        return this.getComponents().length;
    }

    getComponent(i: number): string {
        return this.getComponents()[i];
    }
    setComponent(i: number, c: string) {
        let components = this.getComponents();
        components[i] = c
        components.forEach(element => {
            element.replace(this.delimiter,`${ESCAPE_CHARACTER}${this.delimiter}`)
        });
        this.name = components.join(this.delimiter);
    }


    insert(i: number, c: string) {
        let components = this.getComponents();
        components.splice(i,0,c);
        this.name = components.join(this.delimiter);
    }
    append(c: string) {
        this.name = `${this.name}${this.delimiter}${c}`;
    }
    remove(i: number) {
        let components = this.getComponents();
        components.splice(i,1);
        this.name = components.join(this.delimiter);
    }
    private getComponents():string[]{
        const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let escapedDelimiter = escapeRegex(this.delimiter);
        return this.name.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})${escapedDelimiter}`, 'g')).map(
            component => component.replace(new RegExp(`\\${ESCAPE_CHARACTER}${escapedDelimiter}`, 'g'), this.delimiter));
    }
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}