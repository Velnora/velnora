export const createArrayMapProxy = <TData, TUniqueKey extends string | number | symbol>(
  uniquenessFn: (data: TData) => NonNullable<TUniqueKey>
) => {
  const elements = [] as TData[];
  const map = new Map<TUniqueKey, Set<TData>>();

  return new Proxy(elements as TData[] & Record<TUniqueKey, TData>, {
    get(target, property: string | symbol) {
      if (property === "push") {
        return (...data: TData[]) => {
          target.push(...data);

          data.forEach(d => {
            const key = uniquenessFn(d);
            const set = map.get(key) || new Set();
            set.add(d);
            map.set(key, set);
          });
        };
      }

      if (map.has(property as TUniqueKey)) {
        const set = map.get(property as TUniqueKey);
        return set ? Array.from(set) : [];
      }

      return target[property as any];
    },
    deleteProperty(target: TData[], property: string | symbol) {
      const index = target.findIndex(d => uniquenessFn(d) === property);
      const lastIndex = target.findLastIndex(d => uniquenessFn(d) === property);

      target.splice(index, lastIndex - index + 1);

      if (map.has(property as TUniqueKey)) {
        map.delete(property as TUniqueKey);
      }

      return true;
    }
  });
};
