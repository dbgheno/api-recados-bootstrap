import express from 'express'
import cors from 'cors'

import usersRouter from './routes/users'
import notesRouter from './routes/notes'

const app = express()

const PORT = 3000

app.use(express.json())
app.use(cors())

// Definindo Rotas para Roteadores
// todas as rotas dentro do arquivo users.js terão /users como prefixo
// todas as rotas dentro do arquivo notes.js terão /notes como prefixo
app.use('/users', usersRouter)
app.use('/notes', notesRouter)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
