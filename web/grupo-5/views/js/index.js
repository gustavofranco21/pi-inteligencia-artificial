async function exibirEventoPorId(eventoId) {
    const eventoEndpoint = `/evento/${eventoId}`; 
    const URLCompleta = `http://localhost:3005${eventoEndpoint}`;

    try {
        const evento = (await axios.get(URLCompleta)).data;

        // Atualizar o modal com os detalhes do evento
        const modal = document.querySelector('#eventoModal');
        const modalTitulo = document.querySelector('#modalTitulo');
        const modalDescricao = document.querySelector('#modalDescricao');
       
        const modalBotaoVerMais = document.querySelector('#modalVerMais');

        modalTitulo.textContent = evento.nome;
        modalDescricao.textContent = evento.descricao;
        
        modalBotaoVerMais.onclick = function () {
            window.location.href = `detalhe_evento.html?id=${evento._id}`;
        };

        modal.style.display = 'block';
    } catch (error) {
        console.error("Erro ao buscar o evento:", error);
        alert("Erro ao carregar os detalhes do evento.");
    }
}

function fecharModal() {
    const modal = document.querySelector('#eventoModal');
    modal.style.display = 'none'; // Esconde o modal
    modal.querySelector('#modalTitulo').textContent = ''; // Limpa o título
    modal.querySelector('#modalDescricao').textContent = ''; // Limpa a descrição
    modal.querySelector('#modalImagem').src = ''; // Limpa a imagem
}



// Garante que a função seja chamada após carregar o DOM


// Função para verificar se o usuário está logado
function verificarLogin() {
    const token = localStorage.getItem('auth_token');
    
    // Se o token estiver presente, o usuário está logado
    if (token) {
        // Alterar o botão de login para "Sair"
        document.getElementById('entrar').textContent = 'Sair';
        document.getElementById('entrar').onclick = logout;
        
        // Exibir o botão "Criar Evento"
        document.getElementById('criarEvento').classList.remove('d-none');
    } else {
        // Caso contrário, o botão de login aparece como "Entrar"
        document.getElementById('entrar').textContent = 'Entrar';
        document.getElementById('entrar').onclick = mostrarLogin;
        
        // Esconder o botão "Criar Evento"
        document.getElementById('criarEvento').classList.add('d-none');
    }
}

// Função de logout
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('auth_token');
    window.location.reload(); // Recarrega a página para atualizar o estado
}

// Função para mostrar o login (poderia redirecionar para uma página de login ou exibir um modal)
function mostrarLogin(event) {
    event.preventDefault();
    window.location.href = 'login-05.html'; // Ou pode ser um modal de login
}

// Chama a função para verificar o login quando a página carregar
verificarLogin();

document.addEventListener('DOMContentLoaded', () => {
    const categorias = document.querySelectorAll('.categories-section .card');

    categorias.forEach(categoria => {
        categoria.addEventListener('click', () => {
            const categoriaSelecionada = categoria.querySelector('h5').textContent;
            localStorage.setItem('categoriaSelecionada', categoriaSelecionada);
            window.location.href = 'categoria.html';
        });
    });
});