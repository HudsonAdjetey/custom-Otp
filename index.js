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

const handleChange = (i, event, otpInputs) => {
  const value = event.target.value;
  if (isNaN(value)) return;
  //   get the last member of the string
  otpInputs[i].value = value.substring(value.length - 1);

  /* 
    CONDITION
    if the value exist, the index is less than the length  and it's not the last element in the array then do this:
  */
  if (value && i < length - 1 && otpInputs[i + 1]) {
    otpInputs[i + 1].focus();
  }
};

// handle click event
function handleClick(index, otpInputs) {
  otpInputs[index].setSelectionRange(1, 1);
  if (index > 0 && !otpInputs[index - 1].value) {
    otpInputs[0].focus();
  }
}

function handleKeyDown(index, event, otpInputs) {
  if (event.key === "Backspace" && !otpInputs[index].value && index > 0) {
    otpInputs[index - 1].focus();
  }
}

// initialize OTP input fields
function createOptFields() {
  let otpInputs = [];

  // clear previous fields if any exist
  while (arrInputsContainer.firstChild) {
    arrInputsContainer.removeChild(arrInputsContainer.lastChild);
  }

  // create the input field
  for (let i = 0; i < length; i++) {
    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.dataset.id = i;
    inputField.addEventListener("input", function (event) {
      handleChange(i, event, otpInputs);
    });
    inputField.addEventListener("click", function (event) {
      handleClick(i, otpInputs);
    });
    inputField.addEventListener("keydown", (event) =>
      handleKeyDown(i, event, otpInputs)
    );
    otpInputs.push(inputField);
    arrInputsContainer.appendChild(inputField);
  }
  otpInputs[0].focus();
  if (isCopyPasteEnabled) {
    enableCopyPaste(otpInputs);
  }
}
// enableCopyPaste function
function enableCopyPaste(fields) {
  const copyHandler = (e) => {
    var clipboardData = e.clipboardData || window.Clipboard;
    e.preventDefault();
    if (clipboardData && clipboardData.setData) {
      // IE specific logic
      clipboardData.setData("Text", getOtpValue(fields));
      return false;
    }
  };
  document.body.addEventListener("copy", copyHandler);
}

createOptFields();
