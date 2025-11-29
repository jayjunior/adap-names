import { describe, it, expect, beforeEach } from "vitest";

import { File } from "../../../src/adap-b04/files/File";
import { Directory } from "../../../src/adap-b04/files/Directory";
import { RootNode } from "../../../src/adap-b04/files/RootNode";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailedException } from "../../../src/adap-b04/common/MethodFailedException";

describe("File Contract Tests - Preconditions", () => {
  
  let rootNode: RootNode;
  let testDir: Directory;
  let testFile: File;

  beforeEach(() => {
    rootNode = RootNode.getRootNode();
    testDir = new Directory("testDir", rootNode);
    testFile = new File("test.txt", testDir);
  });

  describe("File open() Preconditions", () => {
    it("should reject opening an already open file", () => {
      testFile.open();
      expect(() => testFile.open()).toThrow(IllegalArgumentException);
      expect(() => testFile.open()).toThrow(/cannot open an already open file/);
    });

    it("should allow opening a closed file", () => {
      expect(() => testFile.open()).not.toThrow();
    });
  });

  describe("File close() Preconditions", () => {
    it("should reject closing an already closed file", () => {
      expect(() => testFile.close()).toThrow(IllegalArgumentException);
      expect(() => testFile.close()).toThrow(/cannot close an already closed file/);
    });

    it("should allow closing an open file", () => {
      testFile.open();
      expect(() => testFile.close()).not.toThrow();
    });

    it("should reject closing an already closed file after close", () => {
      testFile.open();
      testFile.close();
      expect(() => testFile.close()).toThrow(IllegalArgumentException);
    });
  });

  describe("File read() Preconditions", () => {
    it("should reject reading from a closed file", () => {
      expect(() => testFile.read(100)).toThrow(IllegalArgumentException);
      expect(() => testFile.read(100)).toThrow(/cannot read from a closed file/);
    });

    it("should reject negative noBytes", () => {
      testFile.open();
      expect(() => testFile.read(-1)).toThrow(IllegalArgumentException);
      expect(() => testFile.read(-1)).toThrow(/number of bytes must be non-negative/);
    });

    it("should allow reading from an open file", () => {
      testFile.open();
      expect(() => testFile.read(100)).not.toThrow();
    });

    it("should allow reading zero bytes from an open file", () => {
      testFile.open();
      expect(() => testFile.read(0)).not.toThrow();
    });
  });
});

describe("File Contract Tests - Postconditions", () => {
  
  let rootNode: RootNode;
  let testDir: Directory;
  let testFile: File;

  beforeEach(() => {
    rootNode = RootNode.getRootNode();
    testDir = new Directory("testDir", rootNode);
    testFile = new File("test.txt", testDir);
  });

  describe("File open() Postconditions", () => {
    it("should set file state to OPEN", () => {
      testFile.open();
      // File should be open, so reading should work
      expect(() => testFile.read(10)).not.toThrow();
      // And opening again should fail
      expect(() => testFile.open()).toThrow(IllegalArgumentException);
    });
  });

  describe("File close() Postconditions", () => {
    it("should set file state to CLOSED", () => {
      testFile.open();
      testFile.close();
      // File should be closed, so reading should fail
      expect(() => testFile.read(10)).toThrow(IllegalArgumentException);
      // And closing again should fail
      expect(() => testFile.close()).toThrow(IllegalArgumentException);
    });
  });

  describe("File read() Postconditions", () => {
    it("should return non-null array", () => {
      testFile.open();
      const result = testFile.read(10);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    });

    it("should return array of correct length", () => {
      testFile.open();
      const result = testFile.read(10);
      expect(result.length).toBe(10);
    });

    it("should return empty array for zero bytes", () => {
      testFile.open();
      const result = testFile.read(0);
      expect(result.length).toBe(0);
    });
  });
});

describe("File Contract Tests - State Transitions", () => {
  
  let rootNode: RootNode;
  let testDir: Directory;
  let testFile: File;

  beforeEach(() => {
    rootNode = RootNode.getRootNode();
    testDir = new Directory("testDir", rootNode);
    testFile = new File("test.txt", testDir);
  });

  it("should follow proper state transition: CLOSED -> OPEN -> CLOSED", () => {
    // Initially closed
    expect(() => testFile.read(10)).toThrow(IllegalArgumentException);
    
    // Open it
    testFile.open();
    expect(() => testFile.read(10)).not.toThrow();
    
    // Close it
    testFile.close();
    expect(() => testFile.read(10)).toThrow(IllegalArgumentException);
  });

  it("should allow multiple open-close cycles", () => {
    testFile.open();
    testFile.close();
    
    testFile.open();
    expect(() => testFile.read(10)).not.toThrow();
    testFile.close();
    
    testFile.open();
    testFile.close();
  });
});

describe("Node Contract Tests - Preconditions", () => {
  
  let rootNode: RootNode;
  let testDir: Directory;

  beforeEach(() => {
    rootNode = RootNode.getRootNode();
    testDir = new Directory("testDir", rootNode);
  });

  describe("Node constructor Preconditions", () => {
    it("should reject null basename", () => {
      expect(() => new File(null as any, testDir)).toThrow(IllegalArgumentException);
      expect(() => new File(null as any, testDir)).toThrow(/basename is null or undefined/);
    });

    it("should reject undefined basename", () => {
      expect(() => new File(undefined as any, testDir)).toThrow(IllegalArgumentException);
    });

    it("should reject null parent", () => {
      expect(() => new File("test.txt", null as any)).toThrow(IllegalArgumentException);
      expect(() => new File("test.txt", null as any)).toThrow(/parent node is null or undefined/);
    });

    it("should reject undefined parent", () => {
      expect(() => new File("test.txt", undefined as any)).toThrow(IllegalArgumentException);
    });

    it("should accept valid basename and parent", () => {
      expect(() => new File("test.txt", testDir)).not.toThrow();
    });

    it("should accept empty basename", () => {
      expect(() => new File("", testDir)).not.toThrow();
    });
  });

  describe("Node rename() Preconditions", () => {
    it("should reject null basename", () => {
      const file = new File("test.txt", testDir);
      expect(() => file.rename(null as any)).toThrow(IllegalArgumentException);
      expect(() => file.rename(null as any)).toThrow(/basename is null or undefined/);
    });

    it("should reject undefined basename", () => {
      const file = new File("test.txt", testDir);
      expect(() => file.rename(undefined as any)).toThrow(IllegalArgumentException);
    });

    it("should accept valid basename", () => {
      const file = new File("test.txt", testDir);
      expect(() => file.rename("newname.txt")).not.toThrow();
    });
  });

  describe("Node move() Preconditions", () => {
    it("should reject null target directory", () => {
      const file = new File("test.txt", testDir);
      expect(() => file.move(null as any)).toThrow(IllegalArgumentException);
      expect(() => file.move(null as any)).toThrow(/target directory is null or undefined/);
    });

    it("should reject undefined target directory", () => {
      const file = new File("test.txt", testDir);
      expect(() => file.move(undefined as any)).toThrow(IllegalArgumentException);
    });

    it("should accept valid target directory", () => {
      const file = new File("test.txt", testDir);
      const newDir = new Directory("newDir", rootNode);
      expect(() => file.move(newDir)).not.toThrow();
    });
  });
});

describe("Node Contract Tests - Postconditions", () => {
  
  let rootNode: RootNode;
  let testDir: Directory;

  beforeEach(() => {
    rootNode = RootNode.getRootNode();
    testDir = new Directory("testDir", rootNode);
  });

  describe("Node rename() Postconditions", () => {
    it("should update basename correctly", () => {
      const file = new File("test.txt", testDir);
      file.rename("newname.txt");
      expect(file.getBaseName()).toBe("newname.txt");
    });

    it("should maintain parent node", () => {
      const file = new File("test.txt", testDir);
      const oldParent = file.getParentNode();
      file.rename("newname.txt");
      expect(file.getParentNode()).toBe(oldParent);
    });
  });

  describe("Node move() Postconditions", () => {
    it("should update parent node correctly", () => {
      const file = new File("test.txt", testDir);
      const newDir = new Directory("newDir", rootNode);
      file.move(newDir);
      expect(file.getParentNode()).toBe(newDir);
    });

    it("should maintain basename", () => {
      const file = new File("test.txt", testDir);
      const oldBaseName = file.getBaseName();
      const newDir = new Directory("newDir", rootNode);
      file.move(newDir);
      expect(file.getBaseName()).toBe(oldBaseName);
    });
  });

  describe("Node getFullName() Postconditions", () => {
    it("should return non-null name", () => {
      const file = new File("test.txt", testDir);
      const fullName = file.getFullName();
      expect(fullName).not.toBeNull();
      expect(fullName).not.toBeUndefined();
    });

    it("should include basename in full name", () => {
      const file = new File("test.txt", testDir);
      const fullName = file.getFullName();
      expect(fullName.getComponent(fullName.getNoComponents() - 1)).toBe("test.txt");
    });
  });
});
