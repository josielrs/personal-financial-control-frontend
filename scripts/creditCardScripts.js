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
Função para popular dados de cartao de credito na tabela da pagina
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
Função para obter a lista de cartões de crédito do servidor
--------------------------------------------------------------------------------------
*/
const findCreditCardListToTable = async () => {
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
            data.creditCards.forEach(item => insertCreditCardTableContent(item.number,item.description,item.valid_month_date,item.valid_year_date,item.id,item.credit_card_flag_id,item.name))
            }})
      .catch((error) => {
          showErrorMessage(error)
      });
}


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de bandeiras de cartao do servidor
  --------------------------------------------------------------------------------------
*/
const findCreditCardFlagList = async () => {
  let url = SERVER_ENDPOINT+'/creditCardFlag';
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

  let url = SERVER_ENDPOINT+'/creditCard';
  
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

  let url = SERVER_ENDPOINT+'/creditCard';
  
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
  let url = SERVER_ENDPOINT+'/creditCard';
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