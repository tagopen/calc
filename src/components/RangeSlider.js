import React, { Component } from 'react'

export default class RangeSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rangeSlider: {
        value: this.props.values[0]
      }
    }
  }

  handleChange(ev) {
    const value = ev.target.value
    this.props.changeSelected(value)

    this.setState({
      rangeSlider: { 
        value: value
      }
    })
  }

  render() {
    const {value} = this.state.rangeSlider
    const defaultValues = this.props.values
    const min = defaultValues[0]
    const max = defaultValues[defaultValues.length - 1]

    return (
        <div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={value => this.handleChange(value)} list="tickmarks"/>
        <datalist id="tickmarks">
          {defaultValues.map((item) =>
              <option value={item} key={`value-${item}`} label={item} />
          )}
        </datalist>
        <span>{value}</span>
      </div>
    )
  }
}