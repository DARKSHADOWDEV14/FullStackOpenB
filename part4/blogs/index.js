import { info } from './utils/logger.js'
import app from './app.js'
import { PORT } from './utils/config.js'


app.listen(PORT, () => {
  info(`Server running on port http://localhost:${PORT}`)
})