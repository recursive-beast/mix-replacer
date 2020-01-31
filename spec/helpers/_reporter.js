const SpecReporter = require("jasmine-spec-reporter").SpecReporter;

jasmine.getEnv().clearReporters(); // remove default reporter logs

jasmine.getEnv().addReporter(
	// add jasmine-spec-reporter
	new SpecReporter({
		spec: {
			displayPending: true
		}
	})
);
