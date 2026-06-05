import  mongoose from 'mongoose';

const URI = process.env.MONGO_URI;


async function initDbConnection() {
    try {
        await mongoose.connect(URI!); 
        console.log("connected")
    } catch(e: any) {
        console.log(e.message);
    }
}

export default initDbConnection;
