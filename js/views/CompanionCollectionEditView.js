var bb = bb || {};

(function (bb) {
	'use strict';

	bb.CompanionCollectionEditView = bb.ACollectionView.extend({
		tagName: 'div',

		initialize: function (options) {
			this._super.apply(this, arguments);

			this.options = options.options;
			this.meals = options.meals;

			this.listenTo(this.collection, 'change', this.handleChange);

			this.handleChange();
		},

		handleChange: function () {
			var last = this.collection.at(this.collection.length - 1);
			if (!last || last.get('name') != '') {
				var companion = new bb.Companion();
				companion.set('option', this.options.at(0));
				companion.get('meals').add(this.meals.models);
				this.collection.add(companion);
			}
		},

		createView: function (model) {
			return new bb.CompanionEditView({
				model: model, 
				options: this.options,
				meals: this.meals
			});
		},

		remove: function () {
			this._super.apply(this, arguments);
		},

		getCompanions: function () {
			var lastIndex = this.collection.length - 1;
			return this.collection.filter(function (companion, i) {
				return i != lastIndex || companion.get('name') != '';
			});
		},
	});
}(bb));
