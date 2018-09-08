import React, { Component } from 'react'
import $ from 'jquery'
import 'ion-rangeslider/js/ion.rangeSlider.min.js'

export default class RangeSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rangeSlider: {
        value: this.props.values[0]
      }
    }
  }

  handleChange(val) {
    const value = Number(val)
    this.props.changeSelected(value)
    console.log(value)

    this.setState({
      rangeSlider: { 
        value: value
      }
    })
  }

  componentDidMount(){
    this.initRangeSlider()
  }

  initRangeSlider() {
    $(this.refs.rangeslider).ionRangeSlider({
      type: 'single',
      grid: true,
      values: this.props.values,
      hide_min_max: true,
      onChange: data => this.handleChange(data.from_value)
    })
  }

  render() {

    return (
      <input
        id="c-info__range"
        name="range-slider"
        className="sr-only"
        tabIndex="-1"
        type="text"
        ref='rangeslider'
        />
    )
  }
}