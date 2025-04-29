import { Command } from "../core/command";
import type { CommandReturnType } from "./command-return-type";

export type CommandsType = Promise<Record<string, Command<any> | CommandReturnType<any>>>[];
