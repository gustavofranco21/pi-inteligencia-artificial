const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();
const port = 3005;
const uri = process.env.MONGODB_URL;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração de armazenamento com multer
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now());
  }
});
var upload = multer({ storage: storage });



const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

// Modelo do Evento
const Evento = mongoose.model('Evento', mongoose.Schema({
    nome: String,
    telefone: String,
    numero: Number,
    cep: String,
    img: {
      data: Buffer,
      contentType: String
    },
    preco: Number,
    complemento: String,
    ingresso: Number,
    descricao: String,
    endereco: String,
    categoria: String
  }));
const Usuario = mongoose.model('Usuario', mongoose.Schema({
    nome: String,
    email: { type: String, required: true, unique: true },
    senha: String,
    telefone: String,
    cnpj: { type: String, required: true, unique: true },
    cep: String,
    complemento: String,
    endereco: String,
    numero: String
}));

app.get("/evento", async (req, res) => {
    try {
        const eventos = await Evento.find(); // Busca no modelo Evento
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar eventos" });
    }
});

app.get("/evento/:id", async (req, res) => {
    try {
        const eventoId = req.params.id; // Captura o ID passado na URL
        const evento = await Evento.findById(eventoId); // Busca o evento pelo ID

        if (!evento) {
            // Caso o evento não seja encontrado
            return res.status(404).json({ mensagem: "Evento não encontrado" });
        }

        res.json(evento); // Retorna o evento encontrado
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensagem: "Erro ao buscar evento" });
    }
});
app.get("/eventosCat", async (req, res) => {
    try {
        const { categoria } = req.query; // Obtém a categoria dos parâmetros de consulta

        if (categoria) {
            const eventos = await Evento.find({ categoria }); // Filtra os eventos pela categoria
            if (!eventos.length) {
                return res.status(404).json({ mensagem: "Nenhum evento encontrado para essa categoria" });
            }
            return res.json(eventos);
        }

        // Se nenhuma categoria for especificada, retorna todos os eventos
        const eventos = await Evento.find();
        res.json(eventos);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar eventos" });
    }
});
// Endpoints
app.post("/eventos", upload.single('img'), async (req, res) => {
    try {
      const { nome, telefone, numero, cep, preco, complemento, ingresso, descricao, endereco, categoria } = req.body;
  
      const evento = new Evento({
        nome: nome,
        telefone: telefone,
        numero: numero,
        cep: cep,
        img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/*'
        },
        preco: preco,
        complemento: complemento,
        ingresso: ingresso,
        descricao: descricao,
        endereco: endereco,
        categoria: categoria
      });
  
      await evento.save();
      res.status(201).json({ mensagem: "Evento cadastrado com sucesso!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensagem: "Erro ao salvar evento" });
    }
  });
app.post("/usuario", async (req, res) => {
    try {
        const { nome, email, senha, telefone, cnpj, cep, complemento, endereco, numero, } = req.body;


        const usuarioExistenteEmail = await Usuario.findOne({ email });
        if (usuarioExistenteEmail) {
            return res.status(400).json({ mensagememail: "O e-mail já está cadastrado." });
        }
        const usuarioExistenteCnpj = await Usuario.findOne({ email });
        if (usuarioExistenteCnpj) {
            return res.status(400).json({ mensagemcnpj: "O cnpj já está cadastrado." });
        }
        // Criar o evento com os dados fornecidos
        const usuario = new Usuario({
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone,
            cnpj: cnpj,
            cep: cep,
            complemento: complemento,
            endereco: endereco,
            numero: numero,
        })

        // Salvar o evento no banco
        await usuario.save()

        // Buscar todos os eventos após a inserção
        const usuarios = await Usuario.find()

        // Retornar todos os eventos cadastrados
        res.json(usuarios)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: "Erro ao salvar usuario" })
    }
})

// Endpoint de login
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se o usuário existe pelo e-mail
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({ mensagem: "E-mail não encontrado." });
        }
         // Comparar a senha fornecida com a senha armazenada no banco de dados
        if (usuario.senha !== senha) {  // Comparação direta das senhas
            return res.status(400).json({ mensagem: "Senha incorreta." });
}

        // Gerar um token JWT
       //const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retorna o token no login
        res.json({ mensagem: "Login bem-sucedido" });

                } catch (error) {
                    console.error("Erro ao realizar login:", error);
                    res.status(500).json({ mensagem: "Erro ao realizar login." });
}
});

app.get('/eventos', async(req, res) => {
    Evento.find({})
    .then((data, err) => {
        let retorno = []
        data.forEach(function(item) {
            var item = {
                nome: item.nome,
                img: {
                    data: item.img.data.toString('base64'),
                    contentType: item.img.contentType
                }
            }

            retorno.push(item)
        })

        console.log(JSON.stringify(retorno))
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(retorno))
    })
})


async function conectarAoMongo() {
    await mongoose.connect(uri, {});
}

app.listen(port, () => {
    try {
        conectarAoMongo()
        console.log(`Servidor rodando na port ${port}`)
    } catch (error) {
        console.log("Erro", e)
    }
})