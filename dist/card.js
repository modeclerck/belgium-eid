"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pkcs11js = require("pkcs11js");
var Card = /** @class */ (function () {
    function Card() {
        this.firstnames = this.surname = this.cardNumber = this.chipNumber = this.nationalNumber = "";
        this.readCard();
    }
    Card.prototype.initPkcs11 = function () {
        try {
            Card.pkcs11.load("C:\\Windows\\System32\\beidpkcs11.dll");
            Card.pkcs11.C_Initialize();
        }
        catch (error) {
        }
    };
    Card.prototype.readCard = function () {
        this.initPkcs11();
        var slots = Card.pkcs11.C_GetSlotList(true);
        var slot = slots[0];
        var session = Card.pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
        Card.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
        var hObject = Card.pkcs11.C_FindObjects(session);
        while (hObject) {
            var attrs = Card.pkcs11.C_GetAttributeValue(session, hObject, [
                { type: pkcs11js.CKA_LABEL },
                { type: pkcs11js.CKA_VALUE }
            ]);
            if (attrs[0].value !== undefined) {
                switch (attrs[0].value.toString()) {
                    case "national_number":
                        this.nationalNumber = attrs[1].value !== undefined ? attrs[1].value.toString() : "";
                        break;
                }
            }
            hObject = Card.pkcs11.C_FindObjects(session);
        }
        Card.pkcs11.close();
    };
    Card.pkcs11 = new pkcs11js.PKCS11();
    return Card;
}());
exports.default = Card;
