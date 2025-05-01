let username;
let age;


document.getElementById("Click").onclick=function(event) {
    event.preventDefault()
username= document.getElementById("User").value;
console.log(username);

document.getElementById("what").textContent=username;

}


document.getElementById("Click2").onclick=function(event) {
    event.preventDefault()
age= document.getElementById("User2").value;

if(age>=21){
window.alert("Permissible to access webpage");
}
else if(age < 0){
    window.alert ("You don't exist?");
}
else if(age == 0){
    window.alert ("Unsupervised internet access detected");
}
else {
    window.alert("Exit the website");
}

for(let x=0; x<10; x++) {
    console.log(x);
}

let guitar= ["GIbson", "Fender",  "Epiphone", "Santana", "Ibanez", "Granada"]

for(let x=0; x<10; x++) {
    console.log(guitar[x]);
}
}

let Lorems = document.getElementsByTagName ("p");
console.log("This is my collection of all <p> tags");

console.log(document);
console.log(Lorems);

function changingParaStyles(){
Lorems[0].style.fontSize = "64px";
Lorems[3].style.color = 'red';
}

console.dir(document);

let x= 0;
let y = [1,2,3];

let persondata = {
   "name": "Nameless",
    "age": 31,
    "job": "Unemployed",
};

persondata.haslicense=true;

delete persondata.name;

console.log("The object person_data is");
console.log(persondata);

console.log("This persons current age is");
console.log(persondata.age);

if(persondata.hasOwnProperty("name")){
    console.log("Yes, we have this persons name");
}

else {
    console.log("No we do not have this persons name")
}

let person2_data = new Object ();
person2_data.name = "Shulker";
person2_data.job = "Box";
person2_data.age = 2400;

console.log(person2_data)


let user = (name) => {
    return 'My name is ${name}';
};


const greeting = () => {
    return console.log('Hello, how are you?');
}

const damn = document.getElementById ('michael')

let parentDiv = document.querySelector('div-border');
console.log(parentDiv);
let firstChildDiv = parentDiv.firstElementChild;
console.log("The First child is\t"+ firstChildDiv);
console.log(firstChildDiv);

let DivPara2 = document.getElementById("DivPara2");
console.log("The Paragraph element is\t"+DivPara2);
console.log(DivPara2);

let parentofDivPara2 = DivPara2.parentElement;
console.log("Its parent element is\t"+parentofDivPara2);
console.log(parentofDivPara2);

parentDiv.addEventListener("click", divClick);

function divClick(){
    firstChildDiv.style.background = "pink";
    parentofDivPara2.style.background = "blue";
}