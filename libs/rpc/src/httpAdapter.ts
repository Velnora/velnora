// import type { VRpcClient } from "./client";
//
// export const createHttpClient = (baseUrl: string): VRpcClient => {
//   return {
//     async call({ module, method }, input) {
//       const res = await fetch(`${baseUrl}/rpc/${module}/${method}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(input ?? null)
//       });
//       if (!res.ok) throw new Error(`RPC ${module}.${method} failed: ${res.status}`);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//       return res.json();
//     }
//   };
// };
