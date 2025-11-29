import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { Name } from "../../../src/adap-b04/names/Name";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b04/common/MethodFailedException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("Name Contract Tests - Preconditions", () => {
  
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

    it("should accept valid index", () => {
      const name = new StringName("a.b.c");
      expect(name.getComponent(0)).toBe("a");
      expect(name.getComponent(1)).toBe("b");
      expect(name.getComponent(2)).toBe("c");
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

    it("should reject undefined component", () => {
      const name = new StringName("a.b.c");
      expect(() => name.setComponent(0, undefined as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("insert Preconditions", () => {
    it("should reject negative index", () => {
      const name = new StringName("a.b.c");
      expect(() => name.insert(-1, "x")).toThrow(IllegalArgumentException);
    });

    it("should reject out of bounds index (too large)", () => {
      const name = new StringName("a.b.c");
      expect(() => name.insert(10, "x")).toThrow(IllegalArgumentException);
    });

    it("should reject null component", () => {
      const name = new StringName("a.b.c");
      expect(() => name.insert(0, null as any)).toThrow(IllegalArgumentException);
    });

    it("should reject undefined component", () => {
      const name = new StringName("a.b.c");
      expect(() => name.insert(0, undefined as any)).toThrow(IllegalArgumentException);
    });

    it("should accept insert at end (index == length)", () => {
      const name = new StringName("a.b.c");
      name.insert(3, "d");
      expect(name.getNoComponents()).toBe(4);
      expect(name.getComponent(3)).toBe("d");
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

  describe("isEqual Preconditions", () => {
    it("should reject null name", () => {
      const name = new StringName("a.b.c");
      expect(() => name.isEqual(null as any)).toThrow(IllegalArgumentException);
    });

    it("should reject undefined name", () => {
      const name = new StringName("a.b.c");
      expect(() => name.isEqual(undefined as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("asString Preconditions", () => {
    it("should reject null delimiter", () => {
      const name = new StringName("a.b.c");
      expect(() => name.asString(null as any)).toThrow(IllegalArgumentException);
    });

    it("should reject delimiter with length != 1", () => {
      const name = new StringName("a.b.c");
      expect(() => name.asString("..")).toThrow(IllegalArgumentException);
    });
  });
});

describe("Name Contract Tests - Postconditions", () => {
  
  describe("setComponent Postconditions", () => {
    it("should maintain number of components", () => {
      const name = new StringName("a.b.c");
      const oldCount = name.getNoComponents();
      name.setComponent(1, "x");
      expect(name.getNoComponents()).toBe(oldCount);
    });

    it("should set component correctly", () => {
      const name = new StringName("a.b.c");
      name.setComponent(1, "x");
      expect(name.getComponent(1)).toBe("x");
    });
  });

  describe("insert Postconditions", () => {
    it("should increase component count by 1", () => {
      const name = new StringName("a.b.c");
      const oldCount = name.getNoComponents();
      name.insert(1, "x");
      expect(name.getNoComponents()).toBe(oldCount + 1);
    });

    it("should insert component at correct position", () => {
      const name = new StringName("a.b.c");
      name.insert(1, "x");
      expect(name.getComponent(1)).toBe("x");
      expect(name.getComponent(0)).toBe("a");
      expect(name.getComponent(2)).toBe("b");
    });
  });

  describe("append Postconditions", () => {
    it("should increase component count by 1", () => {
      const name = new StringName("a.b.c");
      const oldCount = name.getNoComponents();
      name.append("d");
      expect(name.getNoComponents()).toBe(oldCount + 1);
    });

    it("should append component at end", () => {
      const name = new StringName("a.b.c");
      name.append("d");
      expect(name.getComponent(name.getNoComponents() - 1)).toBe("d");
    });
  });

  describe("remove Postconditions", () => {
    it("should decrease component count by 1", () => {
      const name = new StringName("a.b.c");
      const oldCount = name.getNoComponents();
      name.remove(1);
      expect(name.getNoComponents()).toBe(oldCount - 1);
    });

    it("should remove correct component", () => {
      const name = new StringName("a.b.c");
      name.remove(1);
      expect(name.getComponent(0)).toBe("a");
      expect(name.getComponent(1)).toBe("c");
    });
  });

  describe("concat Postconditions", () => {
    it("should increase component count by other's count", () => {
      const name1 = new StringName("a.b");
      const name2 = new StringName("c.d");
      const oldCount = name1.getNoComponents();
      name1.concat(name2);
      expect(name1.getNoComponents()).toBe(oldCount + name2.getNoComponents());
    });

    it("should append all components from other", () => {
      const name1 = new StringName("a.b");
      const name2 = new StringName("c.d");
      name1.concat(name2);
      expect(name1.getComponent(0)).toBe("a");
      expect(name1.getComponent(1)).toBe("b");
      expect(name1.getComponent(2)).toBe("c");
      expect(name1.getComponent(3)).toBe("d");
    });
  });

  describe("clone Postconditions", () => {
    it("should create equal object", () => {
      const name = new StringName("a.b.c");
      const clone = name.clone();
      expect(clone.isEqual(name)).toBe(true);
    });

    it("StringArrayName should create equal object", () => {
      const name = new StringArrayName(["a", "b", "c"]);
      const clone = name.clone();
      expect(clone.isEqual(name)).toBe(true);
    });
  });

  describe("asString/asDataString Postconditions", () => {
    it("asString should not return null or undefined", () => {
      const name = new StringName("a.b.c");
      const result = name.asString();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });

    it("asDataString should not return null or undefined", () => {
      const name = new StringName("a.b.c");
      const result = name.asDataString();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });
  });

  describe("getComponent Postconditions", () => {
    it("should not return null or undefined", () => {
      const name = new StringName("a.b.c");
      const result = name.getComponent(0);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });
  });
});

describe("Name Contract Tests - Class Invariants", () => {
  
  describe("Delimiter Invariant", () => {
    it("delimiter should always be single character", () => {
      const name = new StringName("a.b.c");
      expect(name.getDelimiterCharacter().length).toBe(1);
      
      // After operations, delimiter should still be valid
      name.append("d");
      expect(name.getDelimiterCharacter().length).toBe(1);
      
      name.setComponent(0, "x");
      expect(name.getDelimiterCharacter().length).toBe(1);
    });

    it("delimiter should not be null or undefined", () => {
      const name = new StringName("a.b.c");
      expect(name.getDelimiterCharacter()).not.toBeNull();
      expect(name.getDelimiterCharacter()).not.toBeUndefined();
    });
  });

  describe("Components Invariant", () => {
    it("StringName components should not be null after operations", () => {
      const name = new StringName("a.b.c");
      name.append("d");
      name.setComponent(0, "x");
      name.insert(1, "y");
      
      for (let i = 0; i < name.getNoComponents(); i++) {
        expect(name.getComponent(i)).not.toBeNull();
        expect(name.getComponent(i)).not.toBeUndefined();
      }
    });

    it("StringArrayName components should not be null after operations", () => {
      const name = new StringArrayName(["a", "b", "c"]);
      name.append("d");
      name.setComponent(0, "x");
      name.insert(1, "y");
      
      for (let i = 0; i < name.getNoComponents(); i++) {
        expect(name.getComponent(i)).not.toBeNull();
        expect(name.getComponent(i)).not.toBeUndefined();
      }
    });
  });
});

describe("Name Contract Tests - Both Implementations", () => {
  
  it("StringName and StringArrayName should behave identically", () => {
    const stringName = new StringName("a.b.c");
    const arrayName = new StringArrayName(["a", "b", "c"]);
    
    expect(stringName.getNoComponents()).toBe(arrayName.getNoComponents());
    expect(stringName.isEqual(arrayName)).toBe(true);
    
    stringName.append("d");
    arrayName.append("d");
    expect(stringName.isEqual(arrayName)).toBe(true);
    
    stringName.setComponent(0, "x");
    arrayName.setComponent(0, "x");
    expect(stringName.isEqual(arrayName)).toBe(true);
  });
});
