import { useEffect, useState } from "react";
import "../css/style.css";
// const url_api = "https://unified-booster-392006.uc.r.appspot.com"
const url_api = "http://localhost:8080"


async function postGenericJson(data, prefix) {
  const response = await fetch(`${url_api}/${prefix}`, {
    headers: {
      "Content-Type": "application/json",
      "authorization":localStorage.getItem('token')
    }, method: 'post', body: JSON.stringify(data)
  })
  return await response.json()
}

// async function putGenericJson(data, prefix) {
//   const response = await fetch(`${url_api}/${prefix}/${data.id}`, {
//     headers: {
//       "Content-Type": "application/json",
//       'authorization':localStorage.getItem('token'),
//     }, method: 'put', body: JSON.stringify(data)
//   })
//   return await response.json()
// }

// async function Deletar(produto,prefix='/produtos/'){
//     const response = await fetch(`${url_api}${prefix}${produto.id}`, {
//       headers: {
//         "Content-Type": "application/json",
//         "authorization":localStorage.getItem("token")
//       }, method: 'delete'
//     })
//     return await response.json()
  
//   }



async function getProdutos() {
  const response = await fetch(`${url_api}/produtos`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}


export default function Mercado() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [info, setInf] = useState({
    total: 0,
    desconto: 0,
    produtos: 0,
    produtos_dif: 0,
  });

  function adicionarProdutoAoCarrinho(produto) {
    let isContem = false;
    carrinho.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque += 1;
        produto.estoque -= 1;
        isContem = true;
      }
    });
    if (!isContem) {
      let new_produto = { ...produto, estoque: 1 };
      produto.estoque -= 1;
      carrinho.push(new_produto);
    }
    atualizaDashboard("+", produto, carrinho);
  }

  // function handleDelete(produto){
  //   console.log(produto)
  //   Deletar(produto).then(response_backend=>{
  //     console.log("recebi do back",response_backend)

  //     const localiza_index_array_produtos_font_end = produtos.findIndex( (produto) => {
  //         if(produto.id === response_backend){
  //           return produto
  //         }
  //     } )
  //     console.log("index localizado: ",localiza_index_array_produtos_font_end,"do produto id: ",response_backend)

  //     let  produto_removido = produtos.splice(localiza_index_array_produtos_font_end,1)
  //     console.log('Produto splice: ', produto_removido )
  
  //     setProdutos([...produtos])
  //   });

  // };

  function removeProdutoDoCarrinho(produto) {
    produtos.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque += 1;
        produto.estoque -= 1;
      }
    });
    let newCarrinhoSemProduto = carrinho.filter((item) => item.estoque !== 0);
    atualizaDashboard("-", produto, newCarrinhoSemProduto);
  }

  function removeTudoDoCarrinho() {
    carrinho.forEach((produtoCarrinho) => {
      produtos.forEach((produtoEstoque) => {
        if (produtoEstoque.id === produtoCarrinho.id) {
          info.total -= produtoEstoque.valor * produtoCarrinho.estoque;
          produtoEstoque.estoque += produtoCarrinho.estoque;
          info.produtos -= produtoCarrinho.estoque;
          produtoCarrinho.estoque = 0;
        }
      });
    });

    const novoCarrinho = carrinho.filter(produto => produto.estoque !== 0);
    setCarrinho(novoCarrinho);

    setInf({
      ...info,
      produtos: 0,
      produtos_dif: novoCarrinho.length
    });
    atualizaDesconto();
  }

  function atualizaDashboard(operador, produto, carrinho) {
    setCarrinho([...carrinho]);
    info.produtos_dif = carrinho.length;
    if (operador === "+") {
      info.total = produto.valor + info.total;
      info.produtos += 1;
    } else if (operador === "-") {
      info.total = info.total - produto.valor;
      info.produtos -= 1;
    }
    if (info.produtos < 1) {
      info.total = 0
    }
    atualizaDesconto();

  }

  function atualizaDesconto() {
    let desconto = 0;
    const descontoPorProdutos = {
      3: 0.1,
      5: 0.2
    };
    const valorMinimoCompra = 500;
    const descontoMinimoCompra = 0.05;

    // Calcula o desconto com base na quantidade de produtos diferentes
    const qtdeProdutosDiferentes = info.produtos_dif;
    if (qtdeProdutosDiferentes in descontoPorProdutos) {
      desconto = info.total * descontoPorProdutos[qtdeProdutosDiferentes];
    }

    // Aplica o desconto adicional se o valor total da compra for suficiente
    if (info.total >= valorMinimoCompra) {
      desconto += info.total * descontoMinimoCompra;
    }

    // Atualiza o estado com o desconto calculado
    setInf({ ...info, desconto });
  }

  function addProdutoNovo(a) {
    a.preventDefault();
    const form = a.target;
    console.log("form", form);
    const formData = new FormData(form);
    console.log("formData", formData);

    
    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });
    
    postGenericJson(object,"produtos").then(data=>{data.valor=Number(data.valor);console.log('Return:',data);produtos.push(data);setProdutos([...produtos])})
  }


 useEffect(() => {
  getProdutos().then((data) => {
    setProdutos(data);
  });
}, []);
function formatarValor(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

 
  return (
    <>

      <div className="produtos">
        {/* <div className="titu"><h1>Loja gamer</h1></div> */}
        {produtos.map((produto) => (
          <div key={produto.id} className="card">
            <div className="cartao">
              <div className="cartao_top">
                <p>{produto.nome}</p>
              </div>
              <div className="cartao_main">
                <img src={produto.img} alt="" />
              </div>
              <div className="cartao_valor">
                <p>R$: {produto.valor}</p>
              </div>
              <div className="cartao_estoque">
                <p>Disponivel: {produto.estoque}</p>
              </div>
              <div className="cartao_botao">
                <button className="btn1" onClick={() => adicionarProdutoAoCarrinho(produto)}>
                  comprar
                </button>
                {/* <button className="btn11" onClick={() => handleDelete(produto)}>
                  Deleta
                </button>
                 */}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="carrinho_page">

        <div className="carrinho">
          {carrinho.map((produto) => (
            <div key={produto.id} className="card">
              <div className="cartao">
                <div className="cartao_top">
                  <p>{produto.nome}</p>
                </div>
                <div className="cartao_main">
                  <img src={produto.img} alt="" />
                </div>
                <div className="cartao_valor">
                  <p>R$:{produto.valor}</p>
                </div>
                <div className="cartao_estoque">
                  <p>Quantidade: {produto.estoque}</p>
                </div>
                <div className="cartao_botao">
                  <button className="btn2" onClick={() => removeProdutoDoCarrinho(produto)}>
                    Remove
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="carrinho_top_inf">
          <table>
            <tbody>
              <tr>
                <td>Total R$:</td>
                <td>
                  <span>{formatarValor(info.total)}</span>
                </td>
              </tr>
              <tr>
                <td>Desconto R$:</td>
                <td>
                  <span>{formatarValor(info.desconto)}</span>
                </td>
              </tr>
              <tr>
                <td>Produtos Qtd:</td>
                <td>
                  <span>{info.produtos}</span>
                </td>
              </tr>
              <tr>
                <td>Produtos Diferentes:</td>
                <td>
                  <span>{info.produtos_dif}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="limp" onClick={removeTudoDoCarrinho}>Limpar</button>
        <button className="finaliz">Finalizar Conta</button>

        <div className="prodfor">
          <form id="productForm" onSubmit={addProdutoNovo} method="post">

            <label for="productName">id:</label>
            <input type="number" id="id" name="id" required />

            <label for="productName">Nome:</label>
            <input type="text" id="user" name="nome" required />

            <label for="productName">Link da img:</label>
            <input type="text" id="img" name="img" required />

            <label for="productPrice">Preço do Produto:</label>
            <input type="number" id="valor" name="valor" required />

            <label for="productName">Estoque:</label>
            <input type="number" id="estoque" name="estoque" required />

            <button className="btncads" type="submit">Cadastrar Produto</button>

          </form>
        </div>
        {/* <div id="productDisplay"></div> */}

      </div>



    </>
  );


}