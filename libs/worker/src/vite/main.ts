import { ErrorMessages, makeThrowable } from "@fluxora/utils";

import { workerManager } from "../main";
import * as viteHandlers from "./core";

workerManager.worker(makeThrowable(viteHandlers, ErrorMessages.WORKER_APP_THROW_ERROR));
