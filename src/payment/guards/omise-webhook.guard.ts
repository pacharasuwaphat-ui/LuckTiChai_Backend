import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { PaymentService } from "../payment.service";
import { Request } from "express";

@Injectable()
export class OmiseWebhookGuard implements CanActivate {
  constructor(private readonly paymentService: PaymentService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const signature = req.headers["x-omise-signature"] as string;

    if (!signature) {
      throw new BadRequestException("Missing signature");
    }

    const payload = req.body.toString(); // 🔥 raw body

    const isValid = this.paymentService.verifySignature(payload, signature);

    if (!isValid) {
      throw new BadRequestException("Invalid signature");
    }

    return true;
  }
}