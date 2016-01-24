var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollectionTotalView = Backbone.View.extend({
		tagName: 'div',
		template: _.template($('#template-AttendeeCollectionTotalView').html()),

		initialize: function () {
			this.listenTo(this.collection, 'change add remove', this.render);
		},

		render: function () {
			var total = this.collection.reduce(function (memo, attendee) {
				return 1 + memo + attendee.get('companions').length;
			}, 0);

			this.$el.html(this.template({
				total: total,
				votes: this.getVotes(),
			}));
			
			return this;
		},

		getVotes: function () {
			var optionToVotes = this.collection.reduce(function (memo, attendee) {
				var id = attendee.get('option').get('id');
				memo[id] = (memo[id] || 0) + attendee.get('companions').length + 1;
				return memo;
			}, []);

			var votes = Object.keys(optionToVotes).map(function (key) {
				return {
					optionId: key,
					votes: optionToVotes[key],
				};
			});

			return _.sortBy(votes, function (options) {
				return -options.votes;
			});
		}
	});
}(bb));