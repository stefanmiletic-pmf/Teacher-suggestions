//noinspection JSUnusedGlobalSymbols
var MessageController = {
	
	actionNewFeed: function(params) {
        Message.add(params['author'], params['text'], params['datetime']);
	},
	
    actionAdd: function (params) {
        Message.add(params['author'], params['text'], params['datetime']);
    },
    actionLoadHistory: function (params) {
        params.forEach(function (message) {
            Message.add(message['author'], message['text'], message['datetime'])
        });
    }
};