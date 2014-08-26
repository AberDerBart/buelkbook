var bb = bb || {};


(function (bb) {
	'use strict';

	bb.Router = Backbone.Router.extend({
		routes: {
			'': 'showHome',
			'attendee/new': 'showAttendeeCreate',
			'attendee/:id': 'showAttendeeEdit',
			'*path': 'showError'
		},
		initialize: function (appView) {
			this.appView = appView;

			this.route(/(.*)\/+$/, 'removeTrailingSlashes', function (path) {
				path = path.replace(/(\/)+$/, '');
				this.navigate(path, true);
			});
		},
		showAttendeeCreate: function () {
			this.appView.showAttendeeCreate();
		},
		showAttendeeEdit: function (id) {
			this.appView.showAttendeeEdit(id);
		},
		showHome: function () {
			this.appView.showHome();
		},
		showError: function (path) {
			alert('No way!');
		},
	});
	
}(bb));