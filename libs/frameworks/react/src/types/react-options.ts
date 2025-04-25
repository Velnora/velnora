import react from "@vitejs/plugin-react-swc";

type ReactRawOptions = NonNullable<Parameters<typeof react>[0]>;
export type ReactOptions = Omit<ReactRawOptions, "tsDecorators" | `useAtYourOwnRisk_${string}`>;
