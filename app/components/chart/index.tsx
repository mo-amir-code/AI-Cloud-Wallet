import { colors } from "@/theme/colors";
import React from "react";
import { useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const index = ({ height, width }: { height: number; width?: number }) => {
  const { width: screenWidth } = useWindowDimensions();

  const chartWidth = width || screenWidth;

  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

  return (
    <LineChart
      data={data}
      spacing={chartWidth / (data.length - 1)}
      height={height}
      adjustToWidth
      isAnimated
      color={colors.dark.accent}
      hideDataPoints
      initialSpacing={0}
      endSpacing={0}
      yAxisLabelWidth={0}
      hideYAxisText={true}
      thickness1={2.5}
      curved
      hideRules
      yAxisColor={"transparent"}
      xAxisColor={"transparent"}
      xAxisLabelsHeight={0}
      xAxisLabelsVerticalShift={0}
      trimYAxisAtTop={true}
      overflowBottom={0}
    />
  );
};

export default index;
