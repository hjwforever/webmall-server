import { createApp } from 'vue'
import SvgIcon from '@/components/SvgIcon/index'// svg component
import App from '../App'

// register globally
createApp(App).component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
