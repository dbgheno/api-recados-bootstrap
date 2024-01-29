const messagesContainer = document.querySelector('.messages-list')

const prevPage = document.getElementById('prevPage')
const nextPage = document.getElementById('nextPage')

// Variáveis globais
let currentPage = 1
let totalPages = 1

async function fetchMessages(page) {
    try {
        const userId = localStorage.getItem('userId')

        if (!userId) {
            alert("Você precisa fazer login para visualizar os recados.")

            return
        }

        const params = {
            page,
            perPage: 3
        }

        const response = await api.get(`/notes/${userId}`, { params })
        const messages = response.data.userMessages



        totalPages = response.data.totalPages

        messagesContainer.innerHTML = ''

        messages.forEach(message => {
            const messageCard = document.createElement('div')


            messageCard.innerHTML = `
      <div class="card mb-2 ">
        <div class="card-header"><h2 class="text-center">${message.title}</h2></div>
        <div class="card-body">
          
          <p class="card-text p-2 text-center ">
          ${message.description}
          </p>
        <div class=" centralizarButtons d-flex  justify-content-center align-items-center"><i class="fas fa-solid fa-trash btn btn-danger btn-sm m-2" data-id=${message.id}></i>
        <i class="fas fa-regular fa-edit btn btn-warning btn-sm" data-id=${message.id}></i></div>
          
        </div>
      </div>
      `

            messagesContainer.appendChild(messageCard)

            const deleteIcon = messageCard.querySelector('.fa-trash')

            deleteIcon.addEventListener('click', () => {
                const messageId = deleteIcon.getAttribute('data-id')

                deleteMessage(messageId)
            })

            const editIcon = messageCard.querySelector('.fa-edit')
            editIcon.addEventListener('click', () => {
                const messageId = editIcon.getAttribute('data-id')

                navigateToEditPage(messageId)
            })
        });

        if (messages.length === 0) {
            const h3 = document.createElement('h3')
            h3.textContent = 'Nenhum recado cadastrado.'
            messagesContainer.appendChild(h3)
        }
    } catch (error) {
        console.log('Erro ao buscar mensagens', error)
    }
}

fetchMessages(currentPage)

function navigateToEditPage(messageId) {
    location.href = `editar-recado.html?id=${messageId}`
}

prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        fetchMessages(currentPage)
    }
})

nextPage.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMessages(currentPage)
    }
})