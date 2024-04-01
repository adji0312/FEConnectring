import { User } from "../user/user.model";
import { Chat } from "./chat.model";

export class ChatMessage {
    id!: number;
    message!: string;
    chat!: Chat;
    parent!: User;
}
