export type WithRequiredName<T> = Omit<T, "name"> & { name: string };
