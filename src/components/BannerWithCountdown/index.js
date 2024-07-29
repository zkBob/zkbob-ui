import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

const CountdownUnit = ({ value, label }) => (
  <UnitWrapper>
    <UnitValue>{value}</UnitValue>
    <UnitLabel>{label}</UnitLabel>
  </UnitWrapper>
);

const Countdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(moment.duration(moment(endDate).diff(moment())));

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = moment.duration(moment(endDate).diff(moment()));
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <CountdownWrapper>
      <CountdownUnit value={Math.floor(timeLeft.asDays())} label="days" />
      <CountdownUnit value={timeLeft.hours()} label="hrs" />
      <CountdownUnit value={timeLeft.minutes()} label="min" />
      <CountdownUnit value={timeLeft.seconds()} label="sec" />
    </CountdownWrapper>
  );
};

export default ({ children, endDate }) => (
  <BannerWithCountdown>
    <Text>{children}</Text>
    <Countdown endDate={endDate} />
  </BannerWithCountdown>
);

const BannerWithCountdown = styled.div`
  width: 100%;
  min-height: 40px;
  box-sizing: border-box;
  padding: 0 22px;
  background: #754CFF;
  color: ${props => props.theme.color.white};
  font-size: 14px;
  line-height: 22px;
  font-weight: ${props => props.theme.text.weight.bold};
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  z-index: 1;
  @media only screen and (max-width: 1000px) {
    flex-direction: column;
    padding: 10px 22px;
    gap: 12px;
  }
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: ${props => props.theme.text.weight.bold};
`;

const CountdownWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`;

const UnitWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-left: 1px solid #6437C1E5;
  background: #2A1B5B;
  min-width: 60px;
  height: 100%;

  &:first-child {
    border-left: none;
  }
`;

const UnitValue = styled.span`
  font-size: 24px;
  font-weight: ${props => props.theme.text.weight.bold};
  margin-right: 6px;
`;

const UnitLabel = styled.span`
  font-size: 14px;
  font-weight: ${props => props.theme.text.weight.normal};
`;
