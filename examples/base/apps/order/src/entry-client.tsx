import { type FC, use } from "react";

import { Button } from "@base-example/ui-kit";

import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Header2 } from "./components/header2";
import { OrderController } from "./order/order-controller";

declare const useBackendController: <TType extends import("@nestjs/common").Type>(
  controller: TType
) => InstanceType<TType>;

export const Order: FC = () => {
  // const api = useBackendController(OrderController);
  // const orders = use(api.getAllOrders());

  return (
    <div>
      <Header />
      <Header2 />
      <h1>Orders</h1>
      <Footer />

      <Button>1234</Button>
    </div>
  );
};
