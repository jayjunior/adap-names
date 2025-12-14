import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { Name } from "../../../src/adap-b06/names/Name";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";

/**
 * Tests for Name as a Value Type (adap-b06)
 * 
 * Key concepts tested:
 * 1. Immutability - mutation methods return new instances
 * 2. Value equality contract - reflexive, symmetric, transitive, consistent
 * 3. Hash code consistency with equals
 * 4. Clone semantics for immutable objects
 */

describe("Name Value Type Tests - Immutability", () => {
  
  describe("StringName Immutability", () => {
    it("setComponent should return new instance", () => {
      const original = new StringName("a.b.c");
      const modified = original.setComponent(1, "x");
      
      // Original should be unchanged
      expect(original.getComponent(1)).toBe("b");
      // Modified should have the change
      expect(modified.getComponent(1)).toBe("x");
      // They should be different objects (or at least have different values)
      expect(original.isEqual(modified)).toBe(false);
    });

    it("insert should return new instance", () => {
      const original = new StringName("a.b.c");
      const modified = original.insert(1, "x");
      
      // Original should be unchanged
      expect(original.getNoComponents()).toBe(3);
      // Modified should have the new component
      expect(modified.getNoComponents()).toBe(4);
      expect(modified.getComponent(1)).toBe("x");
    });

    it("append should return new instance", () => {
      const original = new StringName("a.b.c");
      const modified = original.append("d");
      
      // Original should be unchanged
      expect(original.getNoComponents()).toBe(3);
      // Modified should have the new component
      expect(modified.getNoComponents()).toBe(4);
      expect(modified.getComponent(3)).toBe("d");
    });

    it("remove should return new instance", () => {
      const original = new StringName("a.b.c");
      const modified = original.remove(1);
      
      // Original should be unchanged
      expect(original.getNoComponents()).toBe(3);
      expect(original.getComponent(1)).toBe("b");
      // Modified should have the component removed
      expect(modified.getNoComponents()).toBe(2);
      expect(modified.getComponent(1)).toBe("c");
    });

    it("concat should return new instance", () => {
      const name1 = new StringName("a.b");
      const name2 = new StringName("c.d");
      const concatenated = name1.concat(name2);
      
      // Originals should be unchanged
      expect(name1.getNoComponents()).toBe(2);
      expect(name2.getNoComponents()).toBe(2);
      // Concatenated should have all components
      expect(concatenated.getNoComponents()).toBe(4);
    });
  });

  describe("StringArrayName Immutability", () => {
    it("setComponent should return new instance", () => {
      const original = new StringArrayName(["a", "b", "c"]);
      const modified = original.setComponent(1, "x");
      
      expect(original.getComponent(1)).toBe("b");
      expect(modified.getComponent(1)).toBe("x");
      expect(original.isEqual(modified)).toBe(false);
    });

    it("insert should return new instance", () => {
      const original = new StringArrayName(["a", "b", "c"]);
      const modified = original.insert(1, "x");
      
      expect(original.getNoComponents()).toBe(3);
      expect(modified.getNoComponents()).toBe(4);
      expect(modified.getComponent(1)).toBe("x");
    });

    it("append should return new instance", () => {
      const original = new StringArrayName(["a", "b", "c"]);
      const modified = original.append("d");
      
      expect(original.getNoComponents()).toBe(3);
      expect(modified.getNoComponents()).toBe(4);
      expect(modified.getComponent(3)).toBe("d");
    });

    it("remove should return new instance", () => {
      const original = new StringArrayName(["a", "b", "c"]);
      const modified = original.remove(1);
      
      expect(original.getNoComponents()).toBe(3);
      expect(modified.getNoComponents()).toBe(2);
      expect(modified.getComponent(1)).toBe("c");
    });

    it("concat should return new instance", () => {
      const name1 = new StringArrayName(["a", "b"]);
      const name2 = new StringArrayName(["c", "d"]);
      const concatenated = name1.concat(name2);
      
      expect(name1.getNoComponents()).toBe(2);
      expect(name2.getNoComponents()).toBe(2);
      expect(concatenated.getNoComponents()).toBe(4);
    });
  });
});

describe("Name Value Type Tests - Equality Contract", () => {
  
  describe("Reflexive Property", () => {
    it("StringName: x.isEqual(x) should return true", () => {
      const name = new StringName("a.b.c");
      expect(name.isEqual(name)).toBe(true);
    });

    it("StringArrayName: x.isEqual(x) should return true", () => {
      const name = new StringArrayName(["a", "b", "c"]);
      expect(name.isEqual(name)).toBe(true);
    });
  });

  describe("Symmetric Property", () => {
    it("StringName: x.isEqual(y) iff y.isEqual(x)", () => {
      const x = new StringName("a.b.c");
      const y = new StringName("a.b.c");
      
      expect(x.isEqual(y)).toBe(true);
      expect(y.isEqual(x)).toBe(true);
    });

    it("StringArrayName: x.isEqual(y) iff y.isEqual(x)", () => {
      const x = new StringArrayName(["a", "b", "c"]);
      const y = new StringArrayName(["a", "b", "c"]);
      
      expect(x.isEqual(y)).toBe(true);
      expect(y.isEqual(x)).toBe(true);
    });

    it("Mixed types: StringName and StringArrayName with same content should be equal", () => {
      const stringName = new StringName("a.b.c");
      const arrayName = new StringArrayName(["a", "b", "c"]);
      
      expect(stringName.isEqual(arrayName)).toBe(true);
      expect(arrayName.isEqual(stringName)).toBe(true);
    });

    it("Symmetric for unequal names", () => {
      const x = new StringName("a.b.c");
      const y = new StringName("a.b.d");
      
      expect(x.isEqual(y)).toBe(false);
      expect(y.isEqual(x)).toBe(false);
    });
  });

  describe("Transitive Property", () => {
    it("if x.isEqual(y) and y.isEqual(z), then x.isEqual(z)", () => {
      const x = new StringName("a.b.c");
      const y = new StringArrayName(["a", "b", "c"]);
      const z = new StringName("a.b.c");
      
      expect(x.isEqual(y)).toBe(true);
      expect(y.isEqual(z)).toBe(true);
      expect(x.isEqual(z)).toBe(true);
    });

    it("Transitivity with three different instances", () => {
      const x = new StringArrayName(["x", "y", "z"]);
      const y = new StringArrayName(["x", "y", "z"]);
      const z = new StringArrayName(["x", "y", "z"]);
      
      expect(x.isEqual(y)).toBe(true);
      expect(y.isEqual(z)).toBe(true);
      expect(x.isEqual(z)).toBe(true);
    });
  });

  describe("Consistency Property", () => {
    it("Multiple invocations return same result", () => {
      const x = new StringName("a.b.c");
      const y = new StringName("a.b.c");
      
      // Call multiple times
      expect(x.isEqual(y)).toBe(true);
      expect(x.isEqual(y)).toBe(true);
      expect(x.isEqual(y)).toBe(true);
    });

    it("Consistent for unequal names", () => {
      const x = new StringName("a.b.c");
      const y = new StringName("a.b.d");
      
      expect(x.isEqual(y)).toBe(false);
      expect(x.isEqual(y)).toBe(false);
      expect(x.isEqual(y)).toBe(false);
    });
  });

  describe("Null-Object Property", () => {
    it("x.isEqual(null) should throw IllegalArgumentException", () => {
      const name = new StringName("a.b.c");
      expect(() => name.isEqual(null as any)).toThrow(IllegalArgumentException);
    });

    it("x.isEqual(undefined) should throw IllegalArgumentException", () => {
      const name = new StringArrayName(["a", "b", "c"]);
      expect(() => name.isEqual(undefined as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("Equality with different component counts", () => {
    it("Names with different component counts should not be equal", () => {
      const name1 = new StringName("a.b");
      const name2 = new StringName("a.b.c");
      
      expect(name1.isEqual(name2)).toBe(false);
      expect(name2.isEqual(name1)).toBe(false);
    });
  });

  describe("Equality with different delimiters", () => {
    it("Names with same components but different delimiters should not be equal", () => {
      const name1 = new StringName("a.b.c", ".");
      const name2 = new StringName("a/b/c", "/");
      
      // They have different delimiters, so should not be equal
      expect(name1.isEqual(name2)).toBe(false);
    });
  });
});

describe("Name Value Type Tests - Hash Code Contract", () => {
  
  describe("Hash Code Consistency with Equals", () => {
    it("Equal StringNames should have same hash code", () => {
      const x = new StringName("a.b.c");
      const y = new StringName("a.b.c");
      
      expect(x.isEqual(y)).toBe(true);
      expect(x.getHashCode()).toBe(y.getHashCode());
    });

    it("Equal StringArrayNames should have same hash code", () => {
      const x = new StringArrayName(["a", "b", "c"]);
      const y = new StringArrayName(["a", "b", "c"]);
      
      expect(x.isEqual(y)).toBe(true);
      expect(x.getHashCode()).toBe(y.getHashCode());
    });

    it("Equal mixed types should have same hash code", () => {
      const stringName = new StringName("a.b.c");
      const arrayName = new StringArrayName(["a", "b", "c"]);
      
      expect(stringName.isEqual(arrayName)).toBe(true);
      expect(stringName.getHashCode()).toBe(arrayName.getHashCode());
    });

    it("Hash code is consistent across multiple calls", () => {
      const name = new StringName("a.b.c");
      
      const hash1 = name.getHashCode();
      const hash2 = name.getHashCode();
      const hash3 = name.getHashCode();
      
      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
    });
  });

  describe("Hash Code for Different Names", () => {
    it("Different names typically have different hash codes", () => {
      const name1 = new StringName("a.b.c");
      const name2 = new StringName("x.y.z");
      
      // Note: This is not guaranteed by the contract, but is expected for good hash functions
      expect(name1.getHashCode()).not.toBe(name2.getHashCode());
    });
  });
});

describe("Name Value Type Tests - Clone Semantics", () => {
  
  describe("Clone for Immutable Objects", () => {
    it("StringName clone returns same instance (immutable optimization)", () => {
      const original = new StringName("a.b.c");
      const cloned = original.clone();
      
      // For immutable objects, clone can return same instance
      expect(cloned).toBe(original);
    });

    it("StringArrayName clone returns same instance (immutable optimization)", () => {
      const original = new StringArrayName(["a", "b", "c"]);
      const cloned = original.clone();
      
      expect(cloned).toBe(original);
    });

    it("Cloned name is equal to original", () => {
      const original = new StringName("a.b.c");
      const cloned = original.clone();
      
      expect(cloned.isEqual(original)).toBe(true);
    });
  });
});

describe("Name Value Type Tests - Preconditions", () => {
  
  describe("Constructor Preconditions", () => {
    it("StringName should reject null source", () => {
      expect(() => new StringName(null as any)).toThrow(IllegalArgumentException);
    });

    it("StringName should reject undefined source", () => {
      expect(() => new StringName(undefined as any)).toThrow(IllegalArgumentException);
    });

    it("StringArrayName should reject null source", () => {
      expect(() => new StringArrayName(null as any)).toThrow(IllegalArgumentException);
    });

    it("StringArrayName should reject undefined source", () => {
      expect(() => new StringArrayName(undefined as any)).toThrow(IllegalArgumentException);
    });

    it("should reject delimiter with length != 1", () => {
      expect(() => new StringName("test", "..")).toThrow(IllegalArgumentException);
      expect(() => new StringName("test", "")).toThrow(IllegalArgumentException);
    });
  });

  describe("getComponent Preconditions", () => {
    it("should reject negative index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.getComponent(-1)).toThrow(IllegalArgumentException);
    });

    it("should reject out of bounds index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.getComponent(5)).toThrow(IllegalArgumentException);
    });
  });

  describe("setComponent Preconditions", () => {
    it("should reject negative index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.setComponent(-1, "x")).toThrow(IllegalArgumentException);
    });

    it("should reject out of bounds index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.setComponent(5, "x")).toThrow(IllegalArgumentException);
    });

    it("should reject null component", () => {
      const name = new StringName("a.b.c");
      expect(() => name.setComponent(0, null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("insert Preconditions", () => {
    it("should reject negative index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.insert(-1, "x")).toThrow(IllegalArgumentException);
    });

    it("should reject out of bounds index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.insert(10, "x")).toThrow(IllegalArgumentException);
    });

    it("should accept insert at end (index == length)", () => {
      const name = new StringName("a.b.c");
      const result = name.insert(3, "d");
      expect(result.getNoComponents()).toBe(4);
      expect(result.getComponent(3)).toBe("d");
    });
  });

  describe("append Preconditions", () => {
    it("should reject null component", () => {
      const name = new StringName("a.b.c");
      expect(() => name.append(null as any)).toThrow(IllegalArgumentException);
    });

    it("should reject undefined component", () => {
      const name = new StringName("a.b.c");
      expect(() => name.append(undefined as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("remove Preconditions", () => {
    it("should reject negative index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.remove(-1)).toThrow(IllegalArgumentException);
    });

    it("should reject out of bounds index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.remove(5)).toThrow(IllegalArgumentException);
    });

    it("should reject remove from empty name", () => {
      const name = new StringName("");
      expect(() => name.remove(0)).toThrow(IllegalArgumentException);
    });
  });

  describe("concat Preconditions", () => {
    it("should reject null name", () => {
      const name = new StringName("a.b.c");
      expect(() => name.concat(null as any)).toThrow(IllegalArgumentException);
    });

    it("should reject undefined name", () => {
      const name = new StringName("a.b.c");
      expect(() => name.concat(undefined as any)).toThrow(IllegalArgumentException);
    });
  });
});

describe("Name Value Type Tests - Functional Behavior", () => {
  
  describe("Chain of Operations", () => {
    it("should support chaining immutable operations", () => {
      const original = new StringName("a.b.c");
      
      const result = original
        .append("d")
        .setComponent(0, "x")
        .insert(1, "y")
        .remove(2);
      
      // Original should be unchanged
      expect(original.getNoComponents()).toBe(3);
      expect(original.getComponent(0)).toBe("a");
      
      // Result should have all changes
      expect(result.getNoComponents()).toBe(4);
      expect(result.getComponent(0)).toBe("x");
      expect(result.getComponent(1)).toBe("y");
    });
  });

  describe("String Representations", () => {
    it("asString should work correctly", () => {
      const name = new StringName("a.b.c");
      expect(name.asString()).toBe("a.b.c");
      expect(name.asString("/")).toBe("a/b/c");
    });

    it("asDataString should use default delimiter", () => {
      const name = new StringName("a/b/c", "/");
      expect(name.asDataString()).toBe("a.b.c");
    });

    it("toString should return data string", () => {
      const name = new StringName("a.b.c");
      expect(name.toString()).toBe(name.asDataString());
    });
  });

  describe("isEmpty", () => {
    it("should return true for empty name", () => {
      const name = new StringArrayName([]);
      expect(name.isEmpty()).toBe(true);
    });

    it("should return false for non-empty name", () => {
      const name = new StringName("a.b.c");
      expect(name.isEmpty()).toBe(false);
    });
  });

  describe("getDelimiterCharacter", () => {
    it("should return the delimiter", () => {
      const name1 = new StringName("a.b.c");
      expect(name1.getDelimiterCharacter()).toBe(".");
      
      const name2 = new StringName("a/b/c", "/");
      expect(name2.getDelimiterCharacter()).toBe("/");
    });
  });
});

describe("Name Value Type Tests - Cross-Implementation Equivalence", () => {
  
  it("StringName and StringArrayName should behave identically for same content", () => {
    const stringName = new StringName("a.b.c");
    const arrayName = new StringArrayName(["a", "b", "c"]);
    
    expect(stringName.isEqual(arrayName)).toBe(true);
    expect(arrayName.isEqual(stringName)).toBe(true);
    expect(stringName.getHashCode()).toBe(arrayName.getHashCode());
  });

  it("Operations on both types should produce equivalent results", () => {
    const stringName = new StringName("a.b.c");
    const arrayName = new StringArrayName(["a", "b", "c"]);
    
    const stringResult = stringName.append("d");
    const arrayResult = arrayName.append("d");
    
    expect(stringResult.isEqual(arrayResult)).toBe(true);
  });
});
