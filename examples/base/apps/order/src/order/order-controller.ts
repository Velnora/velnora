import { Controller, Get } from "@nestjs/common";

@Controller()
export class OrderController {
  @Get()
  getAllOrders() {
    return Promise.resolve([] as string[]);
  }
}
