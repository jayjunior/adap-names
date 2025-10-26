import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test construction with empty array", () => {
    let n: Name = new Name([]);
    expect(n.asString()).toBe("");
    expect(n.getNoComponents()).toBe(0);
  });

  it("test construction with single component", () => {
    let n: Name = new Name(["single"]);
    expect(n.asString()).toBe("single");
    expect(n.getNoComponents()).toBe(1);
  });

  it("test construction with custom delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"], '/');
    expect(n.asString()).toBe("oss/cs/fau/de");
  });

  it("test construction with empty components", () => {
    let n: Name = new Name(["", "", "", ""], '/');
    expect(n.asString()).toBe("///");
    expect(n.getNoComponents()).toBe(4);
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert at beginning", () => {
    let n: Name = new Name(["cs", "fau", "de"]);
    n.insert(0, "oss");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test insert at end", () => {
    let n: Name = new Name(["oss", "cs", "fau"]);
    n.insert(3, "de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test append", () => {
    let n: Name = new Name(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test multiple appends", () => {
    let n: Name = new Name(["oss"]);
    n.append("cs");
    n.append("fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove", () => {
    let n: Name = new Name(["oss", "extra", "cs", "fau", "de"]);
    n.remove(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove first component", () => {
    let n: Name = new Name(["extra", "oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test remove last component", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de", "extra"]);
    n.remove(4);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Component access tests", () => {
  it("test getComponent", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(0)).toBe("oss");
    expect(n.getComponent(1)).toBe("cs");
    expect(n.getComponent(2)).toBe("fau");
    expect(n.getComponent(3)).toBe("de");
  });

  it("test setComponent", () => {
    let n: Name = new Name(["oss", "xx", "fau", "de"]);
    n.setComponent(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });

  it("test getNoComponents", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });

  it("test getNoComponents after modifications", () => {
    let n: Name = new Name(["oss", "cs"]);
    expect(n.getNoComponents()).toBe(2);
    n.append("fau");
    expect(n.getNoComponents()).toBe(3);
    n.insert(3, "de");
    expect(n.getNoComponents()).toBe(4);
    n.remove(0);
    expect(n.getNoComponents()).toBe(3);
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });

  it("test asString with different delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.asString('/')).toBe("oss/cs/fau/de");
    expect(n.asString('#')).toBe("oss#cs#fau#de");
    expect(n.asString('-')).toBe("oss-cs-fau-de");
  });

  it("test slash delimiter", () => {
    let n: Name = new Name(["path", "to", "file"], '/');
    expect(n.asString()).toBe("path/to/file");
  });

  it("test space delimiter", () => {
    let n: Name = new Name(["Hello", "World"], ' ');
    expect(n.asString()).toBe("Hello World");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });

  it("test escaped delimiter in component", () => {
    // Component contains escaped delimiter: "oss\.cs"
    let n: Name = new Name(["oss\\.cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test escaped escape character", () => {
    // Component contains escaped escape character: "oss\\"
    let n: Name = new Name(["oss\\\\", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss\\\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test multiple escaped delimiters", () => {
    // "Oh\.\.\." should be one component with three dots
    let n: Name = new Name(["Oh\\.\\.\\."]);
    expect(n.asString()).toBe("Oh...");
    expect(n.getNoComponents()).toBe(1);
  });

  it("test escaped delimiter with custom delimiter", () => {
    let n: Name = new Name(["oss\\#","cs", "fau", "de"], '#');
    expect(n.asString()).toBe("oss##cs#fau#de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test mixed escaped characters", () => {
    let n: Name = new Name(["a\\.b", "c\\\\d", "e"]);
    expect(n.asString()).toBe("a.b.c\\\\d.e");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test component with only escaped delimiters", () => {
    let n: Name = new Name(["\\.\\.\\."], '.');
    expect(n.asString()).toBe("...");
    expect(n.getNoComponents()).toBe(1);
  });
});

describe("asDataString tests", () => {
  it("test asDataString with default delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString with custom delimiter", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"], '#');
    // asDataString should use default delimiter '.'
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString vs asString", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"], '/');
    expect(n.asString()).toBe("oss/cs/fau/de");
    expect(n.asDataString()).toBe("oss.cs.fau.de");
  });

  it("test asDataString with masked components", () => {
    let n: Name = new Name(["oss\\.cs", "fau", "de"], '#');
    expect(n.asDataString()).toBe("oss\\.cs.fau.de");
  });
});

describe("Edge cases and complex scenarios", () => {
  it("test empty component in middle", () => {
    let n: Name = new Name(["oss", "", "fau", "de"]);
    expect(n.asString()).toBe("oss..fau.de");
    expect(n.getNoComponents()).toBe(4);
  });

  it("test all empty components", () => {
    let n: Name = new Name(["", "", ""]);
    expect(n.asString()).toBe("..");
    expect(n.getNoComponents()).toBe(3);
  });

  it("test complex modification sequence", () => {
    let n: Name = new Name(["a", "b", "c"]);
    n.insert(1, "x");
    expect(n.asString()).toBe("a.x.b.c");
    n.remove(2);
    expect(n.asString()).toBe("a.x.c");
    n.append("d");
    expect(n.asString()).toBe("a.x.c.d");
    n.setComponent(1, "y");
    expect(n.asString()).toBe("a.y.c.d");
  });

  it("test long component chain", () => {
    let components = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    let n: Name = new Name(components);
    expect(n.getNoComponents()).toBe(10);
    expect(n.asString()).toBe("a.b.c.d.e.f.g.h.i.j");
  });

  it("test special characters as components", () => {
    let n: Name = new Name(["!", "@", "$", "%"], '#');
    expect(n.asString()).toBe("!#@#$#%");
  });

  it("test numeric strings as components", () => {
    let n: Name = new Name(["192", "168", "1", "1"], '.');
    expect(n.asString()).toBe("192.168.1.1");
  });
});
