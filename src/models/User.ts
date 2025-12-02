import mongoose, { Document, Schema } from "mongoose";

export interface ITodo {
  todo: string;
}

export interface IUser extends Document {
  name: string;
  todos: ITodo[];
}

const TodoSchema: Schema = new Schema({
  todo: { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  todos: [TodoSchema],
});

const User = mongoose.model<IUser>("User", UserSchema);
export { User };
