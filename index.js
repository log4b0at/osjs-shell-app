import ShellCore from 'osjs-shell-core';
import { EventEmitter } from 'events';
import path from 'path';

export default class ShellApp extends EventEmitter {

	constructor(appname) {
		super();
		this.appname = appname;
		if (!this.appname) {
			throw new Error("A ShellApp need to be construct with a name.\nEx: new ShellApp('myShellApp') ");
		}
	}

	start() {
		let build = this;

		OSjs.make('osjs/packages').register(build.appname, (core, args, options, metadata) => {
			build.process = core.make('osjs/application', {
				args,
				options,
				metadata
			});

			build.createWindow(core);
			build.emit('started');

			return build.process;
		});
	}

	createWindow(core) {
		let _window = this.process.createWindow({
			id: 'ShellWindow_' + this.appname.replace(/\s/g, '_'),
			title: 'Shell - ' + this.appname,
			dimension: { width: 550, height: 400 },
			position: { left: 300, top: 200 }
		})
			.on('destroy', () => this.process.destroy())
			.render((container, windowInstance) => {
				this.window = windowInstance;
				this.createShellCore(core, windowInstance, container);
				this.emit('done');
			});
		this.window = _window;
		_window.setIcon(path.join(__dirname, 'assets/vectors/shell.svg'));
	}

	createShellCore(appCore, windowInstance, container) {
		this.core = new ShellCore();
		container.appendChild(this.core.element);
	}
}