import { NotFoundError } from "../utils/appError";
import { IUserRepository } from "../repositories/user.repository";
import { getContainer } from "../container";

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = getContainer().userRepository;
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.userRepository.delete(id);
  }

  async searchUsers(query: string) {
    return this.userRepository.search(query);
  }

  async updateUser(id: string, data: { name?: string; email?: string }) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return this.userRepository.update(id, data);
  }
}

// Export singleton instance
export const userService = new UserService();
