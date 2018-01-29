const Client = require('@qtk/schema-tcp-framework').Client;
const genuuid = require('uuid/v4');

module.exports = class {
    constructor({host, port, subscriptions}) {
        this._client = new Client({host, port});
        this._client.on('connected', () => {
            this._client.send({uuid: genuuid().replace(/-/g, ''), data:{
                command: 'subscribe',
                events: Object.keys(subscriptions)
            }});

            this._subscriptions = subscriptions;
        });
        this._client.on('data', ({data: {event, params}}) => {
            if (typeof this._subscriptions[event] === "function") {
                this._subscriptions[event](params);
            }
        });
    }
};
