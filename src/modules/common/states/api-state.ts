import { AxiosError } from 'axios';

export interface ApiState {
  isTriggered: boolean;
  isLoading: boolean;
  error?: AxiosError;
}

export const initialApiState: ApiState = {
  isTriggered: false,
  isLoading: false,
};
