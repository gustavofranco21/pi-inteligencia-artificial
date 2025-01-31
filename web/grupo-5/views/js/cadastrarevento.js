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