import app from './app.js'
import { PORT }  from './utils/config.js'
import { info, error } from './utils/logger.js'

app.listen(PORT, () => {
  info(`Server running on port http://localhost:${PORT}`)
})