var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollection = Backbone.Collection.extend({
		model: bb.Attendee,
		url: '/api/attendee',
	});
}(bb));