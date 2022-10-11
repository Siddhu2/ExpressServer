import Express from "express";
const app = Express()
import mysql from "mysql"
import bodyParser from 'body-parser'
import cors from 'cors'

const db = mysql.createPool({
    host: "localhost",
    user: "test",
    password: "",
    database: "billing"
})
app.use(cors())
app.use(Express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/get/billNumber',(req,res) =>{
    const sqlBillNumber = "SELECT bill_number from customer_bill where id=(select max(id) from customer_bill)";
    db.query(sqlBillNumber,(err,result) =>{
        res.send(result)
    })
})

app.get('/api/get/items',(req,res) =>{
    const getItems = "SELECT distinct(item_name) FROM customer_bill;"
    db.query(getItems,(err,result) =>{
        res.send(result)
    })
})

app.post("/api/insert",(req,res) =>{

    const itemList = req.body.itemList
    console.log(itemList)
     let newArray = []  
    //Converting array object into array to make PDF conversion easy
    for(let i=0;i<itemList.length;i++)
    {
      newArray.push([itemList[i].billNumber,itemList[i].date,itemList[i].customerName,itemList[i].iname,itemList[i].quantity,itemList[i].amount,itemList[i].total,itemList[i].totalPaid])
    }
    console.log("new array: "+newArray[0])
    const sqlInsert = "INSERT INTO `customer_bill`(`bill_number`,`bill_date`,`customer_name`,`item_name`,`quantity`,`amount`,`total`,`total_paid`)VALUES ?;"
    db.query(sqlInsert,[newArray],(err,result)=>{
        res.send("Hello!!! Data is inserted!")
        console.log(err)
    })
    
})

app.listen(3001, ()=>{
    console.log("Running in 3001!")
})