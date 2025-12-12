import { useState } from "react";
import { page, useRouter } from "velnora/react";

export default page(() => {
  const [counter, setCounter] = useState(0);
  const router = useRouter();

  return (
    <main>
      <h1>Hello from Velnora appDir</h1>
      <p>This is a streamed SSR page.</p>

      <a
        href={router.getPath("/a/b")}
        data-href="/a/b"
        onClick={event => {
          event.preventDefault();
          router.push(event.currentTarget.dataset.href!);
        }}
      >
        Go To
      </a>

      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
      <button onClick={() => setCounter(counter - 1)}>Decrement</button>
    </main>
  );
});
