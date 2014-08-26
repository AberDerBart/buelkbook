var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollectionTotalView = Backbone.View.extend({
		tagName: 'div',
		template: _.template('<div>Bis jetzt <%= total !== 1 ? "sind" : "ist" %>  <%- total %> Person<%= total !== 1 ? "en" : "" %> angemeldet!</div>'),

		initialize: function () {
			this.listenTo(this.collection, 'change add remove', this.render);
		},

		render: function () {
			var total = this.collection.reduce(function (memo, attendee) {
				return 1 + memo + attendee.get('companions').length;
			}, 0);

			this.$el.html(this.template({
				total: total,
			}));
			
			return this;
		},
	});
}(bb));