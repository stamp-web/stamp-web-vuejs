import axios from 'axios'

const ApplicationConfig = () => {
  const getConfiguration = async () => {
    return await axios.get('app-config.json')
  }
  return {
    getConfiguration
  }
}

export default ApplicationConfig
