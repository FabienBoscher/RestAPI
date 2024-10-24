//CONFIGURATION DE MES VARIABLES
const express = require('express')
const mysql = require('mysql')
const app = express()
const expres_port = 3000


//PERMET DE COMUNIQUER EN JSON
app.use(express.json())




//DATABASES:

//PARAMETRES DE LA DB REST_API
const dataBase = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root',
  database: 'rest_api'
})


//PARAMETRES DE LA DB REST_API2
const dataBase2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root',
  database: 'rest_api2',
})


//MESSAGES:

//MESSAGES DE CONNECTION A LA DB1
dataBase.connect((err) => {
  if (err) {
    console.log('ERREUR DE LA CONNEXTION A LA DATABASE 1 !', err)
  } else {
    console.log('BRAVO, TU ES CONNECTÉ A LA DATABASE 1')
  }
})


//MESSAGES DE CONNECTION A LA DB2
dataBase2.connect((err) => {
  if (err) {
    console.log('ERREUR DE LA CONNEXTION A LA DATABASE 2 !', err)
  } else {
    console.log('BRAVO, TU ES CONNECTÉ A LA DATABASE 2')
  }
})


//MESSAGE DE PRECISION DU PORT
app.listen(expres_port, () => {
  console.log('LE SERVEUR TOURNE :', expres_port)
})





//LIRE:

//PERMET DE LIRE UN ELEMENT DE LA DATABASE 1 
app.get('/db1/get', (req, res) => {
  const { name, price, id, description } = req.query
  let sql = 'SELECT * FROM items WHERE 1=1'
  let queryParams = []
  if (name) {
    sql += ' AND name = ?'
    queryParams.push(name)
  }
  if (price) {
    sql += ' AND price = ?'
    queryParams.push(price)
  }
  if (id) {
    sql += ' AND id = ?'
    queryParams.push(id)
  }
  if (description) {
    sql += ' AND description = ?'
    queryParams.push(description)
  }

  dataBase.query(sql, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      return res.status(200).json(results)
    }
  })
})


//PERMET DE LIRE UN ELEMENT DE LA DATABASE 2 
app.get('/db2/get', (req, res) => {
  const { name, price, id, description } = req.query
  let sql = 'SELECT * FROM items WHERE 1=1'
  let queryParams = []
  if (name) {
    sql += ' AND name = ?'
    queryParams.push(name)
  }
  if (price) {
    sql += ' AND price = ?'
    queryParams.push(price)
  }
  if (id) {
    sql += ' AND id = ?'
    queryParams.push(id)
  }
  if (description) {
    sql += ' AND description = ?'
    queryParams.push(description)
  }

  dataBase2.query(sql, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ERREUR DU SERVEUR' })
    } else {
      return res.status(200).json(results)
    }
  })
})


//PERMET DE LIRE TOUS LES ELEMENTS D'UNE CATEGORIE DANS LA DATABASE 2
app.get('/db2/get2/:id', (req, res) => {
  const id = req.params.id
  const sql = `
    SELECT items.id, items.name, items.price, items.description
    FROM items
    JOIN items_category ON items.id = items_category.items_id
    WHERE items_category.category_id = ?`
 
  dataBase2.query(sql, [id], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Erreur du serveur lors de la récupération des items.  ' + err })
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun élément trouvé pour cette catégorie.  ' + err })
    } else {
      return res.status(200).json(results)
    }
  })
})
 



//MODIFIER:

//PERMET D'AJOUTER UN ELEMENT A LA DATABASE 1
app.post('/db1/post', (req, res) => {
  const { name, price, description, category_id} = req.body 
  const sql = 'INSERT INTO items (name, price, description, category_id) VALUES (?,?,?,?)'
  dataBase.query(sql, [name, price, description, category_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error : 'ERREUR DU SERVEUR'})
    }
    else {  
      return res.status(201).json(results)
    }
  }) 
})


//PERMET D'AJOUTER UN ELEMENT A LA DATABASE 2
app.post('/db2/post', (req, res) => {

  const { name, price, description, category_id } = req.body
  const sqlInsertItem = 'INSERT INTO items (name, price, description) VALUES (?, ?, ?)'

    dataBase2.query(sqlInsertItem, [name, price, description], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'ERREUR DU SERVEUR DANS ITEMS' })
    }

    const items_id = results.insertId
    const sql_item = 'INSERT INTO items_category (items_id, category_id) VALUES (?, ?)'
    
    dataBase2.query(sql_item, [items_id, category_id], (err, results) => {
      if (err) {
        return res.status(500).json(err)
      }
      return res.status(201).json('success' + results)
    })
  })
})



//SUPPRIMER:

//PERMET DE SUPPRIMER UN ELEMENT DE LA DATABASE 1
app.delete('/db1/delete', (req, res) => {
  const { name, price, id, description } = req.body
  let sql = 'DELETE FROM items WHERE 1=1'
  let queryParams = []

  if (name) {
    sql += ' AND name = ?'
    queryParams.push(name)
  }
  if (price) {
    sql += ' AND price = ?'
    queryParams.push(price)
  }
  if (id) {
    sql += ' AND id = ?'
    queryParams.push(id)
  }
  if (description) {
    sql += ' AND description = ?'
    queryParams.push(description)
  }
  if (queryParams.length === 0) {
    return res.status(400).json({ error: 'Aucun critère fourni pour la suppression' })
  }

  dataBase.query(sql, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur du serveur' })
    } else {
      return res.status(200).json({ message: 'Élément supprimé avec succès', results})
    }
  })
})


//PERMET DE SUPPRIMER UN ELEMENT DE LA DATABASE 2
// app.delete('/db2/delete', (req, res) => {
//   const { name, price, id, description } = req.body
//   let sql = 'DELETE FROM items WHERE 1=1'
//   let queryParams = []

//   if (name) {
//     sql += ' AND name = ?'
//     queryParams.push(name)
//   }
//   if (price) {
//     sql += ' AND price = ?'
//     queryParams.push(price)
//   }
//   if (id) {
//     sql += ' AND id = ?'
//     queryParams.push(id)
//   }
//   if (description) {
//     sql += ' AND description = ?'
//     queryParams.push(description)
//   }
//   if (queryParams.length === 0) {
//     return res.status(400).json({ error: 'Aucun critère fourni pour la suppression' })
//   }

//   const sqlDeleteItemCategory = 'DELETE FROM items_category WHERE items_id = ?'
  
//   const sql_find_items_id = 'SELECT id FROM items WHERE 1=1'
//   let findItemParams = [...queryParams]

//   dataBase2.query( sql_find_items_id, findItemParams, (err, results) => {
//     if (err || results.length === 0) {
//       return res.status(500).json({ error: 'Erreur lors de la recherche de l\'élément à supprimer' })
//     }

//     const itemId = results[0].id

//     // Suppression dans items_category
//     dataBase2.query(sqlDeleteItemCategory, [items_id], (err, result) => {
//       if (err) {
//         console.error('Erreur lors de la suppression dans items_category:', err)
//         return res.status(500).json({ error: 'Erreur lors de la suppression dans items_category' })
//       }

//       // Étape 2: Suppression dans items
//       dataBase2.query(sqlDeleteItem, queryParams, (err, results) => {
//         if (err) {
//           console.error('Erreur lors de la suppression dans items:', err)
//           return res.status(500).json({ error: 'Erreur lors de la suppression dans items' })
//         }

//         return res.status(200).json({ message: 'Élément et ses associations supprimés avec succès', results })
//       })
//     })
//   })
// })



//MODIFIER:

//PERMET DE MODIFIER UN ELEMENT DE LA DATABASE 1
app.put('/db1/put/:id', (req, res) => {
  const id = req.params.id
  const { name, price, category_id, description } = req.body
  const sql = 'UPDATE items SET name = ?, price = ?, category_id = ?, description = ? WHERE id = ?'
  const values = [name, price, category_id, description, id]
 
  dataBase.query(sql, values, (err, result) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'ERREUR DU SERVEUR NULL' })
    } else {
      return res.status(200).json(result)
    }
  })
})