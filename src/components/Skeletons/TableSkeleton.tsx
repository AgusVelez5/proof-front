import React from 'react'
import ContentLoader from 'react-content-loader'

const TableSkeleton = (props:any) => (
  <ContentLoader
    width={700}
    height={370}
    viewBox="0 0 700 370"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
    {...props}
  >
    <rect x="4" y="8" rx="3" ry="3" width="8" height="350" />
    <rect x="7" y="350" rx="3" ry="3" width="669" height="8" />
    <rect x="669" y="9" rx="3" ry="3" width="7" height="350" />
    <rect x="5" y="8" rx="3" ry="3" width="669" height="7" />
    <rect x="114" y="42" rx="6" ry="6" width="483" height="15" />
    <rect x="114" y="105" rx="6" ry="6" width="483" height="15" />
    <rect x="114" y="168" rx="6" ry="6" width="483" height="15" />
    <rect x="114" y="231" rx="6" ry="6" width="483" height="15" />
    <rect x="114" y="293" rx="6" ry="6" width="483" height="15" />
  </ContentLoader>
)

export default TableSkeleton