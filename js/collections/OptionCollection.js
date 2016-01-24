var bb = bb || {};

(function (bb) {
	'use strict';

	bb.OptionCollection = Backbone.Collection.extend({
		model: bb.Option,
		url: '/api/option',
	});
}(bb));