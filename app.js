const express = require('express')
const app = express()
const port = 3000
app.get('/students', (req, res) => {
    const students = [
    { name: 'Omar Souidi', school: 'EPF'},
    { name: 'Potter Harry', school: 'Hogwarts'},
    { name : 'Karim Benzema', school: 'OL'}
    ];
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
