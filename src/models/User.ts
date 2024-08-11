import mongoose, { Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: "Некорректная ссылка на аватар",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: "Некорректный формат email",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("user", userSchema);
