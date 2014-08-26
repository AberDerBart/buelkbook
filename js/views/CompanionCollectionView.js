var bb = bb || {};

(function (bb) {
	'use strict';

	bb.CompanionCollectionView = bb.ACollectionView.extend({
		tagName: 'ul',
		className: 'companion-collection',
		
		createView: function (model) {
			return new bb.CompanionView({model: model});
		},
	});
}(bb));