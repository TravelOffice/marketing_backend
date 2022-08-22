/* eslint-disable max-classes-per-file */
declare module 'round-robin-js' {
  interface RoundRobinItem<T> {
    key: number,
    value: T
  }

  class RoundRobin<T> {
    constructor(values?: T[]);

    add(value: T): RoundRobinItem<T>;

    deleteByKey(key: number): boolean;

    deleteByValue(cb: (value: T) => boolean): number;

    next(): RoundRobinItem<T>;

    count(): number;

    reset(): RoundRobin<T>;

    clear(): RoundRobin<T>;
  }

  class SequentialRoundRobin<T> extends RoundRobin<T> { }

  class RandomRoundRobin<T> extends RoundRobin<T> { }

  class PriorityRoundRobin<T> extends RoundRobin<T> {
    constructor(compare: (a: T, b: T) => number, values?: T[]);
  }

  export {
    SequentialRoundRobin,
    RandomRoundRobin,
    PriorityRoundRobin,
  };
}
