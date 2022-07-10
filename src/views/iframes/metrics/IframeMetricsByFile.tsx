import React from "react";
import MetricsByFile from "../../../components/Metrics/MetricsByFile";

const IframeMetricsByFile = () => {
  return (
    <>
      <MetricsByFile iframe={true}/>
    </>
  );
}

export default IframeMetricsByFile;