
exports.Form = function() {
	
	var s = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {   
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": 2,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Your details",
                                "weight": "Bolder",
                                "size": "Medium"
                            },
                            {
                                "type": "TextBlock",
                                "text": "body",
                                "isSubtle": true,
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "disclaimer",
                                "isSubtle": true,
                                "wrap": true,
                                "size": "Small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Your Name",
                                "wrap": true
                            },
                            {
                                "type": "Input.Text",
                                "id": "myName",
                                "placeholder": "First,Last",
                                "validation": {
                                    "necessity": "required",
                                    "errorMessage": "Name is required"
                                  }
                            },
                            {   
                                "type": "TextBlock",
                                "text": "Your Email Address",
                                "wrap": true
                            },
                            {
                                "type": "Input.Text",
                                "id": "myEmail",
                                "placeholder": "youremail@example.com",
                                "style": "Email",
                                "validation": {
                                    "necessity": "required",
                                    "errorMessage": "Email is required"
                                  }
                            },
                            {
                                "type": "TextBlock",
                                "text": "Phone Number"
                            },
                            {
                                "type": "Input.Text",
                                "id": "myTel",
                                "placeholder": "xxx.xxx.xxx",
                                "style": "Tel",
                                "validation": {
                                    "necessity": "required",
                                    "errorMessage": "Phone number is required"
                                  }
                            },
                            {
                                "type": "TextBlock",
                                "text": "Gender"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Gender"
                            },
                            {
                                "type": "Input.ChoiceSet",
                                "id": "radio",
                                "placeholder": "Placeholder text",
                                "validation": {
                                    "necessity": "required",
                                    "errorMessage": "Plz select your gender"
                                  },
                                "choices": [
                                    {
                                        "title": "Male",
                                        "value": "Choice 1"
                                    },
                                    {
                                        "title": "Female",
                                        "value": "Choice 2"
                                    }
                                ],
                                "style": "expanded"
                            }
                        ]
                    },
        
                ]
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Submit",
                "requiredInputs": [
                    "myEmail","myTel","myName"
                  ]
            }
        ]
    };
    return s;
}
