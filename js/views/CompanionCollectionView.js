var bb = bb || {};

(function (bb) {
	'use strict';

	bb.CompanionCollectionView = bb.ACollectionView.extend({
		tagName: 'ul',
		className: 'companion-collection',
		
		initialize: function (options) {
			this._super.apply(this, arguments);

			this.meals = options.meals;
		},

		createView: function (model) {
			return new bb.CompanionView({
				model: model,
				meals: this.meals,
			});
		},
	});
}(bb));