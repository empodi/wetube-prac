// create a video model for CRUD
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type:String, trim: true, required:true, maxlength: 80 },
    description: { type:String, trim: true, required:true, maxlength:140, minlength: 10 },
    createdAt: {type:Date, required:true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    meta: {
        views: { type:Number, default:0, required:true },
        rating: { type:Number, default:0, required:true },
    },
});

const movieModel = mongoose.model("Video", videoSchema);

export default movieModel;

