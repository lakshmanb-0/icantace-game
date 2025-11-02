import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if user with email already exists
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is taken
    const existingUsername = await this.userModel.findOne({ username: createUserDto.username });
    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    // TODO: Hash password with bcrypt before saving in production
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UserDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().select('-password').skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).select('-password');
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    // Check if email is being updated and if it's already taken
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }
    }

    // Check if username is being updated and if it's already taken
    if (updateUserDto.username) {
      const existingUsername = await this.userModel.findOne({
        username: updateUserDto.username,
        _id: { $ne: id },
      });
      if (existingUsername) {
        throw new ConflictException('Username is already taken');
      }
    }

    // TODO: Hash password if it's being updated
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async getUserStats(userId: string): Promise<any> {
    // This will be enhanced when we integrate with other modules
    const user = await this.findOne(userId);
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      stats: {
        // These will be populated from other collections
        totalReviews: 0,
        totalFavorites: 0,
        totalWantToPlay: 0,
        totalViewed: 0,
      },
    };
  }
}
