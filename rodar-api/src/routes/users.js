import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { validateUserRegistration } from '../middlewares/validation.js'

// Cria uma instância do roteador Express.
const router = express.Router()

export const users = []

// Define a rota de cadastro
router.post('/signup', validateUserRegistration, async (request, response) => {
  const { name, email, password } = request.body

  // Verifica se existe algum usuário com esse e-mail
  const emailAlreadyRegistered = users.find(user => user.email === email)

  if (emailAlreadyRegistered) {
    return response.status(400).json({
      message: "E-mail já cadastrado."
    })
  }

  // Encriptando a senha para ficar mais segura
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword // salvando a senha encriptada no array
  }

  users.push(newUser)

  response.status(201).json({
    message: "Conta criada com sucesso.",
    user: newUser
  })
})

// Define a rota de login
router.post('/login', async (request, response) => {
  const { email, password } = request.body

  const user = users.find(user => user.email === email)

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return response.status(400).json({
      message: "Credenciais inválidas."
    })
  }

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  response.status(200).json({
    message: "Login bem-sucedido!",
    userId: user.id
  })
})

export default router