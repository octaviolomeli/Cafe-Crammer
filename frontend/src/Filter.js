import React from 'react';

const Filter = (props) => {
  return(
    <div>
      <span className="a-filter">{props.spanText}</span>
      <select className="drop-down" name={props.name}>
          {
              props.data.map(item => <option key={item.value} value={item.value}>{item.text}</option>)
          }
      </select>
    </div>
  )
}

export default Filter