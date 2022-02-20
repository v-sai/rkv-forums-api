import mongoose from "mongoose"

const connectToDb = (uri)=>{
    return mongoose.connect(uri)
}

export default connectToDb