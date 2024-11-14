import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
       this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for(let i = 0 ; i < this.getNoComponents() - 1 ; i++){
            result += (this.getComponent(i) + delimiter);
        }
        return result + this.getComponent(this.getNoComponents() - 1);
    }

    public toString(): string {
        return this.asString()
    }

    public asDataString(): string {
        let result : string[]= []
        for(let i = 0 ; i < this.getNoComponents()  ; i++){
            result.push(this.getComponent(i).replace(this.delimiter,`${ESCAPE_CHARACTER}${this.delimiter}`))
        }
        return result.join(this.delimiter);
        
    }

    public isEqual(other: Name): boolean {
        return this.toString() === other.toString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        return {...this};
    }

    public isEmpty(): boolean {
       return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}