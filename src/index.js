import React from 'react'
import {render} from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import App from './components/App'


render(<App data = {window.data} />, document.getElementById('calc'))
registerServiceWorker()