import { Timestamp } from "rxjs";
import { User } from "../user/user.model";
import { Chat } from "./chat.model";

export class ChatMessage {
    id!: number;
    message!: string;
    sender_id!: number;
    timestramp!: string;
}
