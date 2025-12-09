import { useEffect, useReducer, useState } from "react";

import { createSlice } from "@reduxjs/toolkit";

import { ModeExample, PopLayoutIcon, SyncIcon, WaitIcon } from "./mode-example";

const slice = createSlice({
  name: "Some Slice",
  initialState: { count: 0 },
  reducers: {
    increment(state) {
      state.count++;
    },
    decrement(state) {
      state.count--;
    }
  }
});

export const App = () => {
  const [count, setCount] = useState(0);
  const [state, dispatch] = useReducer(slice.reducer, slice.getInitialState());
  const [exampleMode, setExampleMod] = useState(false);

  useEffect(() => {
    document.querySelector("html")?.setAttribute("lang", "az");
  }, []);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div>
      <div>
        <div>Hello World ({count})</div>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
      </div>

      <div
        style={{ display: "flex", margin: "50px auto", alignItems: "center", justifyContent: "center", gap: "20px" }}
      >
        <ModeExample mode="sync" icon={<SyncIcon />} state={exampleMode} />
        <ModeExample mode="wait" icon={<WaitIcon />} state={exampleMode} />
        <ModeExample mode="popLayout" icon={<PopLayoutIcon />} state={exampleMode} />
      </div>

      <button onClick={() => setExampleMod(!exampleMode)}>Switch</button>

      <div>Slice ({state.count})</div>
      <button onClick={() => dispatch(slice.actions.increment())}>Increment</button>
      <button onClick={() => dispatch(slice.actions.decrement())}>Decrement</button>
    </div>
  );
};
