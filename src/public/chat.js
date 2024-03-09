const socket=io()
const user = document.getElementById("mail")
const chatBox = document.querySelector(".chatBox")
const message = document.getElementById("message")
const send = document.getElementById("buttonSend")

const addMessage =(text,userText)=>{

const texto= document.createElement('p')
if (userText=== user.value){
    texto.classList.add('userLogged')
    console.log("si",user.value)
}else texto.classList.add('brodcastedMessage')
texto.textContent=`${userText}: ${text}`
chatBox.appendChild(texto)
}
send.addEventListener("click",e=>{
    console.log({user:user.value,message:message.value})
    socket.emit("clientMessage",{author:user.value,message:message.value})
})

socket.on("serverMessage",(data)=>{
addMessage(data.message,data.author)
})
socket.on("chatHistoyy",(data)=>{
    data.forEach(item=>{
        addMessage(item.message,item.author)
    })
})