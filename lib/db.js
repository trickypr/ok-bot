const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

class DB {
	constructor(location) {
		this.adapter = new FileSync(location)
		this.db = low(this.adapter)

		this.db
			.defaults({count: 0, active: true})
			.write()
	}

	getCount() {
		return this.db
			.get('count')
			.value()
	}

	getActive() {
		return this.db
			.get('active')
			.value()
	}

	incrementCount() {
		return this.db
			.update('count', n => n + 1)
			.write()
	}

	toggleActive() {
		return this.db
			.update('active', a => !a)
			.write()
	}
}

module.exports = DB