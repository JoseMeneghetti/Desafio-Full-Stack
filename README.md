# Full-Stack-ORM

## Tecnologias back-end

- JAVA 17.
- Spring 3.
- lombok.
- Spring Docs 2.

## Database

- Postgres.

## Front-end

- React 18.
- TS.
- Vite Starter.
- Tailwind CSS.
- Tanstack tables.
- React Router.
- HeadlessUi.


## Rodando o Projeto


Na Raiz: 

Adicione o arquivo `.env`:

`DB_NAME=`
`DB_USER=`
`DB_PASS= `

Na pasta `react-app` : 

Adicione o arquivo `.env.local`

`VITE_APP_DOMAIN=http://localhost:8080/`

## Usando o `Docker`.

- va para a pasta `/api-server` e rode o comando `./mvnw clean package` para buildar o back-end, em seguida volte para raiz do projeto onde esta o arquivo `docker-compose.yml` e digite o comando `docker-compose up` para subir todas tecnologias juntas.

## Doc APIs:

http://localhost:8080/swagger-ui/index.html#/
