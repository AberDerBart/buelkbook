var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollectionTotalView = Backbone.View.extend({
		tagName: 'p',
		template: _.template('Bis jetzt <%= total !== 1 ? "sind" : "ist" %>  <%- total %> Person<%= total !== 1 ? "en" : "" %> angemeldet!'),

		initialize: function (options) {
			this.listenTo(this.collection, 'change add remove', this.render);
		},

		render: function () {
			var total = this.collection.reduce(function (memo, attendee) {
				return memo + attendee.get('companions').length;
			}, 0);

			this.$el.html(this.template({
				total: total,
			}));
			
			return this;
		},
	});
}(bb));