import * as types from '../constants'
import { Action as ReduxAction } from 'redux'

interface IAction<T> extends ReduxAction {
	payload?: T
}

interface IMapPayload {}
interface IStateProps {}


const initialState: IStateProps = {
  rangeSliderValue: 0,
}

export default function(state = initialState, { type, payload }: IAction<IMapPayload>) {
  switch(type) {
    case types.UPDATE_RANGE_SLIDER:
      return {
        rangeSliderValue: payload
      }
    default:
      return state
  }
}

