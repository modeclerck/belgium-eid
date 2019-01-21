/// <reference types="node" />
import EventEmitter = require('events');
import Card from './card';
export default class Reader extends EventEmitter {
    pcsc: any;
    device: any;
    card?: Card;
    constructor();
}
