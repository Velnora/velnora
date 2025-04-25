export const isSubclassOf = (SubClass: any, SuperClass: any) => {
  if (typeof SubClass !== "function" || typeof SuperClass !== "function") {
    return false;
  }

  let proto = SubClass;
  while (proto) {
    if (proto === SuperClass) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};
