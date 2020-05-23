const { LuisRecognizer } = require('botbuilder-ai');

class GetMedicineRecogniser {
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            // Set the recognizer options depending on which endpoint version you want to use e.g v2 or v3.
            // More details can be found in https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/luis-migration-api-v3
            const recognizerOptions = {
                apiVersion: 'v3'
            };

            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeLuisQuery(context) {
        return await this.recognizer.recognize(context);
    }

    getBrand(result) {
        let brandValue;
        if (result.entities.$instance.brand) {
            brandValue = result.entities.$instance.brand[0].text;
        }
        //if (fromValue && result.entities.From[0].Airport) {
        //    fromAirportValue = result.entities.From[0].Airport[0][0];
        //}

        return  brandValue;
    }

    getFormType(result) {
        let FormTypeValue;
        if (result.entities.$instance.Form_Type) {
            FormTypeValue = result.entities.$instance.Form_Type[0].text;
        }
        //console.log("inside get form",result,result.entities.$instance.Form_Type,FormTypeValue,result.entities.$instance.Form_Type[0].text)
        return  FormTypeValue;
    }

    getStrengthofMedicine(result) {
        let strengthValue;
        if (result.entities.$instance.number) {
            strengthValue = result.entities.$instance.number[0].text;
        }
        // if (strengthValue && result.entities.StrengthofMedicine[0].number) {
        //    strengthNumberValue = result.entities.StrengthofMedicine[0].number;
        // }
        //console.log("inside get form",result.entities.$instance.StrengthofMedicine,result.entities.$instance.number[0].text)
        return strengthValue ;
    }
}

module.exports.GetMedicineRecogniser = GetMedicineRecogniser;
