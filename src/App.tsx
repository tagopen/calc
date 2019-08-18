import React from 'react'
// import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux'
// import { setRangeSliderValue } from './actions'

import logo from './logo.svg'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App

// export default connect(/*state => ({
//   rangeSliderValue: state.math.rangeSliderValue,
// }), */dispatch => bindActionCreators({
//   setRangeSliderValue,
// }, dispatch))(App)
