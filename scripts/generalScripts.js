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
  resetTableContent('financialEntryTable')
  document.getElementById('financialEntryTypeId').value = 1
  cleanFinancialEntryForm()  
  findFinancialEntryList(1)
  document.getElementById('financialEntrySectionTitle').innerHTML = 'RECEITAS'
  document.getElementById('financialEntryTable').rows[0].cells[7].hidden = true
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de despesas, ele já chama o processo de busca de despesas no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToExpenses = function(){
  hideAllSections() 
  resetTableContent('financialEntryTable')
  document.getElementById('financialEntryTypeId').value = 2
  cleanFinancialEntryForm()  
  findFinancialEntryList(2)
  document.getElementById('financialEntrySectionTitle').innerHTML = 'DESPESAS'
  document.getElementById('financialEntryTable').rows[0].cells[7].hidden = false
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de reservas, ele já chama o processo de busca de reservas no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialEntrySectionToReserve = function(){
  hideAllSections() 
  resetTableContent('financialEntryTable')
  document.getElementById('financialEntryTypeId').value = 3
  cleanFinancialEntryForm()  
  findFinancialEntryList(3)
  document.getElementById('financialEntrySectionTitle').innerHTML = 'RESERVAS'
  document.getElementById('financialEntryTable').rows[0].cells[7].hidden = true
  document.getElementById('financialEntrySection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de controles mensais, ele já chama o processo de busca de controles mensais no back-end
--------------------------------------------------------------------------------------
*/
const showFinancialControlSection = function(){
  hideAllSections()
  resetTableContent('financialControlSummaryTable')
  resetTableContent('financialEntryRevenueTable')
  resetTableContent('financialEntryExpensesTable')
  resetTableContent('financialEntryReservesTable')
  cleanFinancialControlForm(true)
  document.getElementById('financialControlSectionTitle').innerHTML = 'CONTROLE MENSAL'
  document.getElementById('financialControlSection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para exibir o menu de cartoes de credito, ele já chama o processo de busca de controles mensais no back-end
--------------------------------------------------------------------------------------
*/
const showCreditCardSection = function(){
  hideAllSections()
  resetTableContent('creditCardTable')
  findCreditCardListToTable()
  cleanCreditCardForm()
  document.getElementById('creditCardSectionTitle').innerHTML = 'CARTÃO DE CRÉDITO'
  document.getElementById('creditCardSection').setAttribute('style','display: flex;')
}


/*
--------------------------------------------------------------------------------------
Função para resetar o conteudo de uma table
--------------------------------------------------------------------------------------
*/
const resetTableContent = function(tableName){

  let tableElement = document.getElementById(tableName)
  if (tableElement && tableElement != undefined) {
    while (tableElement.rows.length > 1){
      tableElement.deleteRow(tableElement.rows.length - 1)
    }
  }

}


const formatDateFromServer = function(dateString){
  if (!isUndefined(dateString)) {
    dateParts = dateString.split('-')
    if (!isUndefined(dateParts) && dateParts.length == 3) {
      return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0]      
    }
  }
  return dateString
}


/*
--------------------------------------------------------------------------------------
Função para popular dados de uma movimentação financeira
--------------------------------------------------------------------------------------
*/

const insertFinancialEntryTableContent = function(id, description, recurrentDesc, startDate, finishDate, value, 
                                                  valueType, creditCard, name, recurrent, categoryId, typeValueId, entryTypeId){

      let tableElement = document.getElementById('financialEntryTable')
      let line = tableElement.insertRow(tableElement.rows.length)
      line.setAttribute('onclick','populateFinancialEntryForm(this)')

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
      let celStartDateNotFormated = line.insertCell(12)
      let celFinishDateNotFormated = line.insertCell(13)
      let celDelete = line.insertCell(14)

      celId.innerHTML = id
      celDescription.innerHTML = description
      celRecurrentDesc.innerHTML = recurrentDesc
      celStartDate.innerHTML = formatDateFromServer(startDate)
      celFinishDate.innerHTML = formatDateFromServer(finishDate)
      celValue.innerHTML = value
      celValueType.innerHTML = valueType
      celCreditCard.innerHTML = creditCard
      celCreditCard.hidden = (entryTypeId != 2)
      celName.innerHTML = name
      celName.hidden = true
      celRecurrent.innerHTML = recurrent
      celRecurrent.hidden = true
      celCategoryId.innerHTML = categoryId
      celCategoryId.hidden = true
      celTypeValueId.innerHTML = typeValueId
      celTypeValueId.hidden = true
      celStartDateNotFormated.innerHTML = startDate
      celStartDateNotFormated.hidden = true
      celFinishDateNotFormated.innerHTML = finishDate      
      celFinishDateNotFormated.hidden = true
      celDelete.innerHTML = '<img src="img/lixeira-de-reciclagem.png" width="15px" height="15px" onClick="deleteFinancialEntry({id},{name},{entryTypeId})">'.replace('{id}',id).replace('{name}',`'`+name+`'`).replace('{entryTypeId}',entryTypeId)
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
    .then((response) => { 
      if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data) {
        data.financialEntries.forEach(item => insertFinancialEntryTableContent(item.id,item.description,item.recurrent_desc,item.start_date,item.finish_date,item.value,
                                                                               item.value_type_name,item.credit_card_number,item.name,item.recurrent,item.financial_entry_category_id,item.value_type_id,entryTypeId))
      }
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
const cleanOptionsOfSelect = function(elementId,addDummyOption){
  let selectElement = document.getElementById(elementId)
  if (selectElement && selectElement != undefined){
    let selectOptions = selectElement.options
    if (selectOptions && selectOptions != undefined){
      while (selectOptions.length > 0){
        selectElement.removeChild(selectOptions[selectOptions.length - 1])
      }
      if (addDummyOption === true) {
        insertOptionsOfSelect(elementId,undefined,'Selecione uma Opção',true)
      }
    }
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para incluir lista de opções
  --------------------------------------------------------------------------------------
*/
const insertOptionsOfSelect = function(elementId,value,displayValue,dummy){
  let selectElement = document.getElementById(elementId)
  if (selectElement && selectElement != undefined){
    let option = document.createElement('option')
    option.text = displayValue
    option.value = value
    if (dummy === true) {
      option.disabled = true
      option.selected = true
    }
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
    .then((response) => { 
      if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data) {
        data.financialEntryCategories.forEach(item => insertOptionsOfSelect('financialEntryCategory',item.id,item.name,false))
      }      
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
  cleanOptionsOfSelect('financialEntryCategory',false)
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
    .then((response) => { 
      if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data) {
        data.creditCards.forEach(item => insertOptionsOfSelect('financialEntryCreditCardNumber',item.number,item.description,false))
      }
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
  cleanOptionsOfSelect('financialEntryCreditCardNumber',true)
  findCreditCardList()
}


/*
  --------------------------------------------------------------------------------------
  Função para uma nova movimentação financeira na base de dados
  --------------------------------------------------------------------------------------
*/
const postFinancialEntry = async (entryTypeId,financialEntryCategoryId,nameValue,startDate,finishDate,recurrentValue,valueP,creditCardNumber,valueTypeId) => {
  const bodyContent = {};
  if (!isUndefined(creditCardNumber)) {
    bodyContent.credit_card_number = parseInt(creditCardNumber)
  }
  if (!isUndefined(entryTypeId)) {
    bodyContent.entry_type_id = parseInt(entryTypeId)
  }
  if (!isUndefined(financialEntryCategoryId)) {
    bodyContent.financial_entry_category_id = parseInt(financialEntryCategoryId)
  }
  if (!isUndefined(finishDate)) {
    bodyContent.finish_date = finishDate
  }
  if (!isUndefined(nameValue)) {
    bodyContent.name = nameValue
  }
  if (!isUndefined(recurrentValue) || recurrentValue == 0) {
    bodyContent.recurrent = parseInt(recurrentValue)
  }
  if (!isUndefined(startDate)) {
    bodyContent.start_date = startDate
  }
  if (!isUndefined(valueP)) {
    bodyContent.value = parseFloat(valueP)
  }
  if (!isUndefined(valueTypeId)) {
    bodyContent.value_type_id = parseInt(valueTypeId)
  }   

  let url = 'http://127.0.0.1:5000/financialEntry';
  
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(bodyContent),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
        if (response.ok || (response.status == 400)) {
            return [response.status,response.json()]
        } else {
            throw new Error(response.statusText)
        } })
    .then((data) => {
      if (data[0]==200) {
        data[1].then(jsonObject => {
          insertFinancialEntryTableContent(jsonObject.id,jsonObject.description,jsonObject.recurrent_desc,jsonObject.start_date,jsonObject.finish_date,jsonObject.value,jsonObject.value_type_name,jsonObject.credit_card_number,jsonObject.name,jsonObject.recurrent,jsonObject.financial_entry_category_id,jsonObject.value_type_id,jsonObject.entry_type_id)
          cleanFinancialEntryForm()
        })
      } else {
        data[1].then(jsonObject => {showErrorMessage(jsonObject.message)})
      }
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
  document.getElementById('financialEntryId').value = ''
  document.getElementById('financialEntryName').value = ''
  document.getElementById('financialEntryStartDate').value = ''
  document.getElementById('financialEntryFinishDate').value = ''
  document.getElementById('financialEntryValue').value = ''
  document.getElementById('financialEntryRecurrent').checked = false
  document.getElementById('divFinancialEntryCreditCard').hidden = true
  cleanOptionsOfSelect('financialEntryCreditCardNumber',true)  
  refreshFinancialEntryCategorySelectionField(entryTypeId)
  if (entryTypeId == 2) {
    document.getElementById('divFinancialEntryCreditCard').hidden = false
    refreshFinancialEntryCreditCardField()
  }

  document.getElementById('financialEntryName').setAttribute('valueChanged','false')
  document.getElementById('financialEntryCreditCardNumber').setAttribute('valueChanged','false')
  document.getElementById('financialEntryRecurrent').setAttribute('valueChanged','false')
  document.getElementById('financialEntryStartDate').setAttribute('valueChanged','false')
  document.getElementById('financialEntryFinishDate').setAttribute('valueChanged','false')
  document.getElementById('financialEntryValue').setAttribute('valueChanged','false')
  document.getElementById('financialEntryValueType').setAttribute('valueChanged','false')
  
  document.getElementById('addFinancialEntryButton').setAttribute('style','display: flex;')
  document.getElementById('changeFinancialEntryButton').setAttribute('style','display: none;')
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
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar os dados da tabela e inserir no formulario
  --------------------------------------------------------------------------------------
*/
const populateFinancialEntryForm = function(tableRow){
    if (tableRow) {
      let id = tableRow.cells[0].textContent
      let startDate = tableRow.cells[12].textContent
      let finishDate = tableRow.cells[13].textContent
      let value = tableRow.cells[5].textContent
      let creditCardNumber = tableRow.cells[7].textContent
      let name = tableRow.cells[8].textContent
      let recurrentId = tableRow.cells[9].textContent
      let categoryId = tableRow.cells[10].textContent
      let typeVelueId = tableRow.cells[11].textContent
      let entryTypeId = document.getElementById('financialEntryTypeId').value

      document.getElementById('financialEntryId').value = id
      document.getElementById('financialEntryCategory').value = categoryId
      document.getElementById('financialEntryName').value = name
      if (entryTypeId==2) {
        document.getElementById('financialEntryCreditCardNumber').value = creditCardNumber
      }
      document.getElementById('financialEntryRecurrent').checked = (recurrentId == '1')
      document.getElementById('financialEntryStartDate').value = startDate
      document.getElementById('financialEntryFinishDate').value = finishDate
      document.getElementById('financialEntryValue').value = value
      document.getElementById('financialEntryValueType').value = typeVelueId

      document.getElementById('financialEntryName').setAttribute('valueChanged','false')
      document.getElementById('financialEntryCreditCardNumber').setAttribute('valueChanged','false')
      document.getElementById('financialEntryRecurrent').setAttribute('valueChanged','false')
      document.getElementById('financialEntryStartDate').setAttribute('valueChanged','false')
      document.getElementById('financialEntryFinishDate').setAttribute('valueChanged','false')
      document.getElementById('financialEntryValue').setAttribute('valueChanged','false')
      document.getElementById('financialEntryValueType').setAttribute('valueChanged','false')
      
      document.getElementById('addFinancialEntryButton').setAttribute('style','display: none;')
      document.getElementById('changeFinancialEntryButton').setAttribute('style','display: flex;')
      
    }
}


/*
  --------------------------------------------------------------------------------------
  Função para uma atualizar movimentação financeira na base de dados
  --------------------------------------------------------------------------------------
*/
const patchFinancialEntry = async (entryTypeId,financialEntryCategoryId,nameValue,startDate,finishDate,recurrentValue,valueP,creditCardNumber,valueTypeId,id) => {
  const bodyContent = {};
  bodyContent.id = id
  if (!isUndefined(creditCardNumber)) {
    bodyContent.credit_card_number = parseInt(creditCardNumber)
  }
  if (!isUndefined(entryTypeId)) {
    bodyContent.entry_type_id = parseInt(entryTypeId)
  }
  if (!isUndefined(financialEntryCategoryId)) {
    bodyContent.financial_entry_category_id = parseInt(financialEntryCategoryId)
  }
  if (!isUndefined(finishDate)) {
    bodyContent.finish_date = finishDate
  }
  if (!isUndefined(nameValue)) {
    bodyContent.name = nameValue
  }
  if (!isUndefined(recurrentValue) || recurrentValue == 0) {
    bodyContent.recurrent = parseInt(recurrentValue)
  }
  if (!isUndefined(startDate)) {
    bodyContent.start_date = startDate
  }
  if (!isUndefined(valueP)) {
    bodyContent.value = parseFloat(valueP)
  }
  if (!isUndefined(valueTypeId)) {
    bodyContent.value_type_id = parseInt(valueTypeId)
  }   

  let url = 'http://127.0.0.1:5000/financialEntry';
  
  fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(bodyContent),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
      if (response.ok || (response.status == 400)) {
          return [response.status,response.json()]
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data[0]==200) {
        data[1].then(jsonObject => {
          if (jsonObject.entry_type_id == 1) {
            showFinancialEntrySectionToRevenue()
          } else if (jsonObject.entry_type_id == 2) {
            showFinancialEntrySectionToExpenses()
          } else {
            showFinancialEntrySectionToReserve()
          }
        })
      } else {
        data[1].then(jsonObject => {showErrorMessage(jsonObject.message)})
      }
    })                
    .catch((error) => {
      showErrorMessage(error)
    });
}

const setCustomProperty = function(elementId,propertyName,changedValue){
  let element = document.getElementById(elementId)
  element.setAttribute(propertyName,changedValue)
}

/*
  --------------------------------------------------------------------------------------
  Função para validar os dados do formulario de movimentação financeira para atualizacao
  --------------------------------------------------------------------------------------
*/
const preValidateFinancialEntryFormDataToUpdate = function(id,entryTypeId,financialEntryCategoryId,name,startDate,finishDate,value,recurrent,creditCardNumber,valueTypeId){
  if (isUndefined(id)) {
    return '<entryTypeId> não definido'
  }
  if (isUndefined(entryTypeId)) {
    return '<entryTypeId> não definido'
  }
  if (isUndefined(financialEntryCategoryId)&&isUndefined(name)&&isUndefined(finishDate)&&isUndefined(startDate)&&isUndefined(value)&&
  isUndefined(recurrent)&&isUndefined(creditCardNumber)&&isUndefined(valueTypeId)) {
    return 'Nenhuma alteração realizada para ser submetida !!'
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar dados do formulario e inserir uma nova movimentação financeira na base de dados
  --------------------------------------------------------------------------------------
*/
const updateFinancialEntry = function(){
  let id = document.getElementById('financialEntryId').value
  let entryTypeId = document.getElementById('financialEntryTypeId').value

  let name = undefined
  if (document.getElementById('financialEntryName').getAttribute('valueChanged') == 'true') {
    name = document.getElementById('financialEntryName').value
  }
  let startDate = undefined
  if (document.getElementById('financialEntryStartDate').getAttribute('valueChanged') == 'true') {
    startDate = document.getElementById('financialEntryStartDate').value
  }
  let finishDate
  if (document.getElementById('financialEntryFinishDate').getAttribute('valueChanged') == 'true') {
    finishDate = document.getElementById('financialEntryFinishDate').value
  }
  let value
  if (document.getElementById('financialEntryValue').getAttribute('valueChanged') == 'true') {
    value = document.getElementById('financialEntryValue').value
  }
  let recurrent
  if (document.getElementById('financialEntryRecurrent').getAttribute('valueChanged') == 'true') {
    recurrent = document.getElementById('financialEntryRecurrent').checked ? 1 : 0
  }
  let financialEntryCategoryId
  if (document.getElementById('financialEntryCategory').getAttribute('valueChanged') == 'true') {
    financialEntryCategoryId = getSelectedOptionValueOfSelectElement('financialEntryCategory')
  }
  let creditCardNumber
  if (document.getElementById('financialEntryCreditCardNumber').getAttribute('valueChanged') == 'true') {
    creditCardNumber = (entryTypeId == 2) ? getSelectedOptionValueOfSelectElement('financialEntryCreditCardNumber') : undefined
  }
  let valueTypeId
  if (document.getElementById('financialEntryValueType').getAttribute('valueChanged') == 'true') {
    valueTypeId = getSelectedOptionValueOfSelectElement('financialEntryValueType')
  }  
  
  let errorMessage = preValidateFinancialEntryFormDataToUpdate(id,entryTypeId,financialEntryCategoryId,name,startDate,finishDate,value,recurrent,creditCardNumber,valueTypeId)

  if (!isUndefined(errorMessage)) {
    showErrorMessage(errorMessage)
  } else {
    patchFinancialEntry(entryTypeId,financialEntryCategoryId,name,startDate,finishDate,recurrent,value,creditCardNumber,valueTypeId,id)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteFinancialEntryInServer = (givenId,entryTypeId) => {
  let url = 'http://127.0.0.1:5000/financialEntry';
  fetch(url, {
    method: 'DELETE',
    body: JSON.stringify({"id":givenId}),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
      if (response.ok || (response.status == 400)) {
          return [response.status,response.json()]
      } else {
          throw new Error(response.statusText)
      } })  
    .then((data) => {
      if (data[0]==200) {
        if (entryTypeId == 1) {
          showFinancialEntrySectionToRevenue()
        } else if (entryTypeId == 2) {
          showFinancialEntrySectionToExpenses()
        } else {
          showFinancialEntrySectionToReserve()
        }
      } else {
        data[1].then(jsonObject => {showErrorMessage(jsonObject.message)})
      }
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
--------------------------------------------------------------------------------------
Função para excluir dados de uma movimentação financeira
--------------------------------------------------------------------------------------
*/

const deleteFinancialEntry = function(id,name,entryTypeId){
  if (isUndefined(id)) {
    showErrorMessage('Identificador não selecionado para excluir !!')
  }

  if (confirm('Tem certeza que deseja excluir a movimentação com nome de [{0}]'.replace('{0}',name))){
    deleteFinancialEntryInServer(id,entryTypeId)
  }
}



/*
--------------------------------------------------------------------------------------
Função para popular dados de uma movimentação financeira
--------------------------------------------------------------------------------------
*/

const insertCreditCardTableContent = function(number, description, month, year, id, idFlag, name){

    let tableElement = document.getElementById('creditCardTable')
    let line = tableElement.insertRow(tableElement.rows.length)
    line.setAttribute('onclick','populateCreditCardForm(this)')

    let celNumber = line.insertCell(0)
    let celDescription = line.insertCell(1)
    let celMonth = line.insertCell(2)
    let celYear = line.insertCell(3)
    let celId = line.insertCell(4)
    let celIdFlag = line.insertCell(5)
    let celName =  line.insertCell(6)
    let celDelete = line.insertCell(7)

    celNumber.innerHTML = number
    celDescription.innerHTML = description
    celMonth.innerHTML = month
    celYear.innerHTML = year
    celId.innerHTML = id
    celId.hidden = true
    celIdFlag.innerHTML = idFlag
    celIdFlag.hidden = true
    celName.innerHTML = name
    celName.hidden = true
    celDelete.innerHTML = '<img src="img/lixeira-de-reciclagem.png" width="15px" height="15px" onClick="deleteCreditCard({number},{description})">'.replace('{number}',number).replace('{description}',`'`+description+`'`)
}

/*
--------------------------------------------------------------------------------------
Função para obter a lista de movimentacoes financeiras do servidor
--------------------------------------------------------------------------------------
*/
const findCreditCardListToTable = async () => {
    let url = 'http://127.0.0.1:5000/creditCard';
    fetch(url, {
      method: 'get',
    })
      .then((response) => { 
          if (response.ok) {
            if (response.status && response.status != 204){
              return response.json()
            }
          } else {
            throw new Error(response.statusText)
          } })
      .then((data) => {
          if (data) {
            data.creditCards.forEach(item => insertCreditCardTableContent(item.number,item.description,item.valid_month_date,item.valid_year_date,item.id,item.credit_card_flag_id,item.name))
            }})
      .catch((error) => {
          showErrorMessage(error)
      });
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de categorias de movimentação do servidor
  --------------------------------------------------------------------------------------
*/
const findCreditCardFlagList = async () => {
  let url = 'http://127.0.0.1:5000/creditCardFlag';
  fetch(url, {
    method: 'get',
  })
    .then((response) => { 
      if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data) {
        data.creditCardFlags.forEach(item => insertOptionsOfSelect('creditCardFlag',item.id,item.name,false))
      }      
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para preencher o campo de opções de bandeiras de cartão
  --------------------------------------------------------------------------------------
*/
const refreshCreditCardFlagsSelectionField = function(){
  cleanOptionsOfSelect('creditCardFlag',false)
  findCreditCardFlagList()
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar dados do formulario de cartão de crédito
  --------------------------------------------------------------------------------------
*/
const cleanCreditCardForm = function(){
  refreshCreditCardFlagsSelectionField()

  document.getElementById('creditCardId').value = ''
  document.getElementById('creditCardName').value = ''
  document.getElementById('creditCardCreditCardNumber').value = ''
  document.getElementById('creditCardMonth').value = ''
  document.getElementById('creditCardYear').value = ''
  document.getElementById('addCreditCardButton').setAttribute('style','display: flex;')
  document.getElementById('changeCreditCardButton').setAttribute('style','display: none;')
  document.getElementById('creditCardCreditCardNumber').removeAttribute('readonly')

  document.getElementById('creditCardName').setAttribute('valueChanged','false')
  document.getElementById('creditCardCreditCardNumber').setAttribute('valueChanged','false')
  document.getElementById('creditCardMonth').setAttribute('valueChanged','false')
  document.getElementById('creditCardYear').setAttribute('valueChanged','false')
}


/*
  --------------------------------------------------------------------------------------
  Função para um novo cartão de Credito na base de dados
  --------------------------------------------------------------------------------------
*/
const postCreditCard = async (number, month, year, idFlag, name) => {
  const bodyContent = {};
  if (!isUndefined(number)) {
    bodyContent.number = parseInt(number)
  }
  if (!isUndefined(month)) {
    bodyContent.valid_month_date = parseInt(month)
  }
  if (!isUndefined(year)) {
    bodyContent.valid_year_date = parseInt(year)
  }
  if (!isUndefined(idFlag)) {
    bodyContent.credit_card_flag_id = parseInt(idFlag)
  }
  if (!isUndefined(name)) {
    bodyContent.name = name
  }   

  let url = 'http://127.0.0.1:5000/creditCard';
  
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(bodyContent),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
        if (response.ok || (response.status == 400)) {
            return [response.status,response.json()]
        } else {
            throw new Error(response.statusText)
        } })
    .then((data) => {
      if (data[0]==200) {
        data[1].then(jsonObject => {
          insertCreditCardTableContent(jsonObject.number,jsonObject.description,jsonObject.valid_month_date,jsonObject.valid_year_date,jsonObject.id,jsonObject.credit_card_flag_id,jsonObject.name)
          cleanCreditCardForm()
        })
      } else {
        data[1].then(jsonObject => {showErrorMessage(jsonObject.message)})
      }
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para validar os dados do formulario de cartão de crédito
  --------------------------------------------------------------------------------------
*/
const preValidateCreditCardFormData = function(number, month, year, idFlag, name){
  if (isUndefined(idFlag)) {
    return 'Bandeira de cartão não selecionada !!!'
  }
  if (isUndefined(name) || name == '') {
    return 'Por favor, dê um nome para este cartão !!!'
  }
  if (isUndefined(month) || month == '') {
    return 'Por favor, insira o mês de vencimento deste cartão !!!'
  }
  if (isUndefined(year) || year == '') {
    return 'Por favor, insira o ano de vencimento deste cartão !!!'
  }
  if (isUndefined(number) || number == '') {
    return 'Por favor, insira o número deste cartão !!!'
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar dados do formulario e inserir um novo cartão de crédito na base de dados
  --------------------------------------------------------------------------------------
*/
const insertCreditCard = function(){

  let creditCardFlagId = getSelectedOptionValueOfSelectElement('creditCardFlag')
  let name = document.getElementById('creditCardName').value
  let number = document.getElementById('creditCardCreditCardNumber').value
  let month = document.getElementById('creditCardMonth').value
  let year = document.getElementById('creditCardYear').value

  let errorMessage = preValidateCreditCardFormData(number,month,year,creditCardFlagId,name)

  if (!isUndefined(errorMessage)) {
    showErrorMessage(errorMessage)
  } else {
    postCreditCard(number,month,year,creditCardFlagId,name)
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar os dados da tabela e inserir no formulario
  --------------------------------------------------------------------------------------
*/
const populateCreditCardForm = function(tableRow){
    if (tableRow) {
      let number = tableRow.cells[0].textContent
      let name = tableRow.cells[6].textContent
      let month = tableRow.cells[2].textContent
      let year = tableRow.cells[3].textContent
      let creditCardFlagId = tableRow.cells[5].textContent
      let id = tableRow.cells[4].textContent

      document.getElementById('creditCardId').value = id
      document.getElementById('creditCardFlag').value = creditCardFlagId
      document.getElementById('creditCardName').value = name
      document.getElementById('creditCardCreditCardNumber').value = number
      document.getElementById('creditCardMonth').value = month
      document.getElementById('creditCardYear').value = year

      document.getElementById('creditCardName').setAttribute('valueChanged','false')
      document.getElementById('creditCardCreditCardNumber').setAttribute('valueChanged','false')
      document.getElementById('creditCardMonth').setAttribute('valueChanged','false')
      document.getElementById('creditCardYear').setAttribute('valueChanged','false')      
      
      document.getElementById('addCreditCardButton').setAttribute('style','display: none;')
      document.getElementById('changeCreditCardButton').setAttribute('style','display: flex;')
      document.getElementById('creditCardCreditCardNumber').setAttribute('readonly','true')
      
    }
}


/*
  --------------------------------------------------------------------------------------
  Função para uma atualizar cartão de crédito na base de dados
  --------------------------------------------------------------------------------------
*/
const patchCreditCard = async (number, month, year, idFlag, name) => {
  const bodyContent = {};
  if (!isUndefined(number)) {
    bodyContent.number = parseInt(number)
  }
  if (!isUndefined(month)) {
    bodyContent.valid_month_date = parseInt(month)
  }
  if (!isUndefined(year)) {
    bodyContent.valid_year_date = parseInt(year)
  }
  if (!isUndefined(idFlag)) {
    bodyContent.credit_card_flag_id = idFlag
  }
  if (!isUndefined(name)) {
    bodyContent.name = name
  }

  let url = 'http://127.0.0.1:5000/creditCard';
  
  fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(bodyContent),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
      if (response.ok || (response.status == 400)) {
          return [response.status,response.json()]
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data[0]==200) {
        showCreditCardSection()
      } else {
        data[1].then(jsonObject => {showErrorMessage(jsonObject.message)})
      }
    })                
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para validar os dados do formulario de cartao de credito para atualizacao
  --------------------------------------------------------------------------------------
*/
const preValidateCreditCardFormDataToUpdate = function(number, month, year, idFlag, name){
  if (isUndefined(number)) {
    return 'Número do cartão de crédito é obrigatório.'
  }  
  if (isUndefined(month)&&isUndefined(year)&&isUndefined(idFlag)&&isUndefined(name)) {
    return 'Nenhuma alteração realizada para ser submetida !!'
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para atualizar dados do cartão de cŕedito na base de dados
  --------------------------------------------------------------------------------------
*/
const updateCreditCard = function(){

  number = document.getElementById('creditCardCreditCardNumber').value
  let name = undefined  
  if (document.getElementById('creditCardName').getAttribute('valueChanged') == 'true') {
    name = document.getElementById('creditCardName').value
  }
  let creditCardFlag = undefined
  if (document.getElementById('creditCardFlag').getAttribute('valueChanged') == 'true') {
    creditCardFlag = document.getElementById('creditCardFlag').value
  }  
  let month = undefined
  if (document.getElementById('creditCardMonth').getAttribute('valueChanged') == 'true') {
    month = document.getElementById('creditCardMonth').value
  }
  let year
  if (document.getElementById('creditCardYear').getAttribute('valueChanged') == 'true') {
    year = document.getElementById('creditCardYear').value
  }
  
  let errorMessage = preValidateCreditCardFormDataToUpdate(number,month,year,creditCardFlag,name)

  if (!isUndefined(errorMessage)) {
    showErrorMessage(errorMessage)
  } else {
    patchCreditCard(number,month,year,creditCardFlag,name)
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um cartao de credito
  --------------------------------------------------------------------------------------
*/
const deleteCreditCardInServer = (givenNumber) => {
  let url = 'http://127.0.0.1:5000/creditCard';
  fetch(url, {
    method: 'DELETE',
    body: JSON.stringify({"number":givenNumber}),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
      if (response.ok || (response.status == 400)) {
          return [response.status,response.json()]
      } else {
          throw new Error(response.statusText)
      } })  
    .then((data) => {
      if (data[0]==200) {
        showCreditCardSection()
      } else {
        data[1].then(jsonObject => {showErrorMessage(jsonObject.message)})
      }
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
--------------------------------------------------------------------------------------
Função para excluir cartão de crédito
--------------------------------------------------------------------------------------
*/

const deleteCreditCard = function(number,description){
  if (isUndefined(number)) {
    showErrorMessage('Número do cartão não selecionado para excluir !!')
  }

  if (confirm('Tem certeza que deseja excluir o cartão {0}'.replace('{0}',description))){
    deleteCreditCardInServer(number)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de controles mensais criados
  --------------------------------------------------------------------------------------
*/
const findFinancialControlList = async () => {
  let url = 'http://127.0.0.1:5000/financialControl';
  fetch(url, {
    method: 'get',
  })
    .then((response) => { 
      if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data) {
        data.financialControls.forEach(item => insertOptionsOfSelect('financialControlList',item.month+'/'+item.year,item.description,false))
      }      
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para preencher o campo de opções de controles mensais
  --------------------------------------------------------------------------------------
*/
const refreshFinancialControlList = function(){
  cleanOptionsOfSelect('financialControlList',true)
  findFinancialControlList()
}


/*
  --------------------------------------------------------------------------------------
  Função para limpar dados do formulario de controles mensais
  --------------------------------------------------------------------------------------
*/
const cleanFinancialControlForm = function(doRefreshInFinancialControlList){
  if (doRefreshInFinancialControlList === true) {
    refreshFinancialControlList()
  }  

  document.getElementById('financialControlMonth').removeAttribute('readonly')
  document.getElementById('financialControlMonth').value = ''
  document.getElementById('financialControlYear').removeAttribute('readonly')
  document.getElementById('financialControlYear').value = ''
  document.getElementById('financialControlEntryValue').value = ''
  document.getElementById('financialControlEntryValue').removeAttribute('readonly')
  document.getElementById('financialControlEntryValueGroup').setAttribute('style','display: none;')
  document.getElementById('financialControlEntryId').value = ''

  document.getElementById('financialControlMonth').setAttribute('valueChanged','false')
  document.getElementById('financialControlYear').setAttribute('valueChanged','false')
  document.getElementById('financialControlEntryValue').setAttribute('valueChanged','false')

  document.getElementById('buildFinancialControlButton').setAttribute('style','display: flex;')
  document.getElementById('changeFinancialEntryValueButton').setAttribute('style','display: none;')

}



/*
--------------------------------------------------------------------------------------
Função para popular dados das movimentações financeiras de um controle mensal
--------------------------------------------------------------------------------------
*/

const insertFinancialControlEntryTableContent = function(id, description, recurrentDesc, entryDate, value, 
  valueType, creditCard, name, recurrent, categoryId, typeValueId, entryTypeId, month, year){

    let tableId = undefined
    if (entryTypeId == 1) {
      tableId = 'financialEntryRevenueTable'
    } else if (entryTypeId == 2) {
      tableId = 'financialEntryExpensesTable'
    } else {
      tableId = 'financialEntryReservesTable'
    }


    let tableElement = document.getElementById(tableId)
    let line = tableElement.insertRow(tableElement.rows.length)
    line.setAttribute('onclick','populateFinancialControlForm(this)')

    let celId = line.insertCell(0)
    let celDescription = line.insertCell(1)
    let celRecurrentDesc = line.insertCell(2)
    let celEntryDate = line.insertCell(3)
    let celValue = line.insertCell(4)
    let celValueType =  line.insertCell(5)
    let celCreditCard =  line.insertCell(6)
    let celName =  line.insertCell(7)
    let celRecurrent =  line.insertCell(8)
    let celCategoryId =  line.insertCell(9)
    let celTypeValueId =  line.insertCell(10)
    let celMonth =  line.insertCell(11)
    let celYear =  line.insertCell(12)

    celId.innerHTML = id
    celDescription.innerHTML = description
    celRecurrentDesc.innerHTML = recurrentDesc
    celEntryDate.innerHTML = formatDateFromServer(entryDate)
    celValue.innerHTML = value
    celValueType.innerHTML = valueType
    celCreditCard.innerHTML = creditCard
    celCreditCard.hidden = (entryTypeId != 2)
    celName.innerHTML = name
    celName.hidden = true
    celRecurrent.innerHTML = recurrent
    celRecurrent.hidden = true
    celCategoryId.innerHTML = categoryId
    celCategoryId.hidden = true
    celTypeValueId.innerHTML = typeValueId
    celTypeValueId.hidden = true
    celMonth.innerHTML = month
    celMonth.hidden = true
    celYear.innerHTML = year
    celYear.hidden = true
}


/*
--------------------------------------------------------------------------------------
Função para obter a lista de movimentacoes financeiras do servidor
--------------------------------------------------------------------------------------
*/
const findFinancialControlEntryesToTable = async (month,year) => {
  let url = 'http://127.0.0.1:5000/financialControl/?month={MONTH}&year={YEAR}'.replace('{MONTH}',month).replace('{YEAR}',year);
  fetch(url, {
    method: 'get',
  })
    .then((response) => { 
        if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
        } else {
          throw new Error(response.statusText)
        } })
    .then((data) => {
        if (data) {
          data.financialControlEntries.forEach(item => {
            if (item.financialEntry) {
              insertFinancialControlEntryTableContent(item.financialEntry.id,
                                                      item.financialEntry.description,
                                                      item.financialEntry.recurrent_desc,
                                                      item.entryDate,
                                                      item.value,
                                                      item.financialEntry.value_type_name,
                                                      item.financialEntry.credit_card_number,
                                                      item.financialEntry.name,
                                                      item.financialEntry.recurrent,
                                                      item.financialEntry.financial_entry_category_id,
                                                      item.financialEntry.value_type_id,
                                                      item.financialEntry.entry_type_id,
                                                      item.month,
                                                      item.year)
            }
           })
          }})
    .catch((error) => {
        showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar os dados da tabela e inserir no formulario
  --------------------------------------------------------------------------------------
*/
const populateFinancialControlForm = function(tableRow){
  if (tableRow) {
    let month = tableRow.cells[11].textContent
    let year = tableRow.cells[12].textContent
    let entryValue = tableRow.cells[4].textContent
    let id = tableRow.cells[0].textContent
    let valueTypeId = tableRow.cells[10].textContent

    document.getElementById('financialControlMonth').setAttribute('readonly','true')
    document.getElementById('financialControlMonth').value = month
    document.getElementById('financialControlYear').setAttribute('readonly','true')
    document.getElementById('financialControlYear').value = year
    document.getElementById('financialControlEntryValue').value = entryValue
    document.getElementById('financialControlEntryValueGroup').setAttribute('style','display: block;')
    document.getElementById('financialControlEntryId').value = id

    document.getElementById('financialControlMonth').setAttribute('valueChanged','false')
    document.getElementById('financialControlYear').setAttribute('valueChanged','false')
    document.getElementById('financialControlEntryValue').setAttribute('valueChanged','false')    

    if (valueTypeId == 1) {
      document.getElementById('financialControlEntryValue').setAttribute('readonly','true')
    } else {
      document.getElementById('financialControlEntryValue').removeAttribute('readonly')
    }
  
    document.getElementById('buildFinancialControlButton').setAttribute('style','display: none;')
    document.getElementById('changeFinancialEntryValueButton').setAttribute('style','display: flex;')    
  }
}


/*
--------------------------------------------------------------------------------------
Função para popular dados do resumo do Controle Mensal
--------------------------------------------------------------------------------------
*/

const insertFinancialControlSummaryTableContent = function(revenueAmount,expensesAmount,reservesAmount,difference){

    let tableElement = document.getElementById('financialControlSummaryTable')
    let line = tableElement.insertRow(tableElement.rows.length)

    let celRevenueAmount = line.insertCell(0)
    let celReservesAmount = line.insertCell(1)
    let celExpensesAmount = line.insertCell(2)
    let celResultAmount = line.insertCell(3)

    celRevenueAmount.innerHTML = revenueAmount
    celReservesAmount.innerHTML = reservesAmount
    celExpensesAmount.innerHTML = expensesAmount
    celResultAmount.innerHTML = difference
}

/*
--------------------------------------------------------------------------------------
Função para obter o resumo do controle financeiro mensal
--------------------------------------------------------------------------------------
*/
const findFinancialControlSummaryToTable = async (month,year) => {
  let url = 'http://127.0.0.1:5000/financialControl/summary/?month={MONTH}&year={YEAR}'.replace('{MONTH}',month).replace('{YEAR}',year);
  fetch(url, {
    method: 'get',
  })
    .then((response) => { 
        if (response.ok) {
          if (response.status && response.status != 204){
            return response.json()
          }
        } else {
          throw new Error(response.statusText)
        } })
    .then((data) => {
        if (data) {
          insertFinancialControlSummaryTableContent(data.revenueAmout,data.expensesAmout,data.reservesAmount,data.difference)
          }})
    .catch((error) => {
        showErrorMessage(error)
    });
}


const findFinancialControlAllEntries = function() {
  let optionSelected = getSelectedOptionValueOfSelectElement('financialControlList')
  if (!isUndefined(optionSelected)) {
    let monthYearData = optionSelected.split('/')
    if (!isUndefined(monthYearData) && monthYearData.length == 2) {
      let month = monthYearData[0]
      let year = monthYearData[1]
      resetTableContent('financialControlSummaryTable')
      resetTableContent('financialEntryRevenueTable')
      resetTableContent('financialEntryExpensesTable')
      resetTableContent('financialEntryReservesTable')
      cleanFinancialControlForm(false)
      findFinancialControlEntryesToTable(month,year)
      findFinancialControlSummaryToTable(month,year)
    }
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para uma atualizar cartão de crédito na base de dados
  --------------------------------------------------------------------------------------
*/
const patchFinancialControlEntry = async (monthValue,yearValue,entryIdValue,formValue) => {
  const bodyContent = {}
  bodyContent.month = monthValue
  bodyContent.year = yearValue
  bodyContent.financialEntryId = entryIdValue
  bodyContent.value = formValue

  let url = 'http://127.0.0.1:5000/financialControl';
  
  fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(bodyContent),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => { 
      if (response.ok) {
          return undefined
      } else if (response.status == 400) {
          return response.json()
      } else {
          throw new Error(response.statusText)
      } })
    .then((data) => {
      if (data) {
        showErrorMessage(data.message)
      } else {
        cleanFinancialControlForm(false)
        findFinancialControlAllEntries()
      }
    })                
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para validar os dados do formulario de controle mensal para atualizacao
  --------------------------------------------------------------------------------------
*/
const preValidateFinancialControlFormDataToUpdate = function(monthValue,yearValue,entryIdValue,formValue){
  if (isUndefined(monthValue)) {
    return 'Mês é obrigatório.'
  }  
  if (isUndefined(yearValue)) {
    return 'Ano é obrigatório.'
  }  
  if (isUndefined(entryIdValue)) {
    return 'Identificador da movimentação é obrigatório.'
  }  
  if (isUndefined(formValue)) {
    return 'Nenhuma alteração realizada para ser submetida !!'
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para atualizar dados do cartão de cŕedito na base de dados
  --------------------------------------------------------------------------------------
*/
const updateFinancialControlEntry = function(){

  month = document.getElementById('financialControlMonth').value
  year = document.getElementById('financialControlYear').value
  entryId = document.getElementById('financialControlEntryId').value
  let entryValue = undefined  
  if (document.getElementById('financialControlEntryValue').getAttribute('valueChanged') == 'true') {
    entryValue = document.getElementById('financialControlEntryValue').value
  }
  
  let errorMessage = preValidateFinancialControlFormDataToUpdate(month,year,entryId,entryValue)

  if (!isUndefined(errorMessage)) {
    showErrorMessage(errorMessage)
  } else {
    patchFinancialControlEntry(month,year,entryId,entryValue)
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para gerar um novo controle mensal na base de dados
  --------------------------------------------------------------------------------------
*/
const postBuildFinancialControl = async (monthForm, yearForm) => {
  const bodyContent = {}
  bodyContent.month = monthForm
  bodyContent.year = yearForm

  let url = 'http://127.0.0.1:5000/financialControl';
  
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(bodyContent),
    headers: {"Content-type": "application/json"}
  })
    .then((response) => {
        if (response.ok) {
            return undefined
        } else if (response.status == 400) {
            return response.json()
        } else {
            throw new Error(response.statusText)
        } })
    .then((data) => {
      if (data) {
        showErrorMessage(data.message)
      } else {
        showFinancialControlSection()
      }
    })
    .catch((error) => {
      showErrorMessage(error)
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para validar os dados do formulario de cartão de crédito
  --------------------------------------------------------------------------------------
*/
const preValidateFinacialControlFormData = function(month,year){
  if (isUndefined(month) || month == '') {
    return 'Mês deve ser informado !!!'
  }
  if (isUndefined(year) || year == '') {
    return 'Ano deve ser informado !!!'
  }
}


/*
  --------------------------------------------------------------------------------------
  Função para buscar dados do formulario e gerar um novo controle mensal n base de dados
  --------------------------------------------------------------------------------------
*/
const submitBuildFinancialControl = function(){

  let month = document.getElementById('financialControlMonth').value
  let year = document.getElementById('financialControlYear').value

  let errorMessage = preValidateFinacialControlFormData(month,year)

  if (!isUndefined(errorMessage)) {
    showErrorMessage(errorMessage)
  } else {
    postBuildFinancialControl(month,year)
  }
}