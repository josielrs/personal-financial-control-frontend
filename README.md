# Bem Vindo ao Controle Financeiro Pessoal!

Este projeto é um frontend de uma aplicação cujo propósito é auxiliar o usuário no controle de seus gastos mensais, registrando receitas, despesas e reservas num só lugar possibilitando ao usuário uma visão mais ampla de como sua vida financeira acontece, de onde vem as receitas, quanto elas são, e pra onde elas estão indo. Desta forma o usuário poderá tomar decisões mais estratégicas alinhadas com seus objetivos pessoais.


# Arquivos

Segue abaixo uma descrição resumida da estrutura do projeto

## img

Arquivos referente às imagens utilizadas nas paginas HTML

## templates

Arquivos HTML do projeto

# Como Executar


Será necessário ter todas as libs python listadas no `requirements.txt` instaladas.
Após clonar o repositório, é necessário ir ao diretório raiz, pelo terminal, para poder executar os comandos descritos abaixo.

> É fortemente indicado o uso de ambientes virtuais do tipo [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

```
(env)$ pip install -r requirements.txt
```

Este comando instala as dependências/bibliotecas, descritas no arquivo `requirements.txt`.

Para executar a API  basta executar:

```
(env)$ flask run --host 0.0.0.0 --port 5000
```

Em modo de desenvolvimento é recomendado executar utilizando o parâmetro reload, que reiniciará o servidor
automaticamente após uma mudança no código fonte. 

```
(env)$ flask run --host 0.0.0.0 --port 5000 --reload
```

Abra o [http://localhost:5000/#/](http://localhost:5000/#/) no navegador para verificar o status da API em execução.





<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzNjg4NTYwNDFdfQ==
-->
