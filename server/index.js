const Server = require('@qtk/schema-tcp-framework').Server;
const log4js = require('log4js');
const manager = require('./manager');
const assert = require('assert');
const genuuid = require('uuid/v4');

module.exports = class  {
	constructor({host, port, logPath}) {
        log4js.configure({
            appenders: {
                runtime: logPath ? {
                    type: 'dateFile',
                    filename: `${logPath}/`,
                    pattern: "yyyy-MM-dd.log",
                    alwaysIncludePattern: true
                } : {
                    type: 'console'
                }
            },
            categories: {
                default: { appenders: ['runtime'], level: "ALL" }
            }
        });
        global.logger = log4js.getLogger();

        this._server = new Server({host: host, port: port});
        this._server.on("data", (socket, {uuid, data}) => {
            switch(data.command) {
                case 'publish':
                    this._handlePublish(socket, data);
                    break;
                case 'subscribe':
                    this._handleSubscribe(socket, data);
                    break;
                default:
                    break;
            }
        });
        this._server.on("closed", (socket) => {
            manager.removeSubscriber(socket);
        });
        this._server.on("exception", (socket, error) => {
            logger.error(`exception occurred at client(${socket.remoteAddress}:${socket.remotePort}): ${error.stack}`);
        });
    }

    start() {
        logger.info("server started");
        this._server.start();
    }

    _handlePublish(socket, {event, params}) {
        logger.info(`publish event[${event}] params:${JSON.stringify(params)}`);
        for (const subscriberSocket of manager.retieveSubscribers(event)) {
            this._server.send(subscriberSocket, {uuid: genuuid().replace(/-/g, ''), data: {event, params}});
        }
    }

    _handleSubscribe(socket, {events}) {
        logger.info(`${socket.remoteAddress}:${socket.remotePort} subscribed events[${events.join(",")}]`);
        manager.addSubscriber(socket, events);
    }
};
