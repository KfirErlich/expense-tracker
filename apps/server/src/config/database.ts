
import mongoose from 'mongoose'

export class Database {
    private readonly uri : string;

    constructor(){
        this.uri = process.env.MONGO_URI || ''
    }

    async connect(): Promise<void> {
        try{
            if(!this.uri){
                throw new Error("MongoDB URI is missing in .env file")
            }
            await mongoose.connect(this.uri)
            console.log('✅ Successfully connected to MongoDB Atlas')
        }catch(error){
            console.error('❌ Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }

    async disconnect() : Promise<void> {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }

}