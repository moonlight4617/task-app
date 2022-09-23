import React from 'react'

export const Card = (props) => {
  const { title, startDate, compDate, pic } = props;
  return (
    <>
      <div className='card'>
        <h3>{title}</h3>
        <div>担当者：{pic}</div>
        <div>開始日：{startDate}</div>
        <div>完了日：{compDate}</div>
      </div>
    </>
  )
}
