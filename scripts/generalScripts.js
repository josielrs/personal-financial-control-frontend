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


/*
--------------------------------------------------------------------------------------
Função para formatar a data do servidor ano, mes e dia em dia, mes e ano
--------------------------------------------------------------------------------------
*/
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
  Função para resetar lista de opções de um campo select
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
  Função para incluir lista de opções em um campo select
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
Função para retornar o value da opção selecionada do campo select
--------------------------------------------------------------------------------------
*/
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


/*
--------------------------------------------------------------------------------------
Função que retorna se um campo é nulo ou undefined
--------------------------------------------------------------------------------------
*/
const isUndefined = function(value){
  return !value || value == undefined
}



/*
--------------------------------------------------------------------------------------
Função para configurar uma propriedade personalizada no elemento
--------------------------------------------------------------------------------------
*/
const setCustomProperty = function(elementId,propertyName,changedValue){
  let element = document.getElementById(elementId)
  element.setAttribute(propertyName,changedValue)
}