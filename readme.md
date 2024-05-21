# 3rd Deployment Final Task 

## Basic Web Server FS persistence

## Install
```bash
npm install
```
## Usage
### build
```bash
npm run build 
```
### dev Mode
```bash
npm run dev
```
### run production 
```bash
npm start
```

## Architecture

The server has been implemented using hexagonal layer architecture, theare is a folder products that holds diferent files that provide functionality by abstraction between the diferent layers of the server. 
The service provides a class that manage the FS.DAO class and gives access to the actual data. 
The controller is responsable of handeling the user requests and provide the adecuate responses 
The routes layer singly links the routes to the controller 


## Objectives 

## Backend de una aplicación ecommerce
Desde el router de /api/users, crear tres rutas:
GET  /  deberá obtener todos los usuarios, éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol)

DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad

Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce

## Backend de una aplicación ecommerce

Modificar el endpoint que elimina productos, para que, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado.

Finalizar las vistas pendientes para la realización de flujo completo de compra. NO ES NECESARIO tener una estructura específica de vistas, sólo las que tú consideres necesarias para poder llevar a cabo el proceso de compra.

No es necesario desarrollar vistas para módulos que no influyan en el proceso de compra (Como vistas de usuarios premium para crear productos, o vistas de panel de admin para updates de productos, etc)


Realizar el despliegue de tu aplicativo en la plataforma de tu elección (Preferentemente Railway.app, pues es la abarcada en el curso) y corroborar que se puede llevar a cabo un proceso de compra completo.

## Views
The views are implemented in handdlebars. And some css was added to the public directory as well as the basic js for the client to work and they are minimalistic because the focus is in the backend implementation

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
### Auth Routes
* POST /auth/login authenticates using local login and establishes a JWT token in the browser
* POST /auth/register creates a new user and authenticates using local login and establishes a JWT token in the browser
* GET /auth/login shows the login view 
* GET /auth/github used to establish a github login
* GET /auth/cb Callback used by github login 
* GET /auth/register shows the signup view 
* GET /auth/profile shows the profile view
* GET /auth/logout clears JWT token from the browser and redirects to login
### Cart Routes

* POST /api/carts/ Creates a New Empty Cart
* POST /api/carts/:cid/product/:pid Adds a product to the cid cart
* POST /api/carts/:cid/purchase Generates a new ticket with currents user cart 
* GET /api/carts/:cid/ Shows items added for CID 
* DELETE /api/carts/:cid/products/:pid Deletes PID product from CID cart 
* DELETE /api/carts/:cid/products/ Deletes all products in CID cart 
* PUT /api/carts/:cid/products/:pid Updates Quantity od PID product Item 
* PUT /api/carts/:cid Updates Products in CID cart 

### MAILING
* POST /mail/ sends a mail body params 
```typescript 
 {to:string,  subject:string, content:string}
 ```

### PRODUCTS
* GET /api/products Shows a list of products
* GET /api/products/:id Gets a single product using param for id 
* POST /api/product/ Creates a new Product 
* PUT /api/product Updates a single product ID paresed with a Partial<Product>
* DELETE /api/product/:id Deletes a single product by id

### Tickets
* GET /api/tickets/ Gets a list of  Tickets

### Users
* GET /api/users/ Gets a list of users
* DELETE /api/users/ Deletes every user with more than 30 days since last connection and emails them 
* DELETE /api/users/:id/delete Deletes user by ID 
* PUT /api/users/:id/premium Toggles between  PREMIUM Role and the USER role  for the user by ID 
* PUT /api/users/:id/admin Toggles between  ADMIN Role and the USER role  for the user by ID  
* POST /api/users/:id/updaterol Updates the role for user by ID requires body argument 
  ```typescript 
  {rol:string} 
  ```
* GET /api/users/updaterol Shows the view to update user roles or delete user only admin role users can do so 


## Browser Routes
* GET /addProducts Basic Web Form that adds a new Product to the database
* GET /realTimeProducts Shows realtime Database product to all connected users. 
* GET /chat Shows Chat view 
* GET /logued Shows Logued user view
* GET /mockingProducts   Shows mocked products 
* GET /loggerTest Shows view for logger tests
* GET /cart Shows current cart products 

## VIEWS 
* addProduct creates a new product
* cart shows current cart products
* chat Chat screen 
* index Shows current product index only admin 
* login Shows login form 
* profile Shows actual user profile
* purchase Shows the ticket for the purchase 
* realtime Shows products in realtime ussing sockets 
* register Shows Signup form 
* userupdate Shows user Update form