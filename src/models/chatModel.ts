import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage {
  sender: Types.ObjectId; // user ID
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  freelancerId: Types.ObjectId;
  clientId: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema: Schema = new Schema({
  freelancerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  clientId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  messages: { type: [MessageSchema], default: [] },
}, {
  timestamps: true,
});

const ChatModel = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default ChatModel;