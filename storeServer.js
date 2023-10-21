var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, , authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});

var port =  process.env.PORT || 2410

let {storeData, categories, carts, users, orders} = require("./data")

console.log(carts.length +1)



app.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    const user = users.find((c) => c.email === email && c.password === password);
    console.log(user);
    if (user === undefined) {
      res.status(500).send("Invalid Credentials")
    }
    else {
      const userRec = {
        name: user.name,
        email: user.email,
        role: user.role
      }
      res.send(userRec)
    }
  })

app.get("/products/:id", function(req,res){
    let id = +req.params.id
    let filteredData = storeData.find((f) => f.id === id)
    res.send(filteredData)
})
app.get("/productsCat/:category", function(req,res){
    let category = req.params.category
    let filteredData = storeData
    if(category){
        filteredData = storeData.filter((f) => f.category === category)
    }     
    res.send(filteredData)
})
app.get("/products", function (req, res) {
  const nameQuery = req.query.q;
  let filteredData = storeData;

  if (nameQuery) {
      filteredData = storeData.filter((product) =>
          product.name.toLowerCase().startsWith(nameQuery.toLowerCase())
      );
  }

  res.send(filteredData);
});


app.post("/products", function(req,res){
  let body = req.body;
  let senddata = {
    id : storeData.length + 1,
    ...body
  }
  storeData.push(senddata)
  res.send(senddata)
})

app.put("/products/:id", function(req,res)
{
  let id = +req.params.id;
  const product = req.body;
  let index = storeData.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    storeData[index] = product;
    res.send(product);
  } else res.send("not found");


})

app.delete("/products/:id", function (req, res) {
  let id = +req.params.id;
  let index = storeData.findIndex((obj1) => obj1.id === id);
  if (index >= 0) {
    let product = storeData.splice(index, 1);
    res.send(product);
  } else res.send("not found");
});


app.get("/getCategories", function(req,res){
        
    res.send(categories)
})

app.get("/getCarts", function(req,res){
    res.send(carts)
})

app.post("/addToCarts", function(req,res){
    let body = req.body;

    let json = {
        id : carts.length + 1,
        quantity : 1,
        ...body
    }
    carts.push(json)
    res.send(json)
})

app.delete("/deleteToCarts/:id", function(req,res){
    let id = +req.params.id
    let product = carts.findIndex((c) => c.productId === id);
     carts.splice(product, 1);
     res.send("Items Deleted")
    
    
})

// app.put("/updateQuantity/:id", function(req,res){
//     let body = req.body
//     let id = +req.params.id
//     console.log(id)
//     console.log(body)
//     let index = carts.findIndex((c) => c.id === id )
//    if(index >=0)
//    {
//      let cartProduct = carts[index]
//      if(cartProduct.quantity === 1 && body.quantity === -1)
//      {
//         carts.splice(index, 1)
//      }
//     carts[index] = {...cartProduct , quantity :  cartProduct.quantity + body.quantity}
//     res.send("Quantity Updated")
//    }
// } )
app.put("/updateQuantity/:id", function(req,res){
    let body = req.body
    let id = +req.params.id
    const cartItem = carts.find((item) => item.id === id);
    if (cartItem) {
      cartItem.quantity = (cartItem.quantity || 0) + body.quantity;
      if (cartItem.quantity <= 0) {
        carts.splice(carts.indexOf(cartItem), 1);
    }
    res.send("quantity Updated")
    }
} )

app.get("/orders", function(req,res){
    res.send(orders)
})

app.post("/orders", function(req,res){
    let body = req.body;
    orders.push(body);
    carts.length = 0
    res.send("added Successfully");
})



app.listen(port, () => console.log(`Node app listening on port ${port}!`));


