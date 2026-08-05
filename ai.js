const API_KEY="sk-jbmG2MMDa70u525sxLLtCbCrirkBuXu9tV0MmL7qj6n7sFEp";
const MODEL="openai/gpt-4o-mini";

const chat=document.getElementById("chat");
const input=document.getElementById("prompt");
const thinking=document.getElementById("thinking");

let history=[];

function bubble(text,type){

const div=document.createElement("div");

div.className="message "+type;

chat.appendChild(div);

if(type==="ai"){

let i=0;

const timer=setInterval(()=>{

div.innerHTML=marked.parse(text.substring(0,i));

chat.scrollTop=chat.scrollHeight;

i++;

if(i>text.length){

clearInterval(timer);

document.querySelectorAll("pre code").forEach(el=>hljs.highlightElement(el));

}

},8);

}else{

div.innerText=text;

}

chat.scrollTop=chat.scrollHeight;

}

async function sendMessage(){

const text=input.value.trim();

if(!text)return;

document.querySelector(".welcome")?.remove();

bubble(text,"user");

history.push({
role:"user",
content:text
});

input.value="";

thinking.classList.remove("hidden");

try{

const res=await fetch("https://apihub.agnes-ai.com/v1",{

method:"POST",

headers:{

Authorization:`Bearer ${sk-jbmG2MMDa70u525sxLLtCbCrirkBuXu9tV0MmL7qj6n7sFEp}`,

"Content-Type":"application/json",

"HTTP-Referer":"https://dienmayxanhdmx0999-commits.github.io/skibidiscript/",

"X-Title":"NOXGPT"

},

body:JSON.stringify({

model:MODEL,

messages:history

})

});

const data=await res.json();

thinking.classList.add("hidden");

if(data.error){

bubble(data.error.message,"ai");

return;

}

const reply=data.choices[0].message.content;

history.push({

role:"assistant",

content:reply

});

bubble(reply,"ai");

}catch(e){

thinking.classList.add("hidden");

bubble("Không thể kết nối tới AI.","ai");

console.log(e);

}

}

input.addEventListener("keydown",e=>{

if(e.key==="Enter"){

e.preventDefault();

sendMessage();

}

});
