function isPlainObject(item: unknown): item is Record<string, unknown> {
  return (
    item !== null &&
    typeof item === 'object' &&
    Object.prototype.toString.call(item) === '[object Object]'
  );
}

const DANGEROUS_KEYS = ['__proto__', 'prototype', 'constructor'];

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  // AC5: target is never mutated. Create a deep clone initially.
  const output = {} as T;

  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const targetValue = target[key];
      if (isPlainObject(targetValue)) {
        output[key] = deepMerge(targetValue as T, {} as Partial<T>) as T[typeof key];
      } else if (Array.isArray(targetValue)) {
        output[key] = [...targetValue] as T[typeof key];
      } else {
        output[key] = targetValue;
      }
    }
  }

  if (isPlainObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        // AC6: Prototype-pollution guard
        if (DANGEROUS_KEYS.includes(key)) {
          continue;
        }

        const sourceValue = source[key];
        const targetValue = output[key]; // Use output[key] as it's the working copy

        // AC4: Strictly-undefined source values are skipped
        if (sourceValue === undefined) {
          continue;
        }

        if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
          // AC2: Nested plain-object merge
          output[key] = deepMerge(targetValue as T, sourceValue as Partial<T>) as T[typeof key];
        } else if (Array.isArray(sourceValue)) {
          // AC3: Arrays in source replace target array wholesale
          output[key] = [...sourceValue] as T[typeof key];
        } else {
          // AC4: Primitive source values replace target primitives
          // DECISION: null values in source replace target values
          // DECISION: Keys present in source but not in target will be added
          output[key] = sourceValue as T[typeof key];
        }
      }
    }
  }

  return output;
}
