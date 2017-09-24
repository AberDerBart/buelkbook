var bb = bb || {};

(function (bb) {
	'use strict';

	bb.OptionCollectionView = bb.ACollectionView.extend({
		tagName: 'select',

		events: {
			'change': 'updateCompanionOption'
		},

		initialize: function (options) {
			this._super.apply(this, arguments);

			this.companion = options.companion;
		},

		render: function () {
			var result =  this._super.apply(this, arguments);

			var id = (this.companion.get('option') && this.companion.get('option').id) || this.collection.at(0).id;
			this.$el.val(id);

			return result;
		},

		createView: function (model) {
			return new bb.OptionView({model: model});
		},

		updateCompanionOption: function () {
			var id = this.$el.val();
			this.companion.set('option', this.collection.get(id));
		},
	});
}(bb));