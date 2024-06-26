import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productServiceClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productServiceClient.send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError(err => { throw new RpcException(err) } )
      )
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productServiceClient.send({ cmd: 'find_products' }, paginationDto)
      .pipe(
        catchError(err => { throw new RpcException(err) } )
      )
  }

  @Get(':id')
  async findOneProductById(@Param('id', ParseIntPipe) id: number) {
    
    return this.productServiceClient.send({ cmd: 'find_product_by_id' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) } )
      )
  }

  @Patch(':id')
  updateProductById(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productServiceClient.send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError(err => { throw new RpcException(err) } )
      )
  }

  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productServiceClient.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) } )
      )
  }

}
