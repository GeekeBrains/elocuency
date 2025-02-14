'use client';

// import GaugeChart from 'react-gauge-chart';

// import {XYPlot, ArcSeries, LineSeries} from 'react-vis';

// import {EXTENDED_DISCRETE_COLOR_RANGE} from 'theme';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// function getSeconds() {
//   return Math.floor(new Date().getTime() / 1000);
// }

// const DAILY_TARGET = 50;
const SECONDS_MAX = 300;
type pType = {
  wordNumberTarget: number;
  wordNumberOk: number;
  endTimeEvent: any;
  activeTimer: boolean;
  speed: number;
};
export const Score = forwardRef(
  (
    { wordNumberTarget, wordNumberOk, endTimeEvent, activeTimer, speed }: pType,
    ref
  ) => {
    const [time, setTime] = useState(0);

    useImperativeHandle(ref, () => ({
      resetTime: () => {
        setTime(0);
        console.log('reset!');
      },
    }));

    useEffect(() => {
      if (activeTimer) {
        const interval = setInterval(() => {
          setTime((value) => {
            if (value > SECONDS_MAX) {
              endTimeEvent();
              return 0;
            } else {
              return value + 1;
            }
          });
        }, 500);
        return () => clearInterval(interval);
      } else {
        setTime(0);
      }
    });

    const currentTargetArc = (Math.PI * wordNumberOk) / (wordNumberTarget / 2);
    // const currentTargetArc = (Math.PI * countOk) / (DAILY_TARGET / 2);
    const timeArc = (Math.PI * time) / (SECONDS_MAX / 2);

    // console.log({
    //   wordNumberOk,
    //   wordNumberTarget,
    //   countOk,
    //   speed,
    //   levelTargetArc,
    //   dailyTargetArc,
    // });
    return (
      <div className="score">
        {/* <XYPlot
          xDomain={[-3, 3]}
          yDomain={[-3, 3]}
          width={300}
          getAngle={d => d.time}
          getAngle0={() => 0}
          height={300}
        >
          <ArcSeries
            animation={{
              damping: 9,
              stiffness: 300,
            }}
            radiusDomain={[0, 3]}
            data={[
              {
                time: currentTargetArc,
                radius0: 1,
                radius: 1.5,
                color: 0,
              },
              // {
              //   time: currentTargetArc,
              //   radius0: 2,
              //   radius: 2.5,
              //   color: 1,
              // },
              {
                time: timeArc,
                radius0: 3,
                radius: 3.1,
                color: 2,
              },
            ]}
            colorRange={['#ffffff5e', '#3c52f340']}
          />
        </XYPlot> */}

        {/* {countOk}/{wordNumberOk}/{wordNumberTarget}
        <br></br>
        {countOk}/{DAILY_TARGET}
        <br></br>
        {time}/{SECONDS_MAX}
        <br></br> */}
        {/* <GaugeChart
        id="gauge-chart4"
        nrOfLevels={10}
        arcPadding={0.19}
        cornerRadius={3}
        hideText={true}
        // animate={false}
        percent={percent}
      />
      <div className="text">{countOk}</div> */}
        {/* <spam>{Math.round10(speed, -2)}/min</spam>
      <spam>{Math.round(timeUsed, -1)} s</spam> */}
      </div>
    );
  }
);

Score.displayName = 'Score';
