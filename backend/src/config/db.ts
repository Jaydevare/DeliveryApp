import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODD_URI!);
        console.log('MongoDB connected');
    } catch (error) {
        console.error("Error in Connecting to DB", error);
        process.exit(1);
    }   
};

export default connectDB;