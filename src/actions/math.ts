import * as types from '../constants'
import { Dispatch } from 'redux'

export function setRangeSliderValue(value: number) {
  return (dispath: Dispatch) => {
    dispath({
      type: types.UPDATE_RANGE_SLIDER,
      payload: value
    })
  }
}
