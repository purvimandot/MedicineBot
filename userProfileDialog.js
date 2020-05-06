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
    ChoicePrompt,
    ConfirmPrompt,
    AttachmentPrompt,
    ChoiceFactory,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');

const { UserProfile } = require('./userprofile');
//const SubmitCard = require('./submit');
const FormCard=require('./form');
const { CardFactory } = require('botbuilder');

const AGE_PROMPT = 'NUMBER_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const ADDR_PROMPT = 'NAME_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class user extends ComponentDialog {
    constructor(userState) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new NumberPrompt(AGE_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new TextPrompt(ADDR_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator));


        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.nameStep.bind(this),
            this.ageStep.bind(this),
            this.numberStep.bind(this),
            this.addrStep.bind(this),
            this.cuisineStep.bind(this),
            this.pictureStep.bind(this),
            this.confirmStep.bind(this),
            this.summaryStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
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

    async nameStep(step) {
        return await step.prompt(NAME_PROMPT, 'Please enter your name.');
    }

    async ageStep(step) {
        step.values.name = step.result;
            return await step.prompt(NUMBER_PROMPT, 'Please enter your age');
    }

    async numberStep(step) {
        step.values.age = step.result;
            return await step.prompt(NUMBER_PROMPT, 'Please enter your phone number');
    }

    async addrStep(step) {
        step.values.ph_no = step.result;
            return await step.prompt(NAME_PROMPT, 'Please enter your address.');
    }

    async cuisineStep(step) {
        step.values.addr = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please enter your favourite cuisine',
            choices: ChoiceFactory.toChoices(['Italian', 'Chinnese', 'Indian', ''])
        });
    }

    async pictureStep(step) {
        step.values.cuisine = step.result.value;
            var promptOptions = {
                prompt: 'Please attach a profile picture (or type any message to skip).',
                retryPrompt: 'The attachment must be a jpeg/png image file.'
            };

            return await step.prompt(ATTACHMENT_PROMPT, promptOptions);
        // }
    }

    async confirmStep(step) {
        step.values.picture = step.result && step.result[0];

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, { prompt: 'Is this okay?' });
    }


    async summaryStep(step) {
        
        if (step.result) {
            const userProfile = await this.userProfile.get(step.context, new UserProfile());

            userProfile.name = step.values.name;
            userProfile.age = step.values.age;
            userProfile.ph_no = step.values.ph_no;
            userProfile.addr = step.values.addr;
            userProfile.cuisine = step.values.cuisine;
            userProfile.picture = step.values.picture;



            let v =[ userProfile.name, userProfile.age, userProfile.ph_no, userProfile.addr];
            let sql = `INSERT INTO profile ( name, age, phone, addr) VALUES (?)`;
            db.query(sql, [v], (err, result) => {
            if(!err){
                console.log('Added successfully');
                console.log(result);
            }    
            else
                console.log(err);
            });

            let msg = `I have your name as ${ userProfile.name } and your phone number is ${ userProfile.ph_no }`;
            msg += ` and your age is ${ userProfile.age }`;
            msg += ` and your addr is ${ userProfile.addr }`;
            msg += ` and your fav cuisine is ${ userProfile.cuisine }`;
            msg += '.';
            await step.context.sendActivity(msg);
            
            //var s = SubmitCard.Card(userProfile.name,userProfile.age,userProfile.ph_no,userProfile.addr,userProfile.cuisine);
            var s=FormCard.Form();
            console.log(s);

            // var jsonsub = JSON.stringify(s);
            // console.log(jsonsub);

            await step.context.sendActivity({
                text: msg,
                attachments: [ CardFactory.adaptiveCard(s)]
              });

            if (userProfile.picture) {
                try {
                    await step.context.sendActivity(MessageFactory.attachment(userProfile.picture, 'This is your profile picture.'));
                } catch {
                    await step.context.sendActivity('A profile picture was saved but could not be displayed here.');
                }
            }
            
        } else {
            await step.context.sendActivity('Thanks. Your profile will not be kept.');
        }

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is the end.
        return await step.endDialog();
    }


    async picturePromptValidator(promptContext) {
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];

            attachments.forEach(attachment => {
                if (attachment.contentType === 'image/jpeg' || attachment.contentType === 'image/png') {
                    validImages.push(attachment);
                }
            });

            promptContext.recognized.value = validImages;

            // If none of the attachments are valid images, the retry prompt should be sent.
            return !!validImages.length;
        }
        else {
            await promptContext.context.sendActivity('No attachments received. Proceeding without a profile picture...');

            // We can return true from a validator function even if Recognized.Succeeded is false.
            return true;
        }
    }
}  

module.exports.user = user;
