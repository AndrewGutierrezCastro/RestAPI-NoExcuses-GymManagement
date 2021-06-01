export class Client {
    
    // TODO: completar todos los campos del cliente
    constructor(
        public pendingPayment : string[],
        public balance : Uint16Array,
        public _id? : string,
    ) {}
}