import { describe, it, expect, beforeEach } from 'vitest';
import { deepMerge } from '@/lib/utils/deep-merge';

describe('deepMerge', () => {
  let initialTarget: Record<string, unknown>;
  let initialNested: Record<string, unknown>;

  beforeEach(() => {
    initialNested = { x: 1, y: 2 };
    initialTarget = { a: initialNested, b: 3, tags: ['a', 'b'], c: null };
  });

  // AC2: Nested plain-object merge
  it('should deeply merge plain objects, preserving keys not in source', () => {
    const source = { a: { y: 99 }, d: 4 };
    const result = deepMerge(initialTarget, source);
    expect(result).toEqual({ a: { x: 1, y: 99 }, b: 3, tags: ['a', 'b'], c: null, d: 4 });
  });

  // AC2: Should not recurse into non-plain objects (like arrays or class instances)
  it('should not recurse into arrays or null, treating them as primitives for replacement', () => {
    const targetWithArray = { data: [1, 2], config: { key: 'value' }, n: null };
    const sourceWithArray = { data: [3, 4], config: 'new_value', n: {a:1} };
    const result = deepMerge(targetWithArray, sourceWithArray);
    expect(result).toEqual({ data: [3, 4], config: 'new_value', n: {a:1} });
    expect(Object.prototype.toString.call(result.config)).not.toBe('[object Object]');
    expect(result.data).toEqual([3,4]);
  });

  // AC3: Arrays in source replace the target array wholesale
  it('should replace arrays wholesale, not concatenate', () => {
    const source = { tags: ['c'] };
    const result = deepMerge(initialTarget, source);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 3, tags: ['c'], c: null });
    expect(result.tags).toEqual(['c']);
    expect(result.tags).not.toBe(initialTarget.tags); // Should be a new array
  });

  // AC4: Primitive source values replace target primitives
  it('should replace primitive values', () => {
    const source = { b: 42 };
    const result = deepMerge(initialTarget, source);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 42, tags: ['a', 'b'], c: null });
  });

  // AC4: Strictly-undefined source values are skipped
  it('should skip undefined source values', () => {
    const source = { b: undefined, d: undefined };
    const result = deepMerge(initialTarget, source);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 3, tags: ['a', 'b'], c: null });
  });

  // DECISION: null values in source replace corresponding target values
  it('should replace target values with null from source', () => {
    const target = { value: 10, other: 'test' };
    const source = { value: null, other: undefined };
    const result = deepMerge(target, source);
    expect(result).toEqual({ value: null, other: 'test' });
  });

  // DECISION: Keys present in source but not in target will be added
  it('should add new keys from source to the merged result', () => {
    const source = { newKey: 'newValue', a: { z: 5 } };
    const result = deepMerge(initialTarget, source);
    expect(result).toEqual({
      a: { x: 1, y: 2, z: 5 },
      b: 3,
      tags: ['a', 'b'],
      c: null,
      newKey: 'newValue',
    });
  });

  // AC5: target is never mutated
  it('should not mutate the original target object', () => {
    const originalTarget = JSON.parse(JSON.stringify(initialTarget)); // Deep copy for comparison
    const source = { a: { y: 99 }, b: 42, tags: ['c'] };
    deepMerge(initialTarget, source);
    expect(initialTarget).toEqual(originalTarget);
    expect(initialTarget.a).toBe(initialNested); // Ensure nested object reference is same
  });

  // AC5: An empty source ({}) returns an object deep-equal to target but at a distinct reference (a clone)
  it('should return a deep clone when source is empty', () => {
    const result = deepMerge(initialTarget, {});
    expect(result).toEqual(initialTarget);
    expect(result).not.toBe(initialTarget);
    expect(result.a).toEqual(initialTarget.a);
    expect(result.a).not.toBe(initialTarget.a); // Nested objects should also be cloned
    expect(result.tags).toEqual(initialTarget.tags);
    expect(result.tags).not.toBe(initialTarget.tags); // Arrays should be cloned
  });

  // AC6: Prototype-pollution guard
  it('should guard against prototype pollution with __proto__', () => {
    const target = {};
    const source = JSON.parse('{"__proto__": {"polluted": true}}');
    const result = deepMerge(target, source);
    expect(result).toEqual({});
    expect(Object.prototype).not.toHaveProperty('polluted');
    expect((result as Record<string, unknown>).polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined(); // Check a fresh object
  });

  it('should guard against prototype pollution with prototype', () => {
    const target = {};
    const source = JSON.parse('{"prototype": {"polluted": true}}');
    const result = deepMerge(target, source);
    expect(result).toEqual({});
    expect(Object.prototype).not.toHaveProperty('polluted');
    expect((result as Record<string, unknown>).polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined(); // Check a fresh object
  });

  it('should guard against prototype pollution with constructor', () => {
    const target = {};
    const source = JSON.parse('{"constructor": {"polluted": true}}');
    const result = deepMerge(target, source);
    expect(result).toEqual({});
    expect(Object.prototype).not.toHaveProperty('polluted');
    expect((result as Record<string, unknown>).polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined(); // Check a fresh object
  });

  // Additional test for ensuring new keys are added correctly at top level
  it('should correctly add a new top-level key', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  // Test with complex nested structure
  it('should handle complex nested structures correctly', () => {
    const target = {
      user: {
        id: 1,
        profile: { name: 'Alice', age: 30, tags: ['dev'] },
        settings: { theme: 'dark', notifications: true },
      },
      permissions: ['read', 'write'],
    };
    const source = {
      user: {
        profile: { age: 31, location: 'NY', tags: ['admin'] },
        settings: { notifications: false, lang: 'en' },
      },
      permissions: ['admin'],
      status: 'active',
    };
    const result = deepMerge(target, source);
    expect(result).toEqual({
      user: {
        id: 1,
        profile: { name: 'Alice', age: 31, tags: ['admin'], location: 'NY' },
        settings: { theme: 'dark', notifications: false, lang: 'en' },
      },
      permissions: ['admin'],
      status: 'active',
    });
    // Ensure deep clones for nested objects
    expect(result.user).not.toBe(target.user);
    expect(result.user.profile).not.toBe(target.user.profile);
    expect(result.user.profile.tags).not.toBe(target.user.profile.tags);
    expect(result.permissions).not.toBe(target.permissions);
  });
});
