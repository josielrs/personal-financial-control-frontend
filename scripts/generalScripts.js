/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}






/*
  --------------------------------------------------------------------------------------
  Função para ocultar mensagem de erro
  --------------------------------------------------------------------------------------
*/
const hideErrorMessage = function() {

  document.getElementById('messageDisplay').hidden = true
}; 


/*
  --------------------------------------------------------------------------------------
  Função para exibir mensagem de erro
  --------------------------------------------------------------------------------------
*/
const showErrorMessage = function(message){
  document.getElementById('messageDisplay').hidden = true
  document.getElementById('messageContent').innerHTML = '<strong>'+message+'</strong>'
  document.getElementById('messageDisplay').hidden = false
}


/*
  --------------------------------------------------------------------------------------
  Função para ocultar todas as telas de menu
  --------------------------------------------------------------------------------------
*/
const hideAllSections = function() {
    hideErrorMessage()
    document.getElementById('financialEntrySection').setAttribute('style','display: none;')
    document.getElementById('creditCardSection').setAttribute('style','display: none;')
    document.getElementById('financialControlSection').setAttribute('style','display: none;')

}

/*
  --------------------------------------------------------------------------------------
  Função para exibir o menu de receitas, ele já chama o processo de busca de receitas no back-end
  --------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToRevenue = function(){
  hideAllSections()
  resetFinancialEntryTableContent()
  findFinancialEntryList(1)
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de despesas, ele já chama o processo de busca de despesas no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToExpenses = function(){
  hideAllSections()
  resetFinancialEntryTableContent()
  findFinancialEntryList(2)
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de reservas, ele já chama o processo de busca de reservas no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToReserve = function(){
  hideAllSections()
  resetFinancialEntryTableContent()
  findFinancialEntryList(3)
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de controles mensais, ele já chama o processo de busca de controles mensais no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialControlSection = function(){
  hideAllSections()
  document.getElementById('financialControlSection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de cartoes de credito, ele já chama o processo de busca de controles mensais no back-end
--------------------------------------------------------------------------------------
*/
const showCreditCardSection = function(){
  hideAllSections()
  document.getElementById('creditCardSection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para resetar o conteudo de uma table
--------------------------------------------------------------------------------------
*/
const resetFinancialEntryTableContent = function(tableName){

  let tableElement = document.getElementById(tableName)
  if (tableElement && tableElement != undefined) {
    while (tableElement.rows.length > 1){
      tableElement.deleteRow(tableElement.rows.length - 1)
    }
  }

}

/*
--------------------------------------------------------------------------------------
Função para popular dados de uma movimentação financeira
--------------------------------------------------------------------------------------
*/

const insertFinancialEntryTableContent = function(id, description, recurrentDesc, startDate, finishDate, value, 
                                                  valueType, creditCard, name, recurrent, categoryId, typeValueId){

      let tableElement = document.getElementById('financialEntryTable')
      let line = tableElement.insertRow(tableElement.rows.length)

      let celId = line.insertCell(0)
      let celDescription = line.insertCell(1)
      let celRecurrentDesc = line.insertCell(2)
      let celStartDate = line.insertCell(3)
      let celFinishDate = line.insertCell(4)
      let celValue = line.insertCell(5)
      let celValueType =  line.insertCell(6)
      let celCreditCard =  line.insertCell(7)
      let celName =  line.insertCell(8)
      let celRecurrent =  line.insertCell(9)
      let celCategoryId =  line.insertCell(10)
      let celTypeValueId =  line.insertCell(11)
      let celDelete = line.insertCell(12)

      celId.innerHTML = id
      celDescription.innerHTML = description
      celRecurrentDesc.innerHTML = recurrentDesc
      celStartDate.innerHTML = startDate
      celFinishDate.innerHTML = finishDate
      celValue.innerHTML = value
      celValueType.innerHTML = valueType
      celCreditCard.innerHTML = creditCard
      celName.innerHTML = name
      celName.hidden = true
      celRecurrent.innerHTML = recurrent
      celRecurrent.hidden = true
      celCategoryId.innerHTML = categoryId
      celCategoryId.hidden = true
      celTypeValueId.innerHTML = typeValueId
      celTypeValueId.hidden = true
      celDelete.innerHTML = '<img src="img/lixeira-de-reciclagem.png" width="15px" height="15px" onClick="deleteFinancialEntry('+id+')">'
}

/*
--------------------------------------------------------------------------------------
Função para excluir dados de uma movimentação financeira
--------------------------------------------------------------------------------------
*/

const deleteFinancialEntry = function(id){
  let idValue = id
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de movimentacoes financeiras do servidor
  --------------------------------------------------------------------------------------
*/
const findFinancialEntryList = async (entryTypeId) => {
  let url = 'http://127.0.0.1:5000/financialEntry?entry_type_id='+entryTypeId;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.financialEntries.forEach(item => insertFinancialEntryTableContent(item.id,item.description,item.recurrent_desc,item.start_date,item.finish_date,item.value,
                                                                             item.value_type_name,item.credit_card_number,item.name,item.recurrent,item.financial_entry_category_id,item.value_type_id))
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}