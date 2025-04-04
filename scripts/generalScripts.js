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
  window.scrollTo(0,0)
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
  resetFinancialEntryTableContent('financialEntryTable')
  findFinancialEntryList(1)
  refreshFinancialEntryCategorySelectionField(1)
  document.getElementById('divFinancialEntryCreditCard').hidden = true
  cleanOptionsOfSelect('financialEntryCreditCardNumber')
  document.getElementById('financialEntryTypeId').value = 1
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de despesas, ele já chama o processo de busca de despesas no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToExpenses = function(){
  hideAllSections()  
  resetFinancialEntryTableContent('financialEntryTable')
  findFinancialEntryList(2)
  refreshFinancialEntryCategorySelectionField(2)
  document.getElementById('divFinancialEntryCreditCard').hidden = false
  refreshFinancialEntryCreditCardField()
  document.getElementById('financialEntryTypeId').value = 2
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de reservas, ele já chama o processo de busca de reservas no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToReserve = function(){
  hideAllSections()
  resetFinancialEntryTableContent('financialEntryTable')
  findFinancialEntryList(3)
  refreshFinancialEntryCategorySelectionField(3)
  document.getElementById('divFinancialEntryCreditCard').hidden = true
  cleanOptionsOfSelect('financialEntryCreditCardNumber')
  document.getElementById('financialEntryTypeId').value = 3
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


/*
  --------------------------------------------------------------------------------------
  Função para resetar lista de opções
  --------------------------------------------------------------------------------------
*/
const cleanOptionsOfSelect = function(elementId){
  let selectElement = document.getElementById(elementId)
  if (selectElement && selectElement != undefined){
    let selectOptions = selectElement.options
    if (selectOptions && selectOptions != undefined){
      while (selectOptions.length > 0){
        selectElement.removeChild(selectOptions[selectOptions.length - 1])
      }
    }
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para incluir lista de opções
  --------------------------------------------------------------------------------------
*/
const insertOptionsOfSelect = function(elementId,value,displayValue){
  let selectElement = document.getElementById(elementId)
  if (selectElement && selectElement != undefined){
    let option = document.createElement('option')
    option.text = displayValue
    option.value = value
    selectElement.add(option)
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de categorias de movimentação do servidor
  --------------------------------------------------------------------------------------
*/
const findFinancialCategoryList = async (entryTypeId) => {
  let url = 'http://127.0.0.1:5000/financialControlCategory/?entry_type_id='+entryTypeId;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.financialEntryCategories.forEach(item => insertOptionsOfSelect('financialEntryCategory',item.id,item.name))
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para preencher o campo de categoriasd e movimentacao
  --------------------------------------------------------------------------------------
*/
const refreshFinancialEntryCategorySelectionField = function(entryTypeId){
  cleanOptionsOfSelect('financialEntryCategory')
  findFinancialCategoryList(entryTypeId)
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de cartoes de credito do servidor
  --------------------------------------------------------------------------------------
*/
const findCreditCardList = async () => {
  let url = 'http://127.0.0.1:5000/creditCard';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.creditCards.forEach(item => insertOptionsOfSelect('financialEntryCreditCardNumber',item.number,item.description))
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para preencher o campo de cartoes de credito
  --------------------------------------------------------------------------------------
*/
const refreshFinancialEntryCreditCardField = function(){
  cleanOptionsOfSelect('financialEntryCreditCardNumber')
  findCreditCardList()
}


/*
  --------------------------------------------------------------------------------------
  Função para uma nova movimentação financeira na base de dados
  --------------------------------------------------------------------------------------
*/
const postFinancialEntry = async (entryTypeId,financialEntryCategoryId,name,startDate,finishDate,recurrent,value,creditCardNumber,valueTypeId) => {
  const formData = new FormData();
  formData.append('credit_card_number', creditCardNumber);
  formData.append('entry_type_id', entryTypeId);
  formData.append('financial_entry_category_id', financialEntryCategoryId);
  formData.append('finish_date', "'"+finishDate+"'");
  formData.append('name', "'"+name+"'");
  formData.append('recurrent', recurrent);
  formData.append('start_date', "'"+startDate+"'");
  formData.append('value', value);
  formData.append('value_type_id', valueTypeId);    

  let url = 'http://127.0.0.1:5000/financialEntry';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      insertFinancialEntryTableContent(data.id,data.description,data.recurrent_desc,data.start_date,data.finish_date,data.value,data.value_type_name,data.credit_card_number,data.name,data.recurrent,data.financial_entry_category_id,data.value_type_id)
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


const getSelectedOptionValueOfSelectElement = function(elementId){
  let selectElement = document.getElementById(elementId)
  if (selectElement && selectElement != undefined){
    let selectOptions = selectElement.options
    if (selectOptions && selectOptions != undefined){
      let indexToSearch = selectOptions.selectedIndex
      if (indexToSearch >= 0) {
        return selectOptions[indexToSearch].value
      }
    }
  }
  return undefined
}


const isUndefined = function(value){
  return !value || value == undefined
}


/*
  --------------------------------------------------------------------------------------
  Função para validar os dados do formulario de movimentação financeira
  --------------------------------------------------------------------------------------
*/
const preValidateFinancialEntryFormData = function(entryTypeId,financialEntryCategoryId,name,startDate){
  if (isUndefined(entryTypeId)) {
    return '<entryTypeId> não definido'
  }
  if (isUndefined(financialEntryCategoryId)) {
    return 'Categoria Financeira não preenchida !!'
  }
  if (isUndefined(name) || name == '') {
    return 'Por favor, dê um nome para esta movimentação !!!'
  }
  if (isUndefined(startDate) || startDate == '') {
    return 'Por favor, insira uma data de inicio da movimentação !!!'
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar dados do formulario de movimentação financeira
  --------------------------------------------------------------------------------------
*/
const cleanFinancialEntryForm = function(){
  let entryTypeId = document.getElementById('financialEntryTypeId').value
  document.getElementById('financialEntryName').value = ''
  document.getElementById('financialEntryStartDate').value = ''
  document.getElementById('financialEntryFinishDate').value = ''
  document.getElementById('financialEntryValue').value = ''
  document.getElementById('financialEntryRecurrent').checked = false
  refreshFinancialEntryCategorySelectionField(entryTypeId)
  if (entryTypeId == 2) {
    document.getElementById('divFinancialEntryCreditCard').hidden = false
    refreshFinancialEntryCreditCardField()
  } else {
    document.getElementById('divFinancialEntryCreditCard').hidden = true
    cleanOptionsOfSelect('financialEntryCreditCardNumber')    
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar dados do formulario e inserir uma nova movimentação financeira na base de dados
  --------------------------------------------------------------------------------------
*/
const insertFinancialEntry = function(){
  let entryTypeId = document.getElementById('financialEntryTypeId').value
  let name = document.getElementById('financialEntryName').value
  let startDate = document.getElementById('financialEntryStartDate').value
  let finishDate = document.getElementById('financialEntryFinishDate').value
  let value = document.getElementById('financialEntryValue').value
  let recurrent = document.getElementById('financialEntryRecurrent').checked ? 1 : 0
  let financialEntryCategoryId = getSelectedOptionValueOfSelectElement('financialEntryCategory')
  let creditCardNumber = (entryTypeId == 2) ? getSelectedOptionValueOfSelectElement('financialEntryCreditCardNumber') : undefined
  let valueTypeId = getSelectedOptionValueOfSelectElement('financialEntryValueType')

  let errorMessage = preValidateFinancialEntryFormData(entryTypeId,financialEntryCategoryId,name,startDate)

  if (!isUndefined(errorMessage)) {
    showErrorMessage(errorMessage)
  } else {
    postFinancialEntry(entryTypeId,financialEntryCategoryId,name,startDate,finishDate,recurrent,value,creditCardNumber,valueTypeId)
    cleanFinancialEntryForm()
  }
}
