import { Body, Controller, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UseGuards } from "@nestjs/common";
import { OmiseWebhookGuard } from "./guards/omise-webhook.guard";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("promptpay")
  async createPromptPay(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPromptPay(dto.amount, dto.userId);
  }

  // @UseGuards(OmiseWebhookGuard)
  @Post("webhook")
  async webhook(@Req() req: Request) {
    return await this.paymentService.processWebhook(req.body);
  }
}