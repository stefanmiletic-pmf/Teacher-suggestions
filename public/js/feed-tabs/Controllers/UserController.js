//noinspection JSUnusedGlobalSymbols
class  UserController {
	
	static
    actionConnected(params) {
        console.log('System ' +  params['name'] + ' has connected.');
        User.add(params['id'], params['name']);
    }
	
	static
    actionDisconnected(params) {
        console.log('System ' +  params['name'] + ' has disconnected.');
		
		User.remove(params['id']);
    }
	
	
	static
    actionAlertUnknownCommand(params) {
		
        console.log('System: Command /' + params['command'] + ' has not been implemented yet ;)');
		
		Error.add('System: Command /' + params['command'] + ' has not been implemented yet ;)');
		
    }
	
	
	static
	actionExpiredSession(params) {
		
        console.log('System: Session expired.');
		window.open('/', '_parent');
		
		
	}
	
	static
	actionAuthMissing(params) {
		
        console.log('System: Auth missing.');
		window.open('/', '_parent');
		
	}
	
	static
	actionUserDuplicate(params) {
		
        console.log('System: User Duplicate.');
		window.open('/', '_parent');
		
	}
};