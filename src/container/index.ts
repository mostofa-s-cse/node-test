import { UserRepository, IUserRepository } from '../repositories/user.repository';

export interface Container {
  userRepository: IUserRepository;
}

export class ServiceContainer implements Container {
  public readonly userRepository: IUserRepository;

  constructor() {
    // Initialize repositories
    this.userRepository = new UserRepository();
  }
}

// Singleton instance
let container: Container | null = null;

export const getContainer = (): Container => {
  if (!container) {
    container = new ServiceContainer();
  }
  return container;
};

export const resetContainer = (): void => {
  container = null;
}; 