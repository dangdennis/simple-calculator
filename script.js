/*

Add a digit to the display.
Put a decimal point on the display (if not there already)
Put an exponent ('e') on the display.
Change the sign to + if - and minus if plus.
Clear and All Clear (C and AC)
Perform operations * / + and -
Calculate (on pressing the = button)

*/

function Calculator() {
	var self = this;
	var math_data = [""];

	self.init = function(){
		$(document).ready(function(){
			self.eventHandlers();
		});
	};

	self.eventHandlers = function(){
		$(".num_keys").on("click",function(){
			self.handlers.handleInputNumbers($(this));
			console.log(math_data);
		});
		$(".operators").on("click",function(){
			self.handlers.handleOperators($(this));
			console.log(math_data);
		});
		$("#AC_key").on("click",function(){
			self.handlers.handleAC();
			console.log(math_data);
		});
		$("#delete_key").on("click",function(){
			self.handlers.handleDelete();
			console.log(math_data);
		});
		$("#period_key").on("click",function(){
			self.handlers.handlePeriod();
			console.log(math_data);
		});
		$("#equal_key").on("click",function(){
			//Equal key operates on its own this.property
			self.handlers.handleEqual();
			console.log(math_data);
		});
	};

	//
	self.handlers = {
		handleInputNumbers: function(el){
			// Clears input screen after a solution is completed
			if (math_data[0] === "") {
				math_data = [""];
				$("#display_total").text("");
			}
			// Grabs the value of the number key clicked
			var keyValue = el.text();
			self.displayNumbers(keyValue);
			// Adds latest key to math expression
			math_data[math_data.length-1] += keyValue;
		},
		handleOperators: function(el){
			// Catches errors for changing operators
			if(math_data[math_data.length-1] === ""){
				var clicked_operator = el.text();
				math_data[math_data.length-2] = clicked_operator;
				self.displayKeys();
				return;
			} else {
				// Adds operator to math expression
				var keyValue = el.text();
				self.displayNumbers(keyValue);
				math_data[math_data.length] = keyValue;
				math_data[math_data.length] = "";
			}
		},
		handleAC: function(){
			// Clears everything!
			math_data = [""];
			$("#display_total").text("");
		},
		handlePeriod: function(){
			var lastNumber = math_data[math_data.length-1];
			var splitLastNumber = lastNumber.split("");
			if(splitLastNumber[splitLastNumber.length-1] === "." || lastNumber === ""){
				return;
			} else {
				math_data[math_data.length-1] += ".";
				self.displayKeys();
			}
		},
		handleDelete: function() {
			var lastDigit = math_data[math_data.length-1];
			while ( lastDigit === "" ){
				math_data.pop();
			}
			math_data.pop();
			self.displayKeys();
		},
		handleEqual: function(){
			var total = self.solveSolution(math_data);
			$("#display_total").text("");
			// Potential error caught: Infinity
			if (total === Infinity){
				$("#display_total").text("Error");
				math_data = [""];
			} else {
					// Accounts for errors made with only one entry in array:
					if(math_data.length === 1){
						// Potential error caught: Missing operands
						if(math_data[0] === ""){
							total = parseFloat($("#display_total").text());
							console.log("no other input, just equals");
							self.displayNumbers(total);
							// Potential error caught: Missing operation
						} else {
							console.log("equal pressed after 1 number only");
							self.displayNumbers(total);
						}
					// 	// Accounts for errors made under three or less entries:
					// } else if (math_data.length === 3){
					// 			// Repeats operations after multiple equals
					// 			if(total){
					// 				self.displayNumbers(total);
					// 				var lastOperation = math_data.slice(math_data.length-2);
					// 				math_data = math_data.concat(lastOperation);
					// 				total = self.solveSolution(math_data);
					// 				$("#display_total").text("");
					// 				self.displayNumbers(total);
					// 				math_data = [""];
					// 			} else if (isNaN(total)){
					// 				var tempNum = math_data[0];
					// 				var tempOp = math_data[1];
					// 				var tempExp = tempOp.concat(tempNum);
					// 				console.log(tempExp);
					// 				self.solveSolution(total);
					// 				self.displayNumbers(total);
					// 				console.log("math length 3 clean, no repeats");
					// 			}
						// Array over four - branch reached if no other errors
					} else {
							// Solves the problem of additional operators and ""
							if(math_data[math_data.length-1] == ""){
								math_data.pop();
								math_data.pop();
							}
							total = self.solveSolution(math_data);
							self.displayNumbers(total);
							math_data = [""];
							console.log("you reached the clean way!",math_data);
					}
			}
		}
	};

	// Engine/logic to solve expression
	self.solveSolution = function(math_data){
		// total is the accumulator for the math_data expression
		var total = parseFloat(math_data[0]);
		for (var i=1;i<math_data.length;i+=2){
			switch(math_data[i]) {
				case "x":
					total = total * parseFloat(math_data[i+1]);
					break;
				case "/":
					total = total / parseFloat(math_data[i+1]);
					break;
				case "+":
					if(math_data[math_data.length-1] === "") {
						math_data[math_data.length-1] = math_data[0];
						total = total + parseFloat(math_data[i+1]);
					} else {
						total = total + parseFloat(math_data[i+1]);
					}
					break;
				case "-":
					total = total - parseFloat(math_data[i+1]);
					break;
			};
		};
			return total;
	};

	// View - updates the calculator display
	self.displayNumbers = function(value){
		var $display = $("#display_total");
		var currentValue = $display.text();
		// Grabs the current display and attaches next value to it; i.e. 5 -> 54 -> 546
		currentValue += "" + value;
		// Clear display for new value
		$display.text(currentValue);
	};
	// Seperate view display for non-number inputs: i.e. periods,
	self.displayKeys = function(){
		var $display = $("#display_total");
		var new_display_input = math_data.filter(function(el){
			return el !== ",";
		})
		$display.text(new_display_input.join(""));
		// Grabs the current display and attaches next value to it; i.e. 5 -> 54 -> 546
		// Clear display for new value
	}

	// Calls the constructor, sets up: handlers on document ready
	self.init();
}

var calculator = new Calculator();
