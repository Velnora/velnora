import { type FC, use } from "react";

import { OrderController } from "./order/order-controller";

declare const useBackendController: <TType extends import("@nestjs/common").Type>(
  controller: TType
) => InstanceType<TType>;

export const Order: FC = () => {
  const api = useBackendController(OrderController);
  const orders = use(api.getAllOrders());

  return <div>Hello World</div>;
};
