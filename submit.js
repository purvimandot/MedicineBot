exports.Card = function(name,age,phone,addr,cuisine) {
	
	var s = {
		"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
		"version": "1.0",
		"type": "AdaptiveCard",
		"body": [
			{
				"type": "TextBlock",
				"size": "Medium",
				"weight": "Bolder",
				"text": "Form"
			},
			{
				"type": "ImageSet"
			},
			{
				"type": "FactSet",
				"facts": [
					{
						"title": "Name:",
						"value": `${name}`
					},
					{
						"title": "Age:",
						"value": `${age}`
					},
					{
						"title": "Phone no:",
						"value": `${phone}`
					},
					{
						"title": "Address:",
						"value": `${addr}`
					},
					{
						"title": "Your Fav Cuisine:",
						"value": `${cuisine}`
					}
				]
			},  
		],
		"actions": [
			{
			  "type": "Action.Submit",
			  "title": "Submit",
			  "data": {
				"prop1": true,
			  }
			}
		]		
	};
	

return s;
};