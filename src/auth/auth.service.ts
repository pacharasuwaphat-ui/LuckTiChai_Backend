import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schema/users.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset.dto';
import { ForgotPasswordDto } from './dto/forgot.dto';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return {
      message: 'Register success',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const normalizedEmail = email.toLowerCase();

    const user = await this.userModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login success',
      access_token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const normalizedEmail = email.toLowerCase();

    const user = await this.userModel.findOne({
      email: normalizedEmail,
    });

    // กัน email enumeration:
    // ต่อให้ไม่เจอ user ก็คืนข้อความสำเร็จแบบเดียวกัน
    if (!user) {
      return {
        message: 'If that email exists, a reset link has been sent.',
      };
    }

    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 นาที

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    // ตอน dev ให้คืน token/link กลับมาก่อน
    // ตอนขึ้น production ค่อยเปลี่ยนเป็นส่ง email จริง
    return {
      message: 'If that email exists, a reset link has been sent.',
      resetToken: rawToken,
      resetLink: `http://localhost:3000/forgot-password/reset-password?token=${rawToken}`,
    };


  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return {
      message: 'Password reset successful',
    };

  }
}
