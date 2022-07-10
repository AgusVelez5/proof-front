import React from "react";
import MetricsByTime from "../../../components/Metrics/MetricsByTime";

const IframeMetricsByTime = () => {
  return (
    <>
      <MetricsByTime iframe={true}/>
    </>
  );
}

export default IframeMetricsByTime;