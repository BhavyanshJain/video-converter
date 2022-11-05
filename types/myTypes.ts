import { NextComponentType, NextPage } from "next";

export type myNextComponentType = NextComponentType & { auth: boolean };

export type myNextPage = NextPage & { auth: boolean };

export type videoConversion = {
  _id: string;
  email: string;
  name: string;
  inputFileName: string;
  inputFileType: string;
  inputFileSize: number;
  outputFileName: string;
  outputFileType: string;
  outputFileSize: number;
  timeTaken: number;
};
