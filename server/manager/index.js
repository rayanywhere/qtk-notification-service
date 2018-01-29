const event2subscribers = new Map();
const subscriber2events = new Map();

module.exports = class {
    static addSubscriber(socket, events) {
        for (const event of events) {
            if (!event2subscribers.has(event)) {
                event2subscribers.set(event, new Set());
            }
            event2subscribers.get(event).add(socket);
        }
        
        subscriber2events.set(socket, events);
    }

    static removeSubscriber(socket) {
        const events = subscriber2events.get(socket);
        if (events === undefined) {
            return;
        }

        for (const event of events) {
            if (event2subscribers.has(event)) {
               event2subscribers.get(event).delete(socket);
            }
        }
    }

    static retieveSubscribers(event) {
        if (event2subscribers.has(event)) {
            return event2subscribers.get(event);
        }
        return [];
    }
}