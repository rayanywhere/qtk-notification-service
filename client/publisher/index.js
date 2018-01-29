const Client = require('@qtk/schema-tcp-framework').Client;
const genuuid = require('uuid/v4');

module.exports = class {
    constructor({host, port}) {
        this._client = new Client({host, port});
    }

    publish(event, params = undefined) {
        this._client.send({
            uuid: genuuid().replace(/-/g, ''),
            data: {
                command: 'publish',
                event,
                params
            }
        });
    }
};
