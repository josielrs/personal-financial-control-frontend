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
Função para popular dados de uma movimentação financeira na tabela 
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
  let url = SERVER_ENDPOINT+'/financialEntry?entry_type_id='+entryTypeId;
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
  Função para obter a lista de categorias de movimentação do servidor
  --------------------------------------------------------------------------------------
*/
const findFinancialCategoryList = async (entryTypeId) => {
  let url = SERVER_ENDPOINT+'/financialControlCategory/?entry_type_id='+entryTypeId;
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
  let url = SERVER_ENDPOINT+'/creditCard';
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

  let url = SERVER_ENDPOINT+'/financialEntry';
  
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

  document.getElementById('financialEntryValueType').removeAttribute('disabled');
  document.getElementById('financialEntryRecurrent').removeAttribute('disabled');
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

      document.getElementById('financialEntryValueType').setAttribute('disabled','true');
      document.getElementById('financialEntryRecurrent').setAttribute('disabled','true');
      
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

  let url = SERVER_ENDPOINT+'/financialEntry';
  
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
  let financialEntryCategoryId
  if (document.getElementById('financialEntryCategory').getAttribute('valueChanged') == 'true') {
    financialEntryCategoryId = getSelectedOptionValueOfSelectElement('financialEntryCategory')
  }
  let creditCardNumber
  if (document.getElementById('financialEntryCreditCardNumber').getAttribute('valueChanged') == 'true') {
    creditCardNumber = (entryTypeId == 2) ? getSelectedOptionValueOfSelectElement('financialEntryCreditCardNumber') : undefined
  }
  let valueTypeId
  
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
  let url = SERVER_ENDPOINT+'/financialEntry';
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