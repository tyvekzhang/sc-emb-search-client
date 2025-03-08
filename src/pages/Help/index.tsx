import { GridContent } from '@ant-design/pro-layout';
import React from 'react';

const Run: React.FC = () => {
  return (
    <GridContent>
      <video
        id="video"
        width="100%"
        controls
        autoPlay
        src="https://raw.githubusercontent.com/tyvekzhang/scdifformer/main/scdifformer_run.mp4"
      />
    </GridContent>
  );
};

export default Run;
