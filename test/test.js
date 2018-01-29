const Server = require('../server');
const PublisherClient = require('../client').Publisher;
const SubscriberClient = require('../client').Subscriber;
const assert = require('assert');
const host = "127.0.0.1";
const port = 50009;

describe('#register-service', async function() {
    before(function() {
        let server = new Server({host, port});
        server.start();
    });

    describe("testing pub/sub", function() {
        it("should return without error", function(done) {
            const subscriberClient = new SubscriberClient({host, port, subscriptions: {
                "echo": (params) => {
                    if (params.message === 'hello') {
                        done();
                    }
                }
            }});
            setTimeout(() => {
                const publisherClient = new PublisherClient({host, port});
                publisherClient.publish("echo", {message: "hello"});    
            }, 200);
        });
    });
});