import React from "react"
import ContentLoader from "react-content-loader"

const BarChartSkeleton = (props:any) => (
  <ContentLoader 
    speed={2}
    width={500}
    height={650}
    viewBox="0 0 500 650"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
    {...props}
  >
    <path d="M 478.1 466.4 H 23.4 V 11.7 C 23.4 5.5 18.3 0 11.7 0 S 0 5.1 0 11.7 v 466.4 c 0 6.2 5.1 11.7 11.7 11.7 h 466.4 c 6.2 0 11.7 -5.1 11.7 -11.7 c 0 -6.2 -5.1 -11.7 -11.7 -11.7 z" /> 
    <path d="M 57.2 144.6 h 97.6 v 299.3 H 57.2 z M 195.9 28 h 97.6 v 415.9 h -97.6 z M 334.7 160.9 h 97.6 v 282.9 h -97.6 z" />
  </ContentLoader>
)

export default BarChartSkeleton

