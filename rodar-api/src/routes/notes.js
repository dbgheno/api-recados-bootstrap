import express from 'express'
import { v4 as uuidv4 } from 'uuid'

import { users } from './users'

// Router() é uma função do express. 
// Poderíamos desestruturar de dentro do express
const router = express.Router()

const messages = []

// No lugar de acessar de dentro do app, acessamos de dentro do router
router.post('/', (request, response) => {
  const { title, description, userId } = request.body

  const user = users.find(user => user.id === userId)

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    })
  }

  const newMessage = {
    id: uuidv4(),
    title,
    description,
    userId
  }

  messages.push(newMessage)

  response.status(201).json({
    message: "Recado criado com sucesso.",
    newMessage
  })

})

// Listar todos os recados de um usuário
// router.get('/:userId', (request, response) => {
//   const { userId } = request.params

//   const user = users.find(user => user.id === userId)

//   if (!user) {
//     return response.status(404).json({
//       message: "Usuário não encontrado."
//     })
//   }

//   const userMessages = messages.filter(message => message.userId === userId)

//   response.status(200).json(userMessages)
// })

// Rota para listar todos os recados de um usuário específico com suporte à paginação
router.get("/:userId", (request, response) => {
  const { userId } = request.params;
  // page -> página atual ex: page=2
  // perPage -> quantos itens devem ser exibidos por página ex: perPage=10 (10 itens por pagina)
  const { page, perPage } = request.query; // Obtenha os parâmetros de consulta

  const user = users.find(user => user.id === userId);

  if (!user) {
    return response.status(404).json({
      message: "Usuário não encontrado."
    });
  }

  // Converta os valores de página e por página em números inteiros
  const currentPage = parseInt(page) || 1; // valor padrão é 1
  const itemsPerPage = parseInt(perPage) || 10; // valor padrão é 10

  const userMessages = messages.filter(message => message.userId === userId)

  const totalItems = userMessages.length // quantidade de recados no array

  // Calcule o índice inicial e final com base na página atual e no número por página
  // startIndex é a posição do primeiro item que deve ser exibido na página atual.
  // 0 é a primeira página (indice do array)
  // currentPage = 1
  // itemsPerPage = 10
  // startIndex = (1 - 1) * 10 = 0 (comece a listar as tarefas a partir do primeiro elemento)
  const startIndex = (currentPage - 1) * itemsPerPage;
  // endIndex = 0 + 10 = 10 (termine a lista após o décimo elemento)
  // Isso significa que, na primeira página, você exibirá as tarefas de 0 a 9 (índices 0 a 9)
  const endIndex = startIndex + itemsPerPage;

  // determinar os índices de início e fim dos recados a serem exibidos na página atual. 
  // O método slice() retorna uma cópia de parte de um array. Passamos para ele início e fim.
  // para selecionar o subconjunto de recados que começa no índice startIndex e vai até (mas não inclui) o índice endIndex
  // Use slice para obter apenas os recados da página atual
  // Aplica o slice apenas após calcular o total de itens
  const paginatedMessages = userMessages.slice(startIndex, endIndex)

  // ceil arredonda pra cima, floor arredonda pra baixo e round arredonda pra cima ou pra baixo, depende da parte fracionária.  
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calcule o número total de páginas

  response.status(200).json({
    userMessages: paginatedMessages,
    totalPages,
    currentPage
  });
});

// Rota para listar recado por id
router.get("/list/:messageId", (request, response) => {
  const { messageId } = request.params

  const message = messages.find(message => message.id === messageId)

  if (!message) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  response.status(200).json(message)
})

router.put('/:messageId', (request, response) => {
  const { messageId } = request.params
  const { title, description } = request.body

  const messageIndex = messages.findIndex(message => message.id === messageId)

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  messages[messageIndex].title = title
  messages[messageIndex].description = description

  response.status(200).json({
    message: "Recado atualizado com sucesso."
  })
})

router.delete('/:messageId', (request, response) => {
  const { messageId } = request.params

  const messageIndex = messages.findIndex(message => message.id === messageId)

  if (messageIndex === -1) {
    return response.status(404).json({
      message: "Recado não encontrado."
    })
  }

  const deletedMessage = messages.splice(messageIndex, 1)

  response.status(200).json({
    message: "Recado excluído com sucesso.",
    deletedMessage
  })
})

export default router;