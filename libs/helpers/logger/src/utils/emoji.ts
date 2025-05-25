import type { LiteralUnion, ValueOf } from "type-fest";

export const Emojis = {
  // 🟢 Lifecycle & state
  ready: "✅",
  hmr: "♻️",
  launch: "🚀",
  init: "⚙️",
  prepare: "🛠️",
  define: "📐",
  reload: "🔄",
  refresh: "🔃",
  update: "⬆️",

  // 📦 Frameworks / modules / plugins
  register: "📦",
  plugin: "🧩",
  resolve: "🪝",
  hook: "🛰️",
  add: "➕",

  // 📝 File & config
  config: "📄",
  cache: "🗃️",
  file: "📁",
  write: "✍️",
  delete: "🗑️",
  clean: "🧼",

  // 📡 Networking / I/O
  upload: "📤",
  download: "📥",
  link: "🔗",
  api: "📡",

  // 🔔 Log levels
  info: "ℹ️",
  success: "🎉",
  warn: "⚠️",
  error: "❌",
  fatal: "💥",

  // 🧪 Debug / introspection
  debug: "🔍",
  trace: "🧵"
} as const;

export type EmojiTag = LiteralUnion<ValueOf<typeof Emojis>, string>;
