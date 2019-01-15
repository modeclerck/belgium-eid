import pkcs11js = require("pkcs11js");

class Card {

    static pkcs11: pkcs11js.PKCS11 = new pkcs11js.PKCS11();

    firstnames: string;
    surname: string;
    cardNumber: string;
    chipNumber: string;
    nationalNumber: string;

    constructor() {
        this.firstnames = this.surname = this.cardNumber = this.chipNumber = this.nationalNumber = "";
        this.readCard();
    }

    private initPkcs11(): void {
        try {
            Card.pkcs11.load("C:\\Windows\\System32\\beidpkcs11.dll");
            Card.pkcs11.C_Initialize();
        } catch (error) {
        }
    }

    private readCard(): void {
       
        this.initPkcs11();
        
        var slots = Card.pkcs11.C_GetSlotList(true);
        var slot = slots[0];
        var session = Card.pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
        Card.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
        var hObject = Card.pkcs11.C_FindObjects(session);

        while (hObject) {

            let attrs = Card.pkcs11.C_GetAttributeValue(session, hObject, [
                { type: pkcs11js.CKA_LABEL },
                { type: pkcs11js.CKA_VALUE }
            ]);

            if(attrs[0].value !== undefined) {
                switch (attrs[0].value.toString()) {
                    case "national_number":
                        this.nationalNumber = attrs[1].value !== undefined ? attrs[1].value.toString() : "";
                        break;
                }
            }
            
            hObject = Card.pkcs11.C_FindObjects(session);
        }

        Card.pkcs11.close();
    }

}

export default Card;