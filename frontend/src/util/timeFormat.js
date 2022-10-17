
import React from 'react';
import date from 'date-and-time';
import TimeAgo from 'react-timeago'

export const getLocalTimeElements = (input) => {

  // let [month, date, year] = (new Date(input)).toLocaleDateString().split("/");
  let [month, day, year] = (new Date(input)).toLocaleDateString().split("/")
  let [hour, minute, second] = (new Date(input)).toLocaleTimeString().slice(0, 7).split(":")
  let xm = (new Date(input)).toLocaleTimeString().split(' ')[1];

  return {
    month: month,
    // date: date,
    day: day,
    year: year,
    hour: hour,
    minute: minute,
    second: second,
    xm: xm,
    dateDisplay: year + '-' + month + '-' + day,
    // timeDisplay: hour + ':' + minute + ':' + second + ' ' + xm,
  }
}

export const getDate = (time) => {
  // console.log(new Date(dateObj).getTime(), Date.now());
  const dateNum = new Date(time).getTime();
  if (dateNum > Date.now() - 1000 * 60 * 60 * 24) {
    return <TimeAgo date={dateNum} minPeriod='60' />
  } 
  else {
    return date.format(new Date(time), 'YYYY/MM/DD');
  }
}

export const getDateTime = (time) => {
  const dateNum = new Date(time).getTime();
  if (dateNum > Date.now() - 1000 * 60 * 60 * 24) {
    return <TimeAgo date={dateNum} minPeriod='60' />
  } else {
    return date.format(new Date(time), 'YYYY/MM/DD hh:mm A');
  }
}