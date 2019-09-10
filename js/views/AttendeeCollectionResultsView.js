var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollectionResultsView = Backbone.View.extend({
		tagName: 'div',
		className: 'attendee-collection-results',
		template: _.template($('#template-AttendeeCollectionResultsView').html()),

		initialize: function (options) {
			this.options = options.options;
			this.meals = options.meals;

			this.listenTo(this.collection, 'change add remove', this.render);
		},

		render: function () {
			this.$el.html(this.template({
				votes: this.getVotes(),
				meals: this.getMeals(),
			}));
			
			return this;
		},

		getVotes: function () {
			var optionToVotes =  _.reduce(this.getAllCompanions(), function (memo, companion) {
					var id = companion.get('option').get('id');
					memo[id] = (memo[id] || 0) + 1;
					return memo;
				}, {})
			;

			var votes = this.options.map(function (option) {
				var key = option.id;
				return {
					optionId: key,
					votes: optionToVotes[key] || 0,
				};
			});

			return _.sortBy(votes, function (options) {
				return -options.votes;
			});
		},

		getMeals: function () {
			var mealsToCount = _.reduce(this.getAllCompanions(), function (memo, companion) {
					var ids = companion.get('meals').map('id');
					_.forEach(ids, function (id) {
						memo[id] = (memo[id] || 0) + 1;
					});
					return memo;
				}, [])
			;

			var meals = this.meals.map(function (meal) {
				var key = meal.id;
				return {
					mealId: key,
					count: mealsToCount[key],
				};
			});

			return meals;
		},

		getAllCompanions: function () {
			return _.chain(this.collection.models)
				.map(function (attendee) {
					return attendee.getAttendingCompanions()
				})
				.flatten()
				.value();
		},
	});
}(bb));