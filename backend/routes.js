const express = require('express')
const routes = express.Router()

routes.get('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)

        conn.query('SELECT * FROM leccion', (err, rows)=>{
            if(err) return res.send(err)

            res.json(rows)
        })
    })
})

routes.post('/', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        // console.log(req.body) --para probar que responde en la request
        conn.query('INSERT INTO leccion set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)

            res.send('added')
        })
    })
})

routes.delete('/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('DELETE FROM leccion WHERE idleccion = ?', [req.params.id], (err, rows)=>{
            if(err) return res.send(err)

            res.send('excluded')
        })
    })
})

routes.put('/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('UPDATE leccion set ? WHERE idleccion = ?', [req.body, req.params.id], (err, rows)=>{
            if(err) return res.send(err)

            res.send('updated')
        })
    })
})


module.exports = routes