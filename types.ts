
export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  isResult?: boolean;
}

export interface UserInfo {
  condition: string;
  busyness: string;
  food: string;
  preference: string;
}
