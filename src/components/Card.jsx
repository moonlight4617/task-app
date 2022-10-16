import React from 'react'
import { format } from 'date-fns'

export const Card = (props) => {
  const { title, startDate, compDate, pic, note, onClickEditTask, id } = props;
  const ToDateStart = startDate;
  const ToDateComp = compDate;

  const formattedStartDate = format(ToDateStart, 'yyyy/MM/dd') || null;
  const formattedCompDate = format(ToDateComp, 'yyyy/MM/dd') || null;
  return (
    <>
      <div className='card' onClick={onClickEditTask} id={id}>
        <h3 id={id}>{title}</h3>
        <div id={id}>担当者：{pic}</div>
        <div id={id}>開始日：{formattedStartDate}</div>
        <div id={id}>完了日：{formattedCompDate}</div>
        <div id={id}>備考：{note}</div>
      </div>
    </>
  )
}
