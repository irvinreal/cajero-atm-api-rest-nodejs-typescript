# API Rest 'Simulación de cajero ATM'

### Ejecución:
-npm install
-npm start

### Endpoints:

###### /auth/register
###### POST

http://localhost:3000/auth/register
Content-Type: application/json

Recibe: {
"name": "Nombre de ejemplo",                (requerido)
"password": "contraseñadeejemplo",          (requerido)
"amount": 2008.59                           (no requerido. 0 por defecto)
}

Devuelve: {
"name": "Nombre de ejemplo",
"amount": 2008.59
}


###### /auth/login
###### POST

http://localhost:3000/auth/login
Content-Type: application/json

Recibe: {
"name": "Nombre de ejemplo",                (requerido)
"password": "contraseñadeejemplo",          (requerido)
}

Devuelve: {
    "message": "Bievenido a tu cuenta.",
    "name": "irvin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaXJ2aW4iLCJ1c2VySWQiOiI2NzUwYzE5NTU0OGIwNWY2NzA2MGMwM2UiLCJhY2NvdW50SWQiOiI2NzUwYzE5NTU0OGIwNWY2NzA2MGMwM2YiLCJpYXQiOjE3MzMzNDU4MzEsImV4cCI6MTczMzY0NTgzMX0.ukkfZrtLdA1dl5sz5Z5LumJ7W8FtKPIb5X3scq1AnX8",
    "userId": "6750c195548b05f67060c03e"
}


###### /auth/my-account
###### GET

http://localhost:3000/auth/my-account
Authorization: Bearer ejemplo-token-dsflhjfedjkl97834inufd98hnsdf73hgd783

Devuelve: {
    "client": {
        "_id": "6750c195548b05f67060c03e",
        "name": "irvin"
    },
    "amount": 1000
}


###### /auth/my-account/deposit
###### PATCH

http://localhost:3000/auth/my-account/deposit
Authorization: Bearer ejemplo-token-dsflhjfedjkl97834inufd98hnsdf73hgd783
Content-Type: application/json

Recibe: {
"amount": 1250,                       (requerido)
}

Devuelve: {
    "client": {
        "_id": "6750c195548b05f67060c03e",
        "name": "irvin"
    },
    "amount": 2250                    (cantidad actualizada)
}


###### /auth/my-account/withdraw
###### PATCH

http://localhost:3000/auth/my-account/withdraw
Authorization: Bearer ejemplo-token-dsflhjfedjkl97834inufd98hnsdf73hgd783
Content-Type: application/json

Recibe: {
"amount": 250,                       (requerido)
}

Devuelve: {
    "client": {
        "_id": "6750c195548b05f67060c03e",
        "name": "irvin"
    },
    "amount": 2000                    (cantidad actualizada)
}


###### /auth/my-account/transfer
###### POST

http://localhost:3000/auth/my-account/transfer
Authorization: Bearer ejemplo-token-dsflhjfedjkl97834inufd98hnsdf73hgd783
Content-Type: application/json

Recibe: {
"amount": 250,                                                    (requerido)
"userToTransfer": id-ejemplo-dfg34gf34fg43,                       (requerido)
}

Devuelve: {
    "message": 'transferencia exitosa'
}