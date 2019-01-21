import pcsclite = require('@pokusew/pcsclite');
import EventEmitter = require('events');
import Card from './card';

export default class Reader extends EventEmitter {

    pcsc: any;
    device: any;
    card?: Card;

    constructor() {

        super();

        this.pcsc = pcsclite();

        this.pcsc.on('reader', (reader: any) => {

            this.device = reader;          

            this.emit('reader-plugged', reader);

            reader.on('end', () => {
                this.emit('reader-unplugged', reader);
            })

            reader.on('error', (error: any) => {
                this.emit('error', {reader, error});
            })

            reader.on('status', (status: any) => {

                const changes = reader.state ^ status.state;
    
                if (changes) {
        
                    if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {   
    
                        reader.disconnect(reader.SCARD_LEAVE_CARD, (err: any) => {
            
                            if (err) {
                                this.emit('error', err)
                            } else {
                                this.emit('card-removed', this.card)
                            }
    
                        });
                    }
    
                    if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
    
                        reader.connect({ share_mode: reader.SCARD_SHARE_SHARED }, (err: any, protocol: any) => {
    
                            if (err) {
                                this.emit('error', err)
                            } else {
                                this.card = new Card();
                                this.emit('card-inserted', this.card)
                            }
    
                        });
                    }
                }
            });

        })

        this.pcsc.on('error', (error: any) => {
            this.emit('error', {error});
        })

    }

};