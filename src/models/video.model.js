import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; //for pagination

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,   //cloudinay url
            required: true
        },
        thumbnail: {
            type: String,   //cloudinary url
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: String,       //cloudinary url
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished:{
            type: Boolean,
            default: false
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, 
    {
        timestamps: true
    }
);

videoSchema.plugin(mongooseAggregatePaginate); //plugin for pagination means we can get videos in chunks of 10 or 20 etc 

export const Video = mongoose.model("Video", videoSchema);