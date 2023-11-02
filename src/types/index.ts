import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  info: string;
}

export interface Message {
  content: any;
  read: boolean;
  date: Timestamp;
  type: string;
  userId: string;
}