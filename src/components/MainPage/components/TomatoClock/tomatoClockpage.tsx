import './tomatoClockDiv.module.scss';
import React from 'react';
import TomatoClockDiv from './TomatoClockDiv'
import ClockBar from './ClockBar';

export default function jwpage() {
  return (
    <div>
        <ClockBar imageSrc="path/to/your/image.png" />
        <TomatoClockDiv topImageSrc="path/to/top/image.png" middleImageSrc="path/to/middle/image.png" startTime="12:50" />
    </div>
  )
}

