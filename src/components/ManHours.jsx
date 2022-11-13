import React from 'react'

export function ManHours(props) {
  const { manHoursList } = props;
  return (
    <div className="MH-area">
      <h3 className="title">工数表示</h3>
      {manHoursList.map((mh, index) => (
        // <p key={index}>{mh.pic}<span>{mh.operatingTime - 1}</span><span>/{mh.operatingTime}</span></p>
        <p key={index}>{mh.pic}<span>{mh.taskHour}</span><span>/{mh.operatingTime}</span></p>
      ))}
    </div>
  )
}