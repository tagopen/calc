import React from 'react'
import {render} from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import App from './components/App'
import {data} from './fixtures'

render(<App data = {data} />, document.getElementById('calc'))
registerServiceWorker()