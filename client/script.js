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
	var math_history = [];

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
			if (math_data[0] === "" && Boolean(math_history[0])) {
				console.log("repeat operation: operater changed");
				self.repeatSolution();
			} else {
				self.handlers.handleOperators($(this));
			}
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
			// If display is not cleared, equal repeats solution
			if (math_data[0] === "" && Boolean(math_history[0])) {
				console.log("repeat solution equal clicked");
				self.repeatSolution();
			} else {
				self.handlers.handleEqual();
			}
			console.log(math_data);
		});
	};

	//
	self.handlers = {
		// Handles key number inputs
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
		// Handles operator key inputs
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
		// Handles AC key input
		handleAC: function(){
			// Clears everything!
			math_data = [""];
			math_history = [];
			$("#display_total").text("");
		},
		// Handles period key input
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
		// Handle delete key input
		handleDelete: function() {
			if (math_data.length === 1){
				math_data = [""];
				self.displayKeys();
				return;
			}
			var lastDigit = math_data[math_data.length-1];
			while ( lastDigit === "" ){
				math_data.pop();
			}
			math_data.pop();
			self.displayKeys();
		},
		// Handles majority of equal key input
		handleEqual: function(){
			var total = self.solveSolution(math_data);
			// Potential error caught: Infinity
			if (total === Infinity){
				$("#display_total").text("Error");
				math_data = [""];
			} else {
					// Accounts for errors made with only one entry in array:`123`
					if(math_data.length === 1){
						// Potential error caught: Missing operands
						if(math_data[0] === ""){
							total = "";
							console.log("no other input, just equals");
							self.displayNumbers(total);
							// Potential error caught: Missing operation
						} else {
							console.log("equal pressed after 1 number only");
							return;
						}
					} else {
							// Solves the problem of additional operators and ""
							if(math_data[math_data.length-1] == ""){
								math_data.pop();
								math_data.pop();
							}
							$("#display_total").text("");
							math_history = math_history.concat(math_data);
							total = self.solveSolution(math_data);
							self.displayNumbers(total);
							math_data = [""];
							console.log("you reached the clean way!",math_data);
					}
			}
		}
	};

	// Logic engine for math evaluation
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
					// Catches first iteration of num + operator
					if(math_data[math_data.length-1] === "") {
						math_data[math_data.length-1] = math_data[0];
						total = total + parseFloat(math_data[i+1]);
					} else {
						total = total + parseFloat(math_data[i+1]);
						}
					// }
					break;
				case "-":
					total = total - parseFloat(math_data[i+1]);
					break;
			};
		};
			return total;
	};
	// Math evaluation repeats from math_history if calculator display !clear
	self.repeatSolution = function(){
		math_history = math_history.concat(math_data);
		console.log("math history: ", math_history);
		var current_total = parseFloat($("#display_total").text());
		math_history[0] = current_total;
		math_history[math_history.length-1] = math_data[math_data.length-1];
		console.log("current total:",current_total);
		console.log("math history:",math_history);
		console.log("math total",math_data);
		total = self.solveSolution(math_history);
		$("#display_total").text(total);
	}

	// View - updates the calculator display
	self.displayNumbers = function(value){
		var $display = $("#display_total");
		var currentValue = $display.text();
		// Grabs the current display and attaches next value to it; i.e. 5 -> 54 -> 546
		currentValue += "" + value;
		// Clear display for new value
		$display.text(currentValue);
	};

	// View - updates the calculator display for non-number inputs: i.e. periods,
	self.displayKeys = function(){
		var $display = $("#display_total");
		var new_display_input = math_data.filter(function(el){
			return el !== ",";
		})
		$display.text(new_display_input.join(""));
	}

	// Calls the constructor & sets up handlers on document ready
	self.init();
}

var calculator = new Calculator();
