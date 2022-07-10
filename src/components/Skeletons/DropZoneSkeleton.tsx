import React from 'react'
import ContentLoader from 'react-content-loader'

const DropZoneSkeleton = (props:any) => (
  <ContentLoader
    width={700}
    height={370}
    viewBox="0 0 700 370"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
    speed={2}
    style={{ width: '100%', height: 'auto', margin: 'none', padding: 'none' }}
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="669" height="370" />
  </ContentLoader>
)

export default DropZoneSkeleton