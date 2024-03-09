const socket = io()
//    socket.on("post",(data) => {console.log(data)})
socket.on("post",(data) => {console.log(data)})
socket.on('newProduct', function(product) {
    const item=product.data    
    const cardTemplate=document.getElementById("productCardTemplate").content.cloneNode(true)   
    const cardArticle=cardTemplate.querySelector(".productCard")
    cardArticle.id = item.id    
    const title = document.createElement("h2")
    title.textContent =item.title
    const cardTitle= cardTemplate.querySelector(".cardTitle")
    cardTitle.appendChild(title)   
    
    const description = document.createElement("span")
    description.innerText=item.description
    const price=document.createElement("span")
    price.innerText=item.price
    const stock=document.createElement("span")
    stock.innerText=item.stock
    const thumbnail=document.createElement("span")
    thumbnail.innerText=item.thumbnail
    const cardBody=cardTemplate.querySelector(".cardBody")
    cardBody.appendChild(description)
    cardBody.appendChild(price)
    cardBody.appendChild(stock)
    cardBody.appendChild(thumbnail)
    document.querySelector("section").appendChild(cardTemplate)
  });
socket.on("eraseProduct",(id)=>{
    const element=document.getElementById(id)
    element.remove()
})

    socket.on("data",(data)=>{
console.log(data)
        data.data.forEach(item=>{
            const cardTemplate=document.getElementById("productCardTemplate").content.cloneNode(true)
            const cardArticle=cardTemplate.querySelector(".productCard")
            cardArticle.id = item.id
            const title = document.createElement("h2")
            title.textContent =item.title
            const cardTitle= cardTemplate.querySelector(".cardTitle")
            cardTitle.appendChild(title)   
            const description = document.createElement("span")
            description.innerText=item.description
            const price=document.createElement("span")
            price.innerText=item.price
            const stock=document.createElement("span")
            stock.innerText=item.stock
            const thumbnail=document.createElement("span")
            thumbnail.innerText=item.thumbnail
            const cardBody=cardTemplate.querySelector(".cardBody")
            cardBody.appendChild(description)
            cardBody.appendChild(price)
            cardBody.appendChild(stock)
            cardBody.appendChild(thumbnail)
            document.querySelector("section").appendChild(cardTemplate)
        })
    })
    
    socket.on("dataUpdate",(data)=>{
        const item=data.data
        const cardTemplate=document.getElementById("productCardTemplate").content.cloneNode(true)
      
        const title = document.createElement("h2")
        title.textContent =item.title
        const cardTitle= cardTemplate.querySelector(".cardTitle")
        cardTitle.appendChild(title)   
        const description = document.createElement("span")
        description.innerText=item.description
        const price=document.createElement("span")
        price.innerText=item.price
        const stock=document.createElement("span")
        stock.innerText=item.stock
        const thumbnail=document.createElement("span")
        thumbnail.innerText=item.thumbnail
        const cardBody=cardTemplate.querySelector(".cardBody")
        cardBody.appendChild(description)
        cardBody.appendChild(price)
        cardBody.appendChild(stock)
        cardBody.appendChild(thumbnail)
        document.querySelector("section").appendChild(cardTemplate)
    
    })
    
    


