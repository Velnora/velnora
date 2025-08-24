import { Injectable } from "@nestjs/common";

@Injectable()
export class LandingService {
  getHello() {
    return { service: "landing", success: true, message: "Hello World!" };
  }
}
