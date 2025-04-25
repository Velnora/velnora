import { type FC, type PropsWithChildren, useState } from "react";

export const Button: FC<PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount(c => c + 1)}>{children}</button>
    </>
  );
};
