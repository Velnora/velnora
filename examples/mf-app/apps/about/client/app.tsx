import { useEffect, useReducer, useState } from "react";

import { createSlice } from "@reduxjs/toolkit";

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

  useEffect(() => {
    document.querySelector("html")?.setAttribute("lang", "az");
  }, []);

  useEffect(() => {
    document.title = `About | Count: ${count}`;
  }, [count]);

  return (
    <div>
      <div>
        <div>This is About Page ({count})</div>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
      </div>

      <div>Slice ({state.count})</div>
      <button onClick={() => dispatch(slice.actions.increment())}>Increment</button>
      <button onClick={() => dispatch(slice.actions.decrement())}>Decrement</button>
    </div>
  );
};
