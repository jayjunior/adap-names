import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";
import { Printable } from "../common/Printable";

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Name is a VALUE TYPE - all instances are immutable.
 * Methods that would modify the name return a new Name instance instead.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export interface Name extends Cloneable, Printable, Equality {

    /**
     * Returns a shallow copy of this Name.
     * For immutable value types, this can return the same instance.
     */
    clone(): Name;

    /**
     * Returns true, if number of components == 0; else false
     */
    isEmpty(): boolean;

    /** 
     * Returns number of components in Name instance
     */
    getNoComponents(): number;

    /**
     * Returns component at index i
     * @param i Index of the component (0-based)
     */
    getComponent(i: number): string;

    /** 
     * Returns a new Name with the component at index i replaced by c.
     * Expects that new Name component c is properly masked.
     * @param i Index of the component to replace (0-based)
     * @param c New component value (properly masked)
     * @returns A new Name instance with the replaced component
     */
    setComponent(i: number, c: string): Name;

    /** 
     * Returns a new Name with component c inserted at index i.
     * Expects that new Name component c is properly masked.
     * @param i Index at which to insert (0-based)
     * @param c Component to insert (properly masked)
     * @returns A new Name instance with the inserted component
     */
    insert(i: number, c: string): Name;

    /** 
     * Returns a new Name with component c appended at the end.
     * Expects that new Name component c is properly masked.
     * @param c Component to append (properly masked)
     * @returns A new Name instance with the appended component
     */
    append(c: string): Name;

    /**
     * Returns a new Name with the component at index i removed.
     * @param i Index of the component to remove (0-based)
     * @returns A new Name instance with the component removed
     */
    remove(i: number): Name;

    /**
     * Returns a new Name that is the concatenation of this name and other.
     * @param other Name to concatenate
     * @returns A new Name instance with all components from both names
     */
    concat(other: Name): Name;
    
}
