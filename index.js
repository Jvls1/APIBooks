var express = require('express')
var app = express()
var bodyParser = require('body-parser')

var database = require('./database')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/books', (req, res) => {
    database.select().table('livros').then(data =>{
        res.statusCode = 200
        res.json({books: data})
    }).catch(e => {
        console.log(e)
        res.statusCode = 404
    })
})

app.get('/book/:id', (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        let id = parseInt(req.params.id)

        database.select().where({id: id}).table('livros').then(data => {
            if(data != ''){
                res.statusCode = 200
                res.json(data)
            }else{
                res.sendStatus(400)
            }
        }).catch(e => {
            console.log(e)
        })
    }
})

app.post('/book', (req, res) => {
    //lembrar de usar o body parser json e unlercoded para dar certo
    let {name, author, gender} = req.body
    let book = {
        name,
        author,
        gender
    }
    //validações pra não entrar qualquer tranqueira no banco
    if(book.name != "") {
        database.insert(book).into('livros').then(data => {
            res.sendStatus(200)
        }).catch(e => {
            console.log(e)
            res.sendStatus(400)
        })
    }else {
        res.sendStatus(400)
    }
})

app.delete('/book/:id', (req, res) => {
    //validações
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        let id = parseInt(req.params.id)
        //funcionando validações
        database.select().where({id: id}).table('livros').then(data => {
            console.log(data)
            if(data != ''){
                database.where({id: id}).delete().table('livros').then(() => {
                    res.sendStatus(200)
                }).catch(e => {
                    console.log(e)
                    res.sendStatus(400)
                })
            }else{
                res.sendStatus(404)
            }
        }).catch(e => {
            console.log(e)
        })
    }
})

app.put('/book/:id', (req, res) => {
        let id = parseInt(req.params.id)

        let {name, author, gender} = req.body
        //validações
        database.select().where({id: id}).table('livros').then(data => {
            if(data != ''){
                if(name != '' && name != undefined){
                    database.where({id: id}).update({name: name}).table('livros').then(data => {
                        console.log(data)
                    }).catch(e => {
                        console.log(e)
                        res.sendStatus(400)
                    })
                }
                if(author != '' && author != undefined){
                    database.where({id: id}).update({author: author}).table('livros').then(data => {
                        console.log(data)
                    }).catch(e => {
                        console.log(e)
                        res.sendStatus(400)
                    })
                }
                if(gender != '' && gender != undefined){
                    database.where({id: id}).update({gender: gender}).table('livros').then(data => {
                        console.log(data)
                    }).catch(e => {
                        console.log(e)
                        res.sendStatus(400)
                    })
                }
                res.sendStatus(200)
            }else{
                res.sendStatus(404)
            }
        })      
})

app.listen(7894, () => {
    console.log('api running!')
})