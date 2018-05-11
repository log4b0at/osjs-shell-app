import ShellCore from 'osjs-shell-core';

export default class ShellApp {
	
	constructor(appname){
		this.appname = appname;
		if(!this.appname) {
			throw new Error("A ShellApp need to be construct with a name.\nEx: new ShellApp('myShellApp') ");
		}
	}
	
	start(){
		
		let build = this;
		
		OSjs.make('osjs/packages').register(this.appname, (core, args, options, metadata) => {
			build.process = core.make('osjs/application', {
				args,
				options,
				metadata
			});
		});
		
		this.createWindow(core);
	}
	
	createWindow(core){
		this.process.createWindow({
			id: 'ShellWindow_'+this.appname,
			title: metadata.title.en_EN,
			dimension: {width: 550, height: 400},
			position: {left: 300, top: 200}
		});
		.on('destroy', () => this.process.destroy())
		.render((container, windowInstance) => this.createShellCore(core, windowInstance, container));
		;
	}
	
	createShellCore(appCore, windowInstance, container){
		this.core = new ShellCore();
		container.appendChild(this.core.element);
	}
}