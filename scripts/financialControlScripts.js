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
Função para obter a lista de movimentacoes financeiras do servidor para um controle mensal
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


/*
--------------------------------------------------------------------------------------
Função para obter todas as movimentacoes de um controle mensal e preencher as tabelas da pagina
--------------------------------------------------------------------------------------
*/
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
  Função para uma atualizar uma movimentacao financeira de um controle mensal na base de dados
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
  Função para atualizar dados da movimentação financeira do controle mensal na base de dados
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
  Função para validar os dados do formulario de controle mensal
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