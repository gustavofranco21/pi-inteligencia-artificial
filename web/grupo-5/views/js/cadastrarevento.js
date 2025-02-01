async function postEvent(event) {
  event.preventDefault();  // Evita que o formulário seja enviado de forma tradicional

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await axios.post("http://localhost:3005/eventos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setTimeout(() => {
      window.location.href = '/';
  }, 2000);
    console.log(response.data);
    exibirAlerta(".alert-evento", "Evento cadastrado com sucesso!", ["show", "alert-success"], ["d-none"], 2000);
  } catch (error) {
    console.error("Erro ao cadastrar evento:", error.response?.data || error.message);
    exibirAlerta(".alert-evento", "Erro ao cadastrar evento", ["show", "alert-danger"], ["d-none"], 2000);
  }
}

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
  let alert = document.querySelector(seletor);
  if (alert) {
    alert.innerHTML = innerHTML;
    alert.classList.add(...classesToAdd);
    alert.classList.remove(...classesToRemove);

    setTimeout(() => {
      alert.classList.remove('show');
      alert.classList.add('d-none');
    }, timeout);
  } else {
    console.error("Elemento de alerta não encontrado. Verifique o seletor:", seletor);
  }
}

const form = document.getElementById('eventoForm');
form.addEventListener('submit', postEvent);

const GEMINI_KEY = "AIzaSyBZlfyva_dGdPFIzPomwMccqV9OTX2J3Ck";

async function gerarNomeEvento(prompt) {
  try {
      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
              contents: [
                  {
                      role: "user",
                      parts: [
                          {
                              text: `${prompt}. Não forneça sugestões múltiplas, apenas um nome específico.`
                          }
                      ]
                  }
              ]
          },
          {
              headers: { "Content-Type": "application/json" }
          }
      );

      console.log("Resposta da API:", response.data);

      const nomeGerado = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      return nomeGerado || "Nome não gerado";
  } catch (error) {
      console.error("Erro ao gerar nome do evento:", error.response?.data || error.message);
      return "";
  }
}

async function gerarNomeAoClicar() {
    const promptNome = document.getElementById("promptNome").value;
    const nomeInput = document.getElementById("nome");

    if (!promptNome || !descricao) {
        alert("Preencha o prompt antes de gerar um nome.");
        return;
    }

    nomeInput.value = "Gerando nome..."; 
    const nomeGerado = await gerarNomeEvento(promptNome);
    
    if (nomeGerado) {
        nomeInput.value = nomeGerado;  
    } else {
        nomeInput.value = ""; 
        alert("Erro ao gerar nome do evento. Tente novamente.");
    }
}

document.getElementById("btnGerarNome").addEventListener("click", gerarNomeAoClicar);