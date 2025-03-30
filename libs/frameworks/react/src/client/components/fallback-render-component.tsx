import { FallbackProps } from "react-error-boundary";

export const FallbackRenderComponent = ({ error }: FallbackProps) => {
  return (
    <div role="alert" style={{ padding: "1em", background: "#fdd", color: "#900" }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <details style={{ whiteSpace: "pre-wrap" }}>{error.stack}</details>
    </div>
  );
};
