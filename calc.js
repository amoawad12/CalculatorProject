// Get all the keys from document
var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', 'x', '÷'];
var decimalAdded = false;
var pixelSize = 0;
var parentPixelSize = 0;

// These boooleans should be used to launch the appropriate handlers for the different functions.
var pxToEmBool = false;
var emToPxBool = false;
var pxToPerbool = false;
var DPIBool = false;



// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
        // Get the input and button values
        var input = document.querySelector('.screen');
        var prompt = document.querySelector('.promptScreen');
        var inputVal = input.innerHTML;
        var btnVal = this.innerHTML;
        

		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if(btnVal == 'C') {
			input.innerHTML = '';
			decimalAdded = false;
		}
		
		// If eval key is pressed, calculate and display the result
		else if(btnVal == '=') {
			var equation = inputVal;
			var lastChar = equation[equation.length - 1];

            if (pxToEmBool) {
                handlePxToEm(prompt, input, inputVal);
            }
            
            else {
			     // Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
			     equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
			
			     // Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			     if(operators.indexOf(lastChar) > -1 || lastChar == '.')
				    equation = equation.replace(/.$/, '');
			     if(equation)
				    input.innerHTML = math.eval(equation);
            }
            
				
			decimalAdded = false;
		}
        
        else if(btnVal == 'Px to Em') {
            prompt.innerHTML = "Enter Pixel Size";
            pxToEmBool = true;
        }
		// Basic functionality of the calculator is complete. But there are some problems like 
		// 1. No two operators should be added consecutively.
		// 2. The equation shouldn't start from an operator except minus
		// 3. not more than 1 decimal should be there in a number
		
		// We'll fix these issues using some simple checks
		
		// indexOf works only in IE9+
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];
			
			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
				input.innerHTML += btnVal;
			
			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-') 
				input.innerHTML += btnVal;
			
			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				input.innerHTML = inputVal.replace(/.$/, btnVal);
			}
			
			decimalAdded =false;
		}
		
		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
		else if(btnVal == '.') {
			if(!decimalAdded) {
				input.innerHTML += btnVal;
				decimalAdded = true;
			}
		}
		
		// if any other key is pressed, just append it
		else {
			input.innerHTML += btnVal;
		}
		// prevent page jumps
		e.preventDefault();
	} 
}


//converting pixels to em
function pxToEm(size_px, parent_size){
	var result = size_px/parent_size;
	return result;
}

//converting em to pixels
function emToPx(size_em, parent_size){
	var result = size_em * parent_size;
	return result;
}

//converting pixels to %
function pxToPercent(size_px, parent_size){
	var result = (size_px/parent_size) * 100;
	return result;
}

//dpi calculation
//diagonal size must be in inches
//width and length in pixels
function calc_dpi(px_width, px_length, diagonal_size){
	//calculate the diagonal resolution
	var width_square = math.pow(px_width, 2);
	var length_square = math.pow(px_length, 2);
	var resolution = math.sqrt(width_square + length_square);
	//use diagonal resolution to calculate dpi
	var dpi = resolution/diagonal_size;
	return dpi;
}

// Handles the actions needed to calculate the conversion from px to em. It needs the prompt,
// input, and inputVal objects as arguments because these are defined within the scope of the
// for loop.
function handlePxToEm(prompt, input, inputVal) {
    // These two condition check the prompt window which is only active if a function key is
    // pressed. The values from the input is saved into the correspodning variables and 
    // the prompt screen is changed. When the solution is found the prompt is cleared and
    // and the answer is displayed on the input screen. Some padding is also changed since
    // the strings are diferent lengths.
    if (prompt.innerHTML.indexOf("Parent") == -1 && prompt.innerHTML.toString().length) {
        pixelSize = parseInt(math.eval(inputVal));
        prompt.innerHTML = 'Enter Parent Pixel Size';
        document.getElementById("prompt").style.paddingTop = "5px";
        input.innerHTML = "";
    }
    else if (prompt.innerHTML.indexOf("Parent") > 0) {
        parentPixelSize = parseInt(math.eval(inputVal));
        input.innerHTML = pxToEm(pixelSize, parentPixelSize);
        document.getElementById("prompt").style.paddingTop = "10px";
        prompt.innerHTML = '';
        emToPxBool = false;
    }
}


