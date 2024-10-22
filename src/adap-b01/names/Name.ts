export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    // @methodtype initialization method
    constructor(other: string[], delimiter?: string) {
        this.components = other;
        this.delimiter = delimiter?.valueOf() ?? this.DEFAULT_DELIMITER;
    }
    // @methodtype conversion method
    public asNameString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }
    // @methodtype getter
    public getComponent(i: number): string {
        return this.components[i];
    }
    // @methodtype setter
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }
    // @methodtype getter
    public getNoComponents(): number {
        return this.components.length;
    }
    // @methodtype command
    public insert(i: number, c: string): void {
        this.components.splice(i,0,c);
    }
    // @methodtype command
    public append(c: string): void {
        this.components.push(c);
    }
    // @methodtype command method
    public remove(i: number): void {
        this.components.splice(i,1);
    }

}