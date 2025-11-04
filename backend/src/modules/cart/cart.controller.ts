import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':guestId')
  @ApiOperation({ summary: 'Get cart for guest user' })
  @ApiParam({ name: 'guestId', description: 'Guest ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  getCart(@Param('guestId') guestId: string) {
    return this.cartService.getCart(guestId);
  }

  @Post(':guestId/items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiParam({ name: 'guestId', description: 'Guest ID', type: 'string' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addToCart(@Param('guestId') guestId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(guestId, addToCartDto);
  }

  @Delete(':guestId/items/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'guestId', description: 'Guest ID', type: 'string' })
  @ApiParam({ name: 'productId', description: 'Product ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeFromCart(
    @Param('guestId') guestId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(guestId, productId);
  }

  @Delete(':guestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiParam({ name: 'guestId', description: 'Guest ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  clearCart(@Param('guestId') guestId: string) {
    return this.cartService.clearCart(guestId);
  }
}