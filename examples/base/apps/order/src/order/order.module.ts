import { Module } from "@nestjs/common";

import { OrderController } from "./order-controller";

@Module({
  imports: [OrderController]
})
export class OrderModule {}
