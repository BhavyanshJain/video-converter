import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { blobToFile } from "../utils/helperMethods";
import { useState, Fragment } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import {
  CheckIcon,
  ArrowRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";

const videoFormats = ["mp4", "mov", "wmv", "avi", "flv", "webm", "mkv"];
const ffmpeg = createFFmpeg({
  log: false,
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
});

export default function Converter() {
  const [warning, setWarning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startConversion, setStartConversion] = useState(false);
  const [converting, setConverting] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inputVideo, setInputVideo] = useState<File | undefined>(undefined);
  const [outputVideo, setOutputVideo] = useState<File | undefined>(undefined);
  const [selectedFormat, setSelectedFormat] = useState(videoFormats[3]);

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
  }

  function reset() {
    setWarning(false);
    setDragging(false);
    setStartConversion(false);
    setConverting(false);
    setStartTime(0);
    setTimeTaken(0);
    setProgress(0);
    setInputVideo(undefined);
    setOutputVideo(undefined);
    setSelectedFormat(videoFormats[3]);
  }

  async function convertVideo() {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    setConverting(true);
    ffmpeg.FS("writeFile", inputVideo?.name!, await fetchFile(inputVideo!));

    const beginTime = Date.now();
    setStartTime(beginTime);

    ffmpeg.setProgress(({ ratio }) => setProgress(ratio));
    await ffmpeg.run("-i", inputVideo?.name!, `output.${selectedFormat}`);

    const duration = Date.now() - beginTime;
    setTimeTaken(duration);

    const data = ffmpeg.FS("readFile", `output.${selectedFormat}`);
    const outFile = blobToFile(
      new Blob([data.buffer], { type: "video/" + selectedFormat }),
      `output.${selectedFormat}`
    );
    setOutputVideo(outFile);
    handleCreate(outFile, duration);
    setStartConversion(false);
  }

  async function handleCreate(outFile: File, duration: number) {
    const data = {
      inputFileName: inputVideo?.name!,
      inputFileType: "video/" + inputVideo?.name!.split(".").pop(),
      inputFileSize: inputVideo?.size!,
      outputFileName: outFile?.name!,
      outputFileType: outFile?.type!,
      outputFileSize: outFile?.size!,
      timeTaken: duration,
    };
    await axios
      .post("/api/videoConversions", data)
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <Navbar />
      <div className="p-10 text-center">
        <h1 className="flex items-center justify-center text-4xl font-semibold">
          Video Converter
        </h1>

        <p className="p-5 text-center max-w-3xl mx-auto text-gray-600">
          Video Converter (VC) is an online video converter. We support nearly
          all video formats. To get started, use the button below and select
          files to convert from your computer.
        </p>

        <a
          href="/nice-meme.mp4"
          download={"nice-meme.mp4"}
          className="text-blue-600 underline cursor-pointer"
        >
          Download Sample Video (.mp4)
        </a>

        <div>
          {!inputVideo ? (
            // Show Drag and Drop box
            <div className="max-w-5xl mx-auto py-10 sm:px-10 px-5">
              <label
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (
                    e.dataTransfer.files.length === 1 &&
                    e.dataTransfer.files[0].type.includes("video")
                  )
                    setInputVideo(e.dataTransfer.files[0]);
                  else setWarning(true);
                }}
                className={
                  "flex justify-center w-full h-80 transition  border-2 border-gray-300 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-gray-400  focus:outline-none " +
                  (dragging ? "bg-gray-100 bg-opacity-30" : "bg-transparent")
                }
              >
                <span className="flex flex-col items-center justify-center space-x-2 -z-10 select-none">
                  <Image
                    src="/cloud-icon.svg"
                    alt=""
                    height={100}
                    width={100}
                  />
                  <span className="font-medium text-gray-600">
                    Click, or drop your file here
                  </span>
                  {warning && (
                    <span className="font-medium text-red-600">
                      We only support single video file at a time.
                    </span>
                  )}
                </span>
                <input
                  multiple={false}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setInputVideo(e.target.files?.item(0)!)}
                />
              </label>
            </div>
          ) : (
            <>
              {/* // Show Input Video File name and Convert Button */}
              <div className="max-w-5xl mx-auto p-10 mt-10 flex flex-col md:flex-row items-center justify-center md:justify-between space-x-0 space-y-10 md:space-y-0 md:space-x-10  rounded-lg shadow-md border border-gray-100 ">
                <h2 className="text-xl font-semibold truncate max-w-xs">
                  {inputVideo.name}
                </h2>

                {converting ? (
                  <div className="flex items-center justify-center text-gray-600">
                    Time Elapsed:{" "}
                    {progress < 1
                      ? (Date.now() - startTime) / 1000
                      : timeTaken / 1000}{" "}
                    sec
                  </div>
                ) : (
                  // Video Format dropdown option
                  <div className="flex items-center justify-center">
                    <Listbox
                      disabled={startConversion}
                      value={selectedFormat}
                      onChange={setSelectedFormat}
                    >
                      {({ open }) => (
                        <div className="px-5 flex-shrink-0 w-40">
                          <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200">
                              <span className="flex items-center">
                                <span className="ml-3 block truncate">
                                  {selectedFormat}
                                </span>
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>

                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {videoFormats.map((format) => (
                                  <Listbox.Option
                                    key={format}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "text-white bg-indigo-600"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={format}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="flex items-center">
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "ml-3 block truncate"
                                            )}
                                          >
                                            {format}
                                          </span>
                                        </div>

                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-indigo-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </div>
                      )}
                    </Listbox>

                    {/*  Convert Button */}
                    <button
                      disabled={startConversion}
                      className="flex p-1 items-center justify-center rounded-md border border-transparent bg-indigo-600  text-base font-medium text-white hover:bg-indigo-700 disabled:bg-gray-500"
                      onClick={() => {
                        setStartConversion(true);
                        convertVideo();
                      }}
                    >
                      <ArrowRightIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}

                {/* Output and Delete Button */}
                <div className="flex space-x-10">
                  {outputVideo ? (
                    <a
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                      href={URL.createObjectURL(outputVideo)}
                      download={outputVideo.name}
                    >
                      Download
                    </a>
                  ) : (
                    <div className=" h-[62px] w-[165px] bg-gray-200 rounded-md">
                      <div
                        className="rounded-md h-full bg-gradient-to-tr bg-indigo-700"
                        style={{ width: `${progress * 100}%` }}
                      ></div>
                    </div>
                  )}

                  <button
                    disabled={startConversion}
                    onClick={() => reset()}
                    className="text-gray-400 hover:text-red-500 disabled:text-gray-400"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div>
                {outputVideo && (
                  <button
                    onClick={() => reset()}
                    className="mx-auto mt-10 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                  >
                    Convert Again
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Converter.auth = true;
