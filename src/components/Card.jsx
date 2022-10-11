import React from 'react'
import dayjs from 'dayjs';
import { format } from 'date-fns'

export const Card = (props) => {
  const { title, startDate, compDate, pic, note } = props;
  const ToDateStart = startDate.toDate();
  const ToDateComp = compDate.toDate();
  const formattedStartDate = format(ToDateStart, 'yyyy/MM/dd')
  const formattedCompDate = format(ToDateComp, 'yyyy/MM/dd')
  return (
    <>
      <div className='card'>
        <h3>{title}</h3>
        <div>担当者：{pic}</div>
        <div>開始日：{formattedStartDate}</div>
        <div>完了日：{formattedCompDate}</div>
        <div>備考：{note}</div>
      </div>
    </>
  )
}
