const closeBtn = document.querySelector(".close-btn");
const popMenu = document.querySelector(".pop-menu");
const contentPop = document.querySelector(".content-pop");

// Array inputs
const arrInputsContainer = document.querySelector(".arr-inputs");

// add event listener to close the pop up
closeBtn.addEventListener("click", () => {
  contentPop.classList.add("content-pop-close");
  popMenu.classList.add("content-pop-close");
});

// Create a new Array of elements - inputs
const length = 4;


// initialize OTP input fields
function createOtpFields() {
  // clear previous fields if any exist
  while (arrInputsContainer.firstChild) {
    arrInputsContainer.removeChild(arrInputsContainer.lastChild);
  } 
  for (let i = 0; i < length; i++) {
    let inputField = document.createElement("input");
    inputField.type="text";
    inputField.className+=" otp-field";
    inputField.dataset.index=i;
    inputField.addEventListener("focus", function(){
      this.select();
    });
    
    // check if user is done typing in one field and move to next or if they are at the last field, do nothing
    // check if last field, then make next one read only and add "confirm" button
    if (i == length -1 ) {
      inputField.readOnly=true;
      let confirmButton = document.createElement("button");
      confirmButton.innerHTML="Confirm";
      confirmButton.className+=" btn-confirm";
      confirmButton.dataset.index=i;
      confirmButton.addEventListener("click", validateAndSubmit);
      
      inputField.parentNode.appendChild(document.createDocumentFragment());
      inputField.parentNode.insertBefore(confirmButton, inputField.nextSibling);
    }
    arrInputsContainer.appendChild(inputField);
  }
}

// get values from all fields and join them into a single string
function getCodeFromFields () {
  const codeArr=[];
  const fields=document.querySelectorAll(".otp-field");
  
  fields.forEach((field)=>{
    codeArr.push(field.value);
  });
  return codeArr.join('');
}

// validate the OTP entered by user against expected value
function validateAndSubmit() {
  event.preventDefault();
  var index=this.dataset.index;
  var providedCode=getCodeFromFields();
  
  if (providedCode.length==codeLength) {
    closeModal();
    callbackFunction({valid: true, otp: providedCode});
  } else if (index < codeLength -1 && providedCode.length > codeLength) {
    alert("Please enter exactly "+codeLength+" digits.");
    resetFields();
  } else if (index >= codeLength -1){
    alert("Invalid OTP.");
  }
}

// show modal with error message
function showError(errMsg) {
  setMessageContent(errorMessageElement, errMsg);
  openModal();
}

// generate random number between minValue and maxValue
function getRandomInt(minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue +  1)) + minValue;
}

// add an event listener to each field that listens for input events
fields.forEach((field) => {
  field.addEventListener("input", function(){
    this.classList.add("filled");
    
    // remove "wrong" class if it exists
    this.classList.remove("wrong");
    
    // check if all fields have been filled in
    if (!fields.some((f)=>!f.classList.contains("filled")) ) {
      submitButton.disabled = false;
      
      /*
        If the user has not yet submitted a valid code, then we need to make sure that they are entering
        the correct length of code. Otherwise, there is no point in showing them any more than one digit.
      */
      let currentFieldIndex = fields.indexOf(this);
      if(!isValidated || !isCorrectLength(currentFieldIndex)){
        let nextField = fields[currentFieldIndex+1];
        
        if(nextField) {
          nextField.focus();
        }else{
          isValidating = true;
          
          validateCode().then(()=>{
            isValidating = false;
            
            if(isCorrectLength()) {
              submitButton.click();
            } else {
              showError("Please enter a code with exactly "+codeLength+" digits.");
            }
          });
      }
    }
  });
});

function validateCode() {
  return new Promise((resolve, reject) => {
    let code = "";
    for (let f of fields){
      if(f.classList.contains("filled")){
        code += f.value;
      }
    }
    
    if(code === ""){
      reject("No input provided");
    }else if(code.length !== codeLength){
      reject("Incorrect number of inputs: " + code.length + ". Please enter a code with exactly "+codeLength+" digits.");
      reject("Invalid number of characters: " + code.length + ". Please enter a code with exactly "+codeLength+" digits.");
      reject("Invalid number of characters: " + code.length + ". Please enter a code with exactly "+codeLength+" digits.");
      reject("Invalid number of characters: " + code.length + ". Please enter a code with exactly "+codeLength+" digits.");
    }
    // Send request to server and check if this code is valid
}