import { videoConversion } from "../types/myTypes";
import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import {
  averageInputFileSizeInMB,
  averageOutputFileSizeInMB,
  inputOutputVideoFormats,
  uniqueCustomers,
} from "../utils/helperMethods";
import {
  Block,
  ColGrid,
  Tab,
  TabList,
  Text,
  Title,
  Metric,
  Card,
  MultiSelectBox,
  MultiSelectBoxItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Subtitle,
  BarChart,
} from "@tremor/react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Admin() {
  const { data, error } = useSWR("/api/videoConversions", fetcher);
  const videoConversions: videoConversion[] = data?.videoConversions;
  const [selectedView, setSelectedView] = useState(1);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const isUserSelected = (videoConversion: videoConversion) =>
    selectedNames.includes(videoConversion.email) || selectedNames.length === 0;

  return (
    <div>
      {/* Tremor.so template Modified */}
      {!videoConversions ? (
        <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
          Loading...
        </div>
      ) : (
        <main className="bg-slate-50 p-6 sm:p-10">
          <Title>Dashboard</Title>
          <Text>View core metrics of the free video converter.</Text>

          <TabList
            defaultValue={1}
            handleSelect={(value) => setSelectedView(value)}
            marginTop="mt-6"
          >
            <Tab value={1} text="Overview" />
            <Tab value={2} text="Detail" />
          </TabList>

          {selectedView === 1 ? (
            <>
              <ColGrid
                numColsSm={2}
                numColsLg={4}
                marginTop="mt-6"
                gapX="gap-x-6"
                gapY="gap-y-6"
              >
                <Card>
                  <Text>Input File Size (Average)</Text>
                  <Metric>
                    {averageInputFileSizeInMB(videoConversions).toFixed(2)} MB
                  </Metric>
                </Card>

                <Card>
                  <Text>Output File Size (Average)</Text>
                  <Metric>
                    {averageOutputFileSizeInMB(videoConversions).toFixed(2)} MB
                  </Metric>
                </Card>

                <Card>
                  <Text>Total Conversions</Text>
                  <Metric>{videoConversions.length}</Metric>
                </Card>

                <Card>
                  <Text>Customers</Text>
                  <Metric>{uniqueCustomers(videoConversions).length}</Metric>
                </Card>
              </ColGrid>
              <Block marginTop="mt-6">
                <Card>
                  <Title>File Converisons</Title>
                  <Subtitle>
                    The comparison of input and output file types.
                  </Subtitle>
                  <BarChart
                    data={inputOutputVideoFormats(videoConversions)}
                    dataKey="fileType"
                    categories={["Input File", "Output File"]}
                    colors={["blue", "teal"]}
                    marginTop="mt-6"
                    yAxisWidth="w-12"
                  />
                </Card>
              </Block>
            </>
          ) : (
            <Block marginTop="mt-6">
              <Card>
                <div className="sm:mt-6 hidden sm:flex sm:justify-start sm:space-x-2">
                  <MultiSelectBox
                    handleSelect={(value) => setSelectedNames(value)}
                    placeholder="Select User(s)"
                    maxWidth="max-w-xs"
                  >
                    {uniqueCustomers(videoConversions).map((item) => (
                      <MultiSelectBoxItem
                        key={item.email}
                        value={item.email}
                        text={item.name}
                      />
                    ))}
                  </MultiSelectBox>
                </div>
                <div className="mt-6 sm:hidden space-y-2 sm:space-y-0">
                  <MultiSelectBox
                    handleSelect={(value) => setSelectedNames(value)}
                    placeholder="Select User(s)"
                    maxWidth="max-w-full"
                  >
                    {uniqueCustomers(videoConversions).map((item) => (
                      <MultiSelectBoxItem
                        key={item.email}
                        value={item.email}
                        text={item.name}
                      />
                    ))}
                  </MultiSelectBox>
                </div>

                <Table marginTop="mt-6">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell textAlignment="text-right">
                        Input Filename
                      </TableHeaderCell>
                      <TableHeaderCell textAlignment="text-right">
                        Input File Type
                      </TableHeaderCell>
                      <TableHeaderCell textAlignment="text-right">
                        Output File Type
                      </TableHeaderCell>
                      <TableHeaderCell textAlignment="text-right">
                        Input File Size (MB)
                      </TableHeaderCell>
                      <TableHeaderCell textAlignment="text-right">
                        Output File Size (MB)
                      </TableHeaderCell>
                      <TableHeaderCell textAlignment="text-right">
                        Conversion Duration (sec)
                      </TableHeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {videoConversions
                      .filter((videoConversion) =>
                        isUserSelected(videoConversion)
                      )
                      .map((videoConversion) => (
                        <TableRow key={videoConversion._id}>
                          <TableCell>{videoConversion.name}</TableCell>
                          <TableCell textAlignment="text-right">
                            {videoConversion.inputFileName.split(".")[0]}
                          </TableCell>
                          <TableCell textAlignment="text-right">
                            {videoConversion.inputFileType.split("/")[1]}
                          </TableCell>
                          <TableCell textAlignment="text-right">
                            {videoConversion.outputFileType.split("/")[1]}
                          </TableCell>
                          <TableCell textAlignment="text-right">
                            {(
                              videoConversion.inputFileSize /
                              (1024 * 1024)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell textAlignment="text-right">
                            {(
                              videoConversion.outputFileSize /
                              (1024 * 1024)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell textAlignment="text-right">
                            {videoConversion.timeTaken / 1000}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Card>
            </Block>
          )}
        </main>
      )}
    </div>
  );
}
