const inputSlider = document.querySelector("[lengthSlider]");
const lengthNumber = document.querySelector("[dataLengthNumber]");
const displayPassword = document.querySelector("[data-passwordDisplay]");
const copy = document.querySelector("[datacopy]");
const copyMessage = document.querySelector("[datacopymessage]");
const indicator = document.querySelector("[dataIndicator]");
const upperCase = document.querySelector("#uppercase");
const lowerCase = document.querySelector("#lowercase");
const numBer = document.querySelector("#numbers");
const symBol = document.querySelector("#symbols");
const genBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$^&*()-+={}[]|?"<>.,`;\/'

let password = "";
let passwordLength = 10;
let checkCount = 1;
// setIndicator("#ccc");

// function setIndicator(color){
//     indicator.Style.background = color;
//     indicator.Style.boxShadow = '0px 0px 12px 1px ${color}';
// }


handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthNumber.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+"% 100%"
}

function getRndInteger(min,max){
    return Math.floor( Math.random() * (max-min)) + min;
}

function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode (getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode (getRndInteger(65,91));
}

function generateSymbol(){
    const randomIndex = getRndInteger(0, symbols.length);
    return symbols.charAt(randomIndex);
}

function calStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(upperCase.checked) hasUpper=true;
    if(lowerCase.checked) hasLower=true;
    if(numBer.checked) hasNum=true;
    if(symBol.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator:("#0f0");
    }
    else if(
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
            setIndicator:("#ff0");
    }else{
        setIndicator:("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(displayPassword.value);
        copyMessage.innerText = "copied";
    }
    catch(e){
        copyMessage.innerText = "failed";
    }
    copyMessage.classList.add("active");
    setTimeout(() => {
        copyMessage.classList.remove("active");
    },2000); 
}


inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copy.addEventListener('click', () => {
    if(displayPassword.value)
        copyContent();
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    // condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider(); 
    }
} 
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}




 genBtn.addEventListener('click', () => {
    //none of checkbox selected
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start to find new password

    // remove old password
    password="";

    //put the stuff mention by checkbox

    // if(upperCase.checked){
    //     password = generateUppercase();
    // }
    // if(lowerCase.checked){
    //     password = generateLowercase();
    // }
    // if(upperCase.checked){
    //     password = generateRndNumber();
    // }
    // if(upperCase.checked){
    //     password = generateSymbol();
    // }

    let funcArr = [];
    if(upperCase.checked)
        funcArr.push(generateUppercase);
    if(lowerCase.checked)
        funcArr.push(generateLowercase);
    if(numBer.checked)
        funcArr.push(generateRndNumber);
    if(symBol.checked)
        funcArr.push(generateSymbol);

    // compulsory
    for(let i=0;i<funcArr.length;i++)
    {
         password += funcArr[i]();
    }
    
    // remaining
    for(let i=0;i<passwordLength-funcArr.length;i++)
    {
        let randomIndex = getRndInteger (0,funcArr.length);
        password += funcArr[randomIndex](); 
    }

    // shuffle

    password = shufflePassword(Array.from(password));

    // show ininput
    displayPassword.value = password;

    // strength
    calStrength();

})
