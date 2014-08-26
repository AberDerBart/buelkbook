var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeCollectionView = bb.ACollectionView.extend({
		tagName: 'section',
		structure: $('#template-AttendeeCollectionView').html(),

		initialize: function () {
			this._super.apply(this, arguments);
			this.totalView = new bb.AttendeeCollectionTotalView({collection: this.collection});
		},

		render: function () {
			this.$el.html(this.structure);

			this.$collectionEl = this.$('.js--attendee-collection__table');
			
			this.$('.js--attendee-collection__total').html(this.totalView.render().el);

			return this._super.apply(this, arguments);
		},

		createView: function (model) {
			return new bb.AttendeeTableRowView({model: model});
		},

		remove: function () {
			this.totalView.remove();
			this._super.apply(this, arguments);
		},
	});
}(bb));