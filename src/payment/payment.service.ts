import { BadRequestException, Injectable  } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; // ❗ ต้อง import
import { Model } from "mongoose";
import { User } from "../users/schema/users.schema";
import Omise from "omise";

import * as crypto from "crypto";

@Injectable()
export class PaymentService {
  private omise;

  constructor(
    @InjectModel(User.name) private userModel: Model<User> // ✅ ถูกที่
  ) {
    this.omise = Omise({
      publicKey: process.env.OMISE_PUBLIC_KEY,
      secretKey: process.env.OMISE_SECRET_KEY,
    });
  }

  // ✅ map ราคา (กันโกง)
  private readonly PRICE_MAP = {
    20: 20,
    40: 40,
    80: 80,
  };

  verifySignature(payload: string, signature: string) {
    const expected = crypto
      .createHmac("sha256", process.env.OMISE_WEBHOOK_SECRET!)
      .update(payload)
      .digest("hex");

    return expected === signature;
  }

  // ✅ create promptpay
  async createPromptPay(amount: number, userId: string) {
    // 🔒 validate amount (กัน frontend ยิงมั่ว)
    const normalizedAmount = Number(amount);
    if (!this.PRICE_MAP[normalizedAmount]) {
      throw new BadRequestException("Invalid amount");
    }

    try {
      // 1. create source (PromptPay)
      const source = await this.omise.sources.create({
        type: "promptpay",
        amount: amount * 100, // ❗ แปลงเป็นสตางค์
        currency: "thb",
      });

      // 2. create charge
      const charge = await this.omise.charges.create({
        amount: amount * 100,
        currency: "thb",
        source: source.id,
        metadata: {
          userId, // 🔥 สำคัญ (ใช้ตอน webhook)
        },
      });

      return {
        qr: charge.source.scannable_code.image.download_uri,
        chargeId: charge.id,
      };
    }catch (error) {
      console.error("🔥 OMISE ERROR FULL:", error);
      throw error; // 🔥 อย่า wrap ทิ้ง
    }
  }

  // ✅ webhook handler (เพิ่ม coin จริง)
  async processWebhook(rawBody: Buffer) {
    try {
      const event = JSON.parse(rawBody.toString()); // 🔥 parse ที่นี่

      // console.log("KEY:", event.key);

      if (event.key === "charge.complete") {
        const charge = event.data;

        if (charge.status === "successful") {
          const amount = charge.amount / 100;
          const userId = charge.metadata?.userId;

          if (!userId) {
            throw new BadRequestException("Missing userId");
          }

          const user = await this.userModel.findOne({
            _id: userId,
          });
          if (!user) {
            return {
              message: 'user not found.',
            };
          }

          user.coin += amount;
          const coinNow = user.coin;
          await user.save();

          // console.log("✅ เติม coin สำเร็จ");
          return {
            message: 'Buy coin success.',
            coin : coinNow,
          };
        }
      }
    } catch (error) {
      console.error("Webhook error:", error);
    }
  }
}