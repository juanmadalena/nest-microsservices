import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database')
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  async findAll( paginationDto: PaginationDto ) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    return{
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      }),
      metadata: {
        total: totalPages,
        page: page,
        limit: limit,
        lastPage: lastPage
      }
    } 
  }

  async findOne(id: number) {
    try {

      return await this.product.findFirstOrThrow({
        where: { 
          id,
          available: true
        }
      })

    } catch (error) {

        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Product not found'
        });

    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    await this.findOne(id);
    
    return this.product.update({
      where: { 
        id,
        available: true
      },
      data: updateProductDto
    })
    
  }

  async remove(id: number) {

    await this.findOne(id);

    //Hard delete
    // return this.product.delete({
    //   where: { id }
    // })

    //Soft delete
    return this.product.update({
      where: { id },
      data: { 
        available: false
      }
    })
  }
}
