import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Clone functionality tests", () => {
  it("test StringName clone creates independent copy", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = n1.clone();
    expect(n2.asString()).toBe("oss.cs.fau.de");
    n2.append("people");
    expect(n1.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de.people");
  });

  it("test StringArrayName clone creates independent copy", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = n1.clone();
    expect(n2.asString()).toBe("oss.cs.fau.de");
    n2.append("people");
    expect(n1.asString()).toBe("oss.cs.fau.de");
    expect(n2.asString()).toBe("oss.cs.fau.de.people");
  });

  it("test clone preserves delimiter", () => {
    let n1: Name = new StringName("oss#cs#fau#de", "#");
    let n2: Name = n1.clone();
    expect(n2.getDelimiterCharacter()).toBe("#");
    expect(n2.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Equality tests", () => {
  it("test isEqual for identical StringNames", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.isEqual(n2)).toBe(true);
  });

  it("test isEqual for different StringNames", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau");
    expect(n1.isEqual(n2)).toBe(false);
  });

  it("test isEqual for identical StringArrayNames", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.isEqual(n2)).toBe(true);
  });

  it("test isEqual for different StringArrayNames", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["oss", "cs", "fau"]);
    expect(n1.isEqual(n2)).toBe(false);
  });

  it("test isEqual between StringName and StringArrayName", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.isEqual(n2)).toBe(true);
  });

  it("test isEqual after modifications", () => {
    let n1: Name = new StringName("oss.fau.de");
    let n2: Name = new StringName("oss.fau.de");
    n1.insert(1, "cs");
    n2.insert(1, "cs");
    expect(n1.isEqual(n2)).toBe(true);
  });
});

describe("HashCode tests", () => {
  it("test getHashCode for identical names returns same hash", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau.de");
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });

  it("test getHashCode for different names returns different hash", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringName("oss.cs.fau");
    expect(n1.getHashCode()).not.toBe(n2.getHashCode());
  });

  it("test getHashCode consistency", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let hash1 = n.getHashCode();
    let hash2 = n.getHashCode();
    expect(hash1).toBe(hash2);
  });

  it("test getHashCode between StringName and StringArrayName", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });
});

describe("StringName - Edge Cases and Additional Methods", () => {
  it("test isEmpty on empty name", () => {
    let n: Name = new StringName("");
    expect(n.isEmpty()).toBe(false); // Empty string still has one empty component
    expect(n.getNoComponents()).toBe(1);
  });

  it("test getNoComponents with multiple components", () => {
    let n: Name = new StringName("a.b.c.d.e");
    expect(n.getNoComponents()).toBe(5);
  });

  it("test getComponent by index", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test setComponent", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.setComponent(1, "newcs");
    expect(n.asString()).toBe("oss.newcs.fau.de");
  });

  it("test concat with another name", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringName("fau.de");
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert at beginning", () => {
    let n: Name = new StringName("cs.fau.de");
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert at end", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.insert(3, "de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove last component", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove middle component", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(1);
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test asString with custom delimiter", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asString("/")).toBe("oss/cs/fau/de");
    expect(n.asString("-")).toBe("oss-cs-fau-de");
  });

  it("test asDataString", () => {
    let n: Name = new StringName("oss#cs#fau#de", "#");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test getDelimiterCharacter", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    expect(n1.getDelimiterCharacter()).toBe(".");
    let n2: Name = new StringName("oss/cs/fau/de", "/");
    expect(n2.getDelimiterCharacter()).toBe("/");
  });

  it("test escaped delimiter in component", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("oss.cs");
    expect(n.getComponent(1)).toBe("fau");
    expect(n.getComponent(2)).toBe("de");
  });

  it("test multiple operations in sequence", () => {
    let n: Name = new StringName("a.b");
    n.append("c");
    n.insert(0, "start");
    n.remove(2);
    expect(n.asString()).toBe("start.a.c");
  });

  it("test toString method", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.toString()).toBe("oss.cs.fau.de");
  });
});

describe("StringArrayName - Edge Cases and Additional Methods", () => {
  it("test isEmpty on empty array", () => {
    let n: Name = new StringArrayName([]);
    expect(n.isEmpty()).toBe(true);
    expect(n.getNoComponents()).toBe(0);
  });

  it("test getNoComponents with multiple components", () => {
    let n: Name = new StringArrayName(["a", "b", "c", "d", "e"]);
    expect(n.getNoComponents()).toBe(5);
  });

  it("test getComponent by index", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test setComponent", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.setComponent(1, "newcs");
    expect(n.asString()).toBe("oss.newcs.fau.de");
  });

  it("test concat with another name", () => {
    let n1: Name = new StringArrayName(["oss", "cs"]);
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert at beginning", () => {
    let n: Name = new StringArrayName(["cs", "fau", "de"]);
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert at end", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.insert(3, "de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove last component", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(3);
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("test remove middle component", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(1);
    expect(n.asString()).toBe("oss.fau.de");
  });

  it("test asString with custom delimiter", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.asString("/")).toBe("oss/cs/fau/de");
    expect(n.asString("-")).toBe("oss-cs-fau-de");
  });

  it("test asDataString", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], "#");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test getDelimiterCharacter", () => {
    let n1: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.getDelimiterCharacter()).toBe(".");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"], "/");
    expect(n2.getDelimiterCharacter()).toBe("/");
  });

  it("test multiple operations in sequence", () => {
    let n: Name = new StringArrayName(["a", "b"]);
    n.append("c");
    n.insert(0, "start");
    n.remove(2);
    expect(n.asString()).toBe("start.a.c");
  });

  it("test with single component", () => {
    let n: Name = new StringArrayName(["single"]);
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("single");
  });

  it("test toString method", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n.toString()).toBe("oss.cs.fau.de");
  });
});

describe("Cross-implementation Compatibility", () => {
  it("test concat StringName with StringArrayName", () => {
    let n1: Name = new StringName("oss.cs");
    let n2: Name = new StringArrayName(["fau", "de"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test concat StringArrayName with StringName", () => {
    let n1: Name = new StringArrayName(["oss", "cs"]);
    let n2: Name = new StringName("fau.de");
    n1.concat(n2);
    expect(n1.asString()).toBe("oss.cs.fau.de");
  });

  it("test both implementations produce same result", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    expect(n1.asString()).toBe(n2.asString());
    expect(n1.getNoComponents()).toBe(n2.getNoComponents());
    for (let i = 0; i < n1.getNoComponents(); i++) {
      expect(n1.getComponent(i)).toBe(n2.getComponent(i));
    }
  });

  it("test clones are equal to original", () => {
    let n1: Name = new StringName("oss.cs.fau.de");
    let n2: Name = n1.clone();
    expect(n1.isEqual(n2)).toBe(true);
    expect(n1.getHashCode()).toBe(n2.getHashCode());
  });
});

describe("Delimiter Variations", () => {
  it("test StringName with slash delimiter", () => {
    let n: Name = new StringName("usr/local/bin", "/");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("usr/local/bin");
  });

  it("test StringArrayName with slash delimiter", () => {
    let n: Name = new StringArrayName(["usr", "local", "bin"], "/");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("usr/local/bin");
  });

  it("test StringName with dash delimiter", () => {
    let n: Name = new StringName("one-two-three", "-");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(1)).toBe("two");
  });

  it("test StringArrayName with colon delimiter", () => {
    let n: Name = new StringArrayName(["a", "b", "c"], ":");
    expect(n.asString()).toBe("a:b:c");
  });
});

describe("Complex Escape Scenarios", () => {
  it("test multiple escaped delimiters in StringName", () => {
    let n: Name = new StringName("a\\.b\\.c.d");
    expect(n.getNoComponents()).toBe(2);
    expect(n.getComponent(0)).toBe("a.b.c");
    expect(n.getComponent(1)).toBe("d");
  });

  it("test escaped delimiter at component boundaries", () => {
    let n: Name = new StringName("start\\.end.middle");
    expect(n.getNoComponents()).toBe(2);
    expect(n.getComponent(0)).toBe("start.end");
    expect(n.getComponent(1)).toBe("middle");
  });

  it("test StringName operations preserve components correctly", () => {
    let n: Name = new StringName("a.b.c");
    n.insert(1, "x");
    expect(n.getNoComponents()).toBe(4);
    expect(n.getComponent(0)).toBe("a");
    expect(n.getComponent(1)).toBe("x");
    expect(n.getComponent(2)).toBe("b");
    expect(n.getComponent(3)).toBe("c");
  });
});

describe("AbstractName shared behavior tests", () => {
  it("test concat works for both implementations", () => {
    let n1: Name = new StringName("a.b");
    let n2: Name = new StringArrayName(["c", "d"]);
    n1.concat(n2);
    expect(n1.asString()).toBe("a.b.c.d");
  });

  it("test isEmpty inherited behavior", () => {
    let n1: Name = new StringName("a");
    let n2: Name = new StringArrayName(["a"]);
    expect(n1.isEmpty()).toBe(false);
    expect(n2.isEmpty()).toBe(false);
  });

  it("test asDataString uses default delimiter", () => {
    let n1: Name = new StringName("a#b#c", "#");
    let n2: Name = new StringArrayName(["a", "b", "c"], "#");
    expect(n1.asDataString()).toBe("a.b.c");
    expect(n2.asDataString()).toBe("a.b.c");
  });

  it("test isEqual works symmetrically", () => {
    let n1: Name = new StringName("a.b.c");
    let n2: Name = new StringArrayName(["a", "b", "c"]);
    expect(n1.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n1)).toBe(true);
  });
});

describe("Edge cases and boundary conditions", () => {
  it("test single character components", () => {
    let n: Name = new StringName("a.b.c");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("a");
  });

  it("test empty components", () => {
    let n: Name = new StringName("a..b");
    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(1)).toBe("");
  });

  it("test remove all but one component", () => {
    let n: Name = new StringName("a.b.c");
    n.remove(2);
    n.remove(1);
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("a");
  });

  it("test multiple appends", () => {
    let n: Name = new StringArrayName([]);
    n.append("a");
    n.append("b");
    n.append("c");
    expect(n.asString()).toBe("a.b.c");
  });

  it("test setComponent at different positions", () => {
    let n: Name = new StringName("a.b.c.d");
    n.setComponent(0, "x");
    n.setComponent(3, "y");
    expect(n.asString()).toBe("x.b.c.y");
  });
});
