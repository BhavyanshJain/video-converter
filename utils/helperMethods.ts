import { videoConversion } from "../types/myTypes";

export function blobToFile(theBlob: Blob, fileName: string): File {
  return new File(
    [theBlob as any], // cast as any
    fileName,
    {
      lastModified: new Date().getTime(),
      type: theBlob.type,
    }
  );
}

export function averageInputFileSizeInMB(videoConversions: videoConversion[]) {
  let sum = 0;
  for (let i = 0; i < videoConversions.length; i++)
    sum += videoConversions[i].inputFileSize;

  return sum / videoConversions.length / (1024 * 1024);
}

export function averageOutputFileSizeInMB(videoConversions: videoConversion[]) {
  let sum = 0;
  for (let i = 0; i < videoConversions.length; i++)
    sum += videoConversions[i].outputFileSize;

  return sum / videoConversions.length / (1024 * 1024);
}

export function uniqueCustomers(videoConversions: videoConversion[]) {
  let customers = new Map();
  for (let i = 0; i < videoConversions.length; i++)
    if (!customers.has(videoConversions[i].email))
      customers.set(videoConversions[i].email, videoConversions[i].name);

  return Array.from(customers, ([email, name]) => {
    return { email: email, name: name };
  });
}

export function inputOutputVideoFormats(videoConversions: videoConversion[]) {
  let inMap = new Map();
  for (let i = 0; i < videoConversions.length; i++) {
    if (inMap.has(videoConversions[i].inputFileType)) {
      inMap.set(
        videoConversions[i].inputFileType,
        inMap.get(videoConversions[i].inputFileType) + 1
      );
    } else {
      inMap.set(videoConversions[i].inputFileType, 1);
    }
  }

  let outMap = new Map();
  for (let i = 0; i < videoConversions.length; i++) {
    if (outMap.has(videoConversions[i].outputFileType)) {
      outMap.set(
        videoConversions[i].outputFileType,
        outMap.get(videoConversions[i].outputFileType) + 1
      );
    } else {
      outMap.set(videoConversions[i].outputFileType, 1);
    }
  }

  outMap.forEach((value, key) => {
    if (inMap.has(key)) {
      inMap.set(key, { inCount: inMap.get(key), outCount: value });
    } else {
      inMap.set(key, { inCount: 0, outCount: value });
    }
  });

  return Array.from(inMap, ([key, value]) => {
    return {
      fileType: key.split("/")[1],
      "Input File": value.inCount,
      "Output File": value.outCount,
    };
  });
}
