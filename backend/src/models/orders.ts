import mongoose, {Schema , Document} from "mongoose";

export interface Iorder extends Document {
    customer : String,
    address : String,
    lat : number;
    lon : number;
    status : "pending" | "assigned" | "shipped" | "deliveried";
    assignedTo? :mongoose.Types.ObjectId;
};

    const UserSchema : Schema = new Schema({
        customer : {type : String , required: true},
        address : {type : String, required : true},
        lat : {type : Number, required : true},
        lon : {type : Number, required : true},
        status : {type : String, enum : ["pending", "assigned", "shipped", "deliveried"], default : "pending"},
        assignedTo: { type: Schema.Types.ObjectId, ref: "Partner" },
    }
    , {timestamps : true}
    );


export default mongoose.model<Iorder>("order", UserSchema);

