import type { RemoteFrom, WrapShareScope } from "@fluxora/types/federation";

export const wrapShareScope = (_remoteFrom: RemoteFrom): WrapShareScope => ({});

/*
const wrapShareScope = remoteFrom => {
  return {
    'react':{'18.2.0':{get:()=> get(window.location.origin+'/node_modules/.vite/deps/react.js?v=05a5e3b0', remoteFrom)}},'react-dom':{'18.2.0':{get:()=> get(window.location.origin+'/node_modules/.vite/deps/react-dom.js?v=11d6dbba', remoteFrom)}}
  }
}
*/
