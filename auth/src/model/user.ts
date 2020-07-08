import Mongoose, { Document, Model } from "mongoose";
import { Role, accountStatus } from "@localmarket/common";
import { passwordManager } from "../services/password-manager";

interface userAttr {
  name:string
  email: string;
  password: string;
  role?: Role;
  status?: accountStatus;
}

interface userDocs extends Document {
  name:string
  email: string;
  password: string;
  role: Role;
  status: accountStatus;
}

interface userModel extends Model<userDocs> {
  build(attr: userAttr): userDocs;
}

const UserSchema = new Mongoose.Schema(
  {
    name:{
      type:String,
      required:true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: Role.userAccount,
      enum: Object.values(Role),
    },
    status: {
      type: String,
      default: accountStatus.accountCreated,
      enum: Object.values(accountStatus),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
//pre save middleware
UserSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    //check if the password is modified to prevent rehashing
    const hash = await passwordManager.toHash(this.get("password"));
    this.set("password", hash);

    done();
  }
});

UserSchema.statics.build = (attr: userAttr) => {
  return new user(attr);
};

const user = Mongoose.model<userDocs, userModel>("User", UserSchema);

export { user };
