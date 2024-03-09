# Desafio 3 CoderHouse

## Basic Web Server FS persistence

## Install
```bash
npm install
```
## Usage

```bash
npm start
```
## Architecture

The server has been implemented using hexagonal layer architecture, theare is a folder products that holds diferent files that provide functionality by abstraction between the diferent layers of the server. 
The service provides a class that manage the FS.DAO class and gives access to the actual data. 
The controller is responsable of handeling the user requests and provide the adecuate responses 
The routes layer singly links the routes to the controller 
The products.json holds the data

## Views
The views are implemented in handdlebars. And some css was added to the public directory as well as the basic js for the client to work

## Chat 
This Feat adds chat functionality using socket io instanciation thought the route chat.
the messages are stored on a mongo atlas persistence server, using a basic crud  DAO service that extends the product routes and chat routes services as well.

## API Routes
* POST /api/carts/ Creates a new Cart body [{pid:string,quantity:number}]
* POST /api/carts/:cid/product/:pid?quantity=number Adds a new product to the specified cart 
* GET /api/carts/:cid Shows the products included on the specified cart
* GET /api/products Shows an array of the products included on the database
* GET /api/products/:id Returns the product for the specified id
* POST /api/product Add a new product to the database body:{ code, description, price, stock, thumbnail, title }
* PUT /api/product Update the product for the specified id provided through body:{ code, description, price, stock, thumbnail, title,id}
* DELETE /api/product/:id Deletes the product for the specified id

## Browser Routes
* GET /addProducts Basic Web Form that adds a new Product to the database
* GET /realTimeProducts Shows realtime Database product to all connected users. 
  
## FS DAO Service

To instanciate the class you must provide 2 arguments:
- 1 The path for the products.json file to be stored
- 2 The Type or interface that describes the Data to be stored

```typescript
import {ProductManager} from "path/to/class"
const productManager= new ProductManager<Product>("./path/")
```

## Methods
- 1 getProducts() Retrives the entire array of products from the file 
- 2 getProductById(id) You must pass a number as a id parameter to get the product matching the id 
- 3 updateProduct(id,product) You must pass a number id and a product wich is a Partial of the product type you provided
- 4 addProduct(product) You must provide a product type object, the id will be self instanciated by the class
- 5 deleteProduct(id) You must provide a integer id matching the product to be erased

## Pending Features.
1) Ill tye to implement validation via ZOD.io.
2) Ive some issues implementing the types for FS DAO and Mongoose DAO. 
3) Something is wrong on my singleton schema and causes the database to instanciate multiple connections
4) 