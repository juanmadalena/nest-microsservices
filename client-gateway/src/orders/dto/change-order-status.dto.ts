import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';



export class ChangeOrderStatusDto {

  @IsUUID(4)
  id: string;

  @IsEnum( OrderStatusList, {
    message: `Valid status are ${ OrderStatusList }`
  })
  status: OrderStatus;


}