import { VideoConverison } from "../../../models/VideoConversion";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { videoConversion } from "../../../types/myTypes";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";

type Data = {
  message: string;
  videoConversions?: videoConversion[];
  videoConversion?: videoConversion;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      await getVideoConversions(res);
      break;
    case "POST":
      await createVideoConversions(req, res);
      break;
    default:
      res.status(405).json({
        message:
          "The HTTP method in the request was not supported by the resource",
      });
      break;
  }
}

async function getVideoConversions(res: NextApiResponse<Data>) {
  try {
    const videoConversions = await VideoConverison.find({});
    res
      .status(200)
      .json({ message: "Success!", videoConversions: videoConversions });
  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong! Details: " + JSON.stringify(err),
    });
  }
}

async function createVideoConversions(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const email = session.user?.email;
  const name = session.user?.name;

  try {
    const reqBodyVideoConversion = req.body;
    if (!reqBodyVideoConversion)
      return res
        .status(400)
        .json({ message: "Please add a Video Conversion!" });

    const newVideoConversion = new VideoConverison({
      email: email,
      name: name,
      inputFileName: reqBodyVideoConversion.inputFileName,
      inputFileType: reqBodyVideoConversion.inputFileType,
      inputFileSize: reqBodyVideoConversion.inputFileSize,
      outputFileName: reqBodyVideoConversion.outputFileName,
      outputFileType: reqBodyVideoConversion.outputFileType,
      outputFileSize: reqBodyVideoConversion.outputFileSize,
      timeTaken: reqBodyVideoConversion.timeTaken,
    });

    const videoConversion = await VideoConverison.create(newVideoConversion);
    res
      .status(201)
      .json({ message: "Success!", videoConversion: videoConversion });
  } catch (err) {
    return res.status(400).json({
      message: "Something went wrong! Details: " + JSON.stringify(err),
    });
  }
}
