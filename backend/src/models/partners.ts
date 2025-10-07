import mongoose, { Schema , Document} from "mongoose";

export interface IPartner extends Document {
    name : String;
    status :"available"|"busy" ;
    user?: mongoose.Types.ObjectId;
};

const UserSchema : Schema = new Schema({
    name : { type :  String , required : true},
    status : {type : String, enum : ["available", "busy"], default : "available"},
    user : { type: Schema.Types.ObjectId, ref: "User", unique: true, sparse: true }
},
    {timestamps : true}
);

export default mongoose.model<IPartner>('Partner', UserSchema);