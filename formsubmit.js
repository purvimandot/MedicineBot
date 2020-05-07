exports.formSub = function(name,email,phone,gender) {
	
	var s = {
		"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
		"version": "1.0",
		"type": "AdaptiveCard",
		"body": [
			{
				"type": "TextBlock",
				"size": "Medium",
				"weight": "Bolder",
				"text": "Thank You!!!"
			},
			{
				"type": "FactSet",
				"facts": [
					{
						"title": "Name:",
						"value": `${name}`
					},
					{
						"title": "Email:",
						"value": `${email}`
					},
					{
						"title": "Phone no:",
						"value": `${phone}`
					},
					{
						"title": "Gender:",
						"value": `${gender}`
					},
			    ]
			} 
		]
				
	};
	

return s;
};