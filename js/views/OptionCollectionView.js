var bb = bb || {};

(function (bb) {
	'use strict';

	bb.OptionCollectionView = bb.ACollectionView.extend({
		tagName: 'select',

		createView: function (model) {
			return new bb.OptionView({model: model});
		},

		getSelected: function () {
			var id = this.$el.val();
			return this.collection.get(id);
		},

		setSelected: function (toSelect) {
			var id = toSelect.get('id');
			this.$el.val(id);
		},
	});
}(bb));