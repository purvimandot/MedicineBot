// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const mysql = require('mysql');

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Purvi@10',
    database : 'profile_bot',
    multipleStatements : true,
});

db.connect((err) => {
    if(err){
        console.log('DB connectoin failed\nError : '+ JSON.stringify(err));
    }
    else
        console.log('MySQL connected');
});

const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    Dialog,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { UserProfile } = require('./userprofile');
//const SubmitCard = require('./submit');
const FormCard=require('./form');
const formSub = require('./formsubmit');
const { CardFactory } = require('botbuilder');

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class user extends ComponentDialog {
    constructor(dialogId) {
        super('userProfileDialog');

        this.addDialog(new WaterfallDialog(dialogId, [
            async function(step) {
                var a = FormCard.Form();
                console.log(a);
                await step.context.sendActivity({
                    attachments: [CardFactory.adaptiveCard(a)]
                });
        
                return Dialog.EndOfTurn;
            },
        
            async function(step) {
                await step.context.sendActivity('Validating form');
                const activity = step.context.activity;
                const result = activity.value;
                console.log(result);
                if(emailRegexp.test(result.myEmail)){
                var s = formSub.formSub(result.myName,result.myEmail,result.myTel,result.radio);
                console.log(s);

                // var jsonsub = JSON.stringify(s);
                // console.log(jsonsub);

                await step.context.sendActivity({
                    attachments: [ CardFactory.adaptiveCard(s)]
                });        
            }else{
                await step.context.sendActivity('Plz enter a valid email');
                    return 0;
            }
                return await step.endDialog();
            }
        ]));

    }

            
        
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    
            
}            
module.exports.user = user;