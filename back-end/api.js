
const produtos_banco_de_dados = [
  {
    id: 1,
    nome: "Mouse Gamer Redragon",
    img: "https://images.tcdn.com.br/img/img_prod/673870/180_mouse_gamer_redragon_centrophorus_m601_rgb_7200dpi_6_botoes_rgb_preto_4605_1_0850a8c12c8f84e19494f258e30e9611.jpg",
    valor: 100.42,
    estoque: 10,
  },
  {
    id: 2,
    nome: "Fone de Ouvido Gamer",
    img: "https://jovemnerd.com.br/wp-content/uploads/2021/12/hyperx-cloud-flight-s-produtos-que-todos-os-gamers-gostariam-de-ter-nerdbunker-760x760.jpg",
    valor: 50.00,
    estoque: 23,
  },
  {
    id: 3,
    nome: "Teclado Gamer Pcfort",
    img: "https://images.tcdn.com.br/img/img_prod/1002494/180_teclado_gamer_pcfort_especial_para_jogos_10805_1_17943b979389d4a4465da6b33b0a3bc2.jpg",
    valor: 120.0,
    estoque: 10,
  },
  {
    id: 4,
    nome: "Controle Bluetooth T3",
    img: "https://www.mobilegamer.com.br/wp-content/uploads/2016/04/controle-para-celular-gamepad-bluetooth-t3-joystick-novidade-569011-MLB20455723646_102015-F.jpg",
    valor: 40.00,
    estoque: 10,
  },
  {
    id: 5,
    nome: "Munitor Gamer",
    img: "https://jovemnerd.com.br/wp-content/uploads/2021/11/samsung-odyssey-g7-produtos-gamers-black-friday-nerdbunker-760x570.jpg",
    valor: 46.33,
    estoque: 17,
  },
  {
    id: 6,
    nome: "Teclados Gamers",
    img: "https://lojagoldentec.vteximg.com.br/arquivos/ids/161795-600-600/teclado-mecanico-gamer-goldentec-gt-mechanical-34309-1-min.jpg?v=637970434031470000",
    valor: 120.00,
    estoque: 13,
  },
  {
    id: 7,
    nome: "Xbox One S",
    img: "https://sm.ign.com/ign_br/screenshot/default/series-s_p64d.jpg",
    valor: 1000.0,
    estoque: 10,
  },
];

const db_fake = [
  { id: 0, user: "pedro", password: '12345' },
  { id: 1, user: "lucas", password: '12345' },
];


function insertItem(item) {
  produtos_banco_de_dados.push(item);
}

function updateItem(id, updatedItem) {
  const index = produtos_banco_de_dados.findIndex((item) => item.id === id);
  if (index !== -1) {
    produtos_banco_de_dados[index] = { ...produtos_banco_de_dados[index], ...updatedItem };
  }
}

function deleteItem(id) {
  const index = produtos_banco_de_dados.findIndex((item) => item.id === id);
  if (index !== -1) {
    produtos_banco_de_dados.splice(index, 1);
  }
}
// const jwt = require('jsonwebtoken');
const secretKey = 'suaChaveSecreta';
var express = require("express");
var cors = require("cors");
var app = express();
const port = 8080;
app.use(cors());
app.use(express.json());
let id=produtos_banco_de_dados.length+1


app.get("/", (req, res) => {
  res
    .status(200)
    .jsonp("API da Turma de Front-End do SENAC Academy HUB Campo Grande - MS!");
});

app.post("/login", (req, res) => {
  const { user, password } = req.body;
  const isUser = db_fake.find(
    (data) => data.user === user && data.password === password
  );
  if (isUser) {
    const token = jwt.sign({ user }, secretKey);
    res.status(200).jsonp({ login: true, token:token });
  } else {
    res.status(404).jsonp({ login: false });
  }
});

app.get("/produtos", (req, res) => {
  res.status(200).jsonp(produtos_banco_de_dados);
});

function verifyToken(req, res, next) {
  console.log(req)
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = decoded.user;
    next();
  });
}

app.post("/produtos",(req, res) => {
  var newItem = req.body;
  newItem.id=id;
  insertItem(newItem);
  id+=1
  res.status(200).jsonp(newItem);
});

app.put("/produtos/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  updateItem(id, updatedItem);
  res.status(200).jsonp(updatedItem);
});

app.delete("/produtos/:id",  verifyToken,(req, res) => {
  const id = parseInt(req.params.id);
  deleteItem(id);
  res.status(200).jsonp(id);
});

app.listen(port, "0.0.0.0",  verifyToken,() => {
  console.log(`Example app listening on port ${port}`);
});

class addProdutoNovo {
  constructor( produtoJson){
    id = produtoJson.id 
    img = produtoJson.img 
    valor = produtoJson.valor 
    estoque = produtoJson.estoque 
  }
}