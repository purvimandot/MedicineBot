// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { InputHints, MessageFactory } = require('botbuilder');
const { ConfirmPrompt, TextPrompt, WaterfallDialog,ComponentDialog } = require('botbuilder-dialogs');
//const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
//const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class OrderMedicineDialog extends ComponentDialog {
    constructor(id) {
        super(id || 'orderMedicineDialog');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            //.addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.brandStep.bind(this),
                this.FormTypeStep.bind(this),
                this.strengthStep.bind(this),
                this.confirmStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a destination city has not been provided, prompt for one.
     */
    async brandStep(stepContext) {
        const medicineDetails = stepContext.options;

        if (!medicineDetails.brand) {
            const messageText = 'What is your medicine brand?';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(medicineDetails.brand);
    }

    /**
     * If an origin city has not been provided, prompt for one.
     */
    async FormTypeStep(stepContext) {
        const medicineDetails = stepContext.options;

        // Capture the response to the previous step's prompt
        medicineDetails.brand= stepContext.result;
        if (!medicineDetails.FormType) {
            const messageText = 'What is the Form Type';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(medicineDetails.FormType);
    }

    /**
     * If a travel date has not been provided, prompt for one.
     * This will use the DATE_RESOLVER_DIALOG.
     */
    async strengthStep(stepContext) {
        const medicineDetails = stepContext.options;

        // Capture the results of the previous step
        medicineDetails.FormType = stepContext.result;
        if (!medicineDetails.strength) {
            const messageText = 'What is the Strength of Medicine';
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
            return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
        }
        return await stepContext.next(medicineDetails.strength);
    }

    /**
     * Confirm the information the user has provided.
     */
    async confirmStep(stepContext) {
        const medicineDetails = stepContext.options;

        // Capture the results of the previous step
        medicineDetails.strength = stepContext.result;
        const messageText = `Please confirm, Medicine Brand: ${ medicineDetails.brand } formtype: ${medicineDetails.FormType } strength: ${ medicineDetails.strength }. Is this correct?`;
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

        // Offer a YES/NO prompt.
        return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /**
     * Complete the interaction and end the dialog.
     */
    async finalStep(stepContext) {
        if (stepContext.result === true) {
            const medicineDetails = stepContext.options;
            return await stepContext.endDialog(medicineDetails);
        }
        return await stepContext.endDialog();
    }

    //isAmbiguous(timex) {
       // const timexPropery = new TimexProperty(timex);
        //return !timexPropery.types.has('definite');
    //}
}

module.exports.OrderMedicineDialog = OrderMedicineDialog;
