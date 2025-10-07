import mongoose, { Schema , Document} from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role : "admin" | "partner";
};

const UserSchema : Schema  = new Schema({
    email : {type : String, required : true , unique : true},
    password : {type : String, required : true},
    role : {type : String , enum:['admin','partner'], required : true}
},
{
    timestamps : true
});

export default mongoose.model<IUser>('User', UserSchema);