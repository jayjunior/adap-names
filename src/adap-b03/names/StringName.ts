import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super();
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
        return this.name.split(new RegExp(`(?<!${ESCAPE_CHARACTER})${escapedDelimiter}`, 'g')).map(
            component => component.replace(new RegExp(`\\${ESCAPE_CHARACTER}${escapedDelimiter}`, 'g'), this.delimiter));
    }
}