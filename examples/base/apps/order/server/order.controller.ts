import { Controller, Get } from "@nestjs/common";

@Controller("order")
export class OrderController {
  @Get()
  getAllOrders() {
    return Promise.resolve([1]);
  }
}
