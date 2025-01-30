const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const router = express.Router()
//const axios = require('axios')

const path = __dirname + '/views/'

const app = express()

var bodyParser = require('body-parser')
app.set("view engine", "ejs")
var axios = require('axios')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const serverurl = 'http://localhost:3005/eventos'

/*router.get('/', function (req,res){
  res.sendFile(path + 'index.html');
})*/


app.use('/',router);
router.get('/', function(req, res){
  axios.get(serverurl)
  .then((data, err) => {
    let retorno = []
    let newdata = data.data

    newdata.forEach(function(item) {
      var item = {
        nome: item.nome,
        img: {
          data: item.img.data,
          contentType: item.img.contentType
        } 
      }
      retorno.push(item)
    })

    res.render('index',{items: retorno})
  })
})

app.use(express.static('views'));
const port = 8085;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});