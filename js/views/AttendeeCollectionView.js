var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollectionView = bb.ACollectionView.extend({
		tagName: 'section',
		structure: $('#template-AttendeeCollectionView').html(),

		initialize: function (options) {
			this.meals = options.meals;

			this._super.apply(this, arguments);
			this.totalView = new bb.AttendeeCollectionTotalView({
				collection: this.collection,
			});
			this.resultsView = new bb.AttendeeCollectionResultsView({
				collection: this.collection,
				options: options.options,
				meals: options.meals,
			});
		},

		render: function () {
			this.$el.html(this.structure);

			this.$collectionEl = this.$('.js--attendee-collection__table');
			
			this.$('.js--attendee-collection__total').html(this.totalView.render().el);
			this.$('.js--attendee-collection__results').html(this.resultsView.render().el);

			return this._super.apply(this, arguments);
		},

		createView: function (model) {
			return new bb.AttendeeTableRowView({
				model: model,
				meals: this.meals,
			});
		},

		remove: function () {
			this.totalView.remove();
			this.resultsView.remove();
			this._super.apply(this, arguments);
		},
	});
}(bb));