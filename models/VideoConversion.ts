import mongoose from "mongoose";

export interface IVideoConversion extends mongoose.Document {
  email: string;
  name: string;
  inputFileName: string;
  inputFileType: string;
  inputFileSize: number;
  outputFileName: string;
  outputFileType: string;
  outputFileSize: number;
  timeTaken: number;
}

const VideoConversionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    inputFileName: { type: String, required: true },
    inputFileType: { type: String, required: true },
    inputFileSize: { type: Number, required: true, default: 0 },
    outputFileName: { type: String, required: true },
    outputFileType: { type: String, required: true },
    outputFileSize: { type: Number, required: true, default: 0 },
    timeTaken: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const VideoConverison: mongoose.Model<IVideoConversion> =
  mongoose.models.VideoConversion ||
  mongoose.model("VideoConversion", VideoConversionSchema);
