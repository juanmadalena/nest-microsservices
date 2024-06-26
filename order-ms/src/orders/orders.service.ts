import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('OrdersService connected to database')
  }

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ){
    super();
  }

  
  async create(createOrderDto: CreateOrderDto) {
    return 'Order created successfully'
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: { status: orderPaginationDto.status }
    });

    const page = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;


    return {
        data: await this.order.findMany({
          where: { status: orderPaginationDto.status },
          skip: page,
          take: perPage
        }),
        meta: {
          page,
          perPage,
          lastPage: Math.ceil(totalPages / perPage),
        }
    }
  }

  async findOne(id: string) {
    return this.order.findUnique({
      where: { id }
    });
  }

  async updateOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if ( order.status === status ) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    });
  }

}
