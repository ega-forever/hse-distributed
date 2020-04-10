import { AuthService } from './auth/services/AuthService';


export const implementations = {
  services: {
    auth: {
      AuthService: AuthService
    }
  }
};