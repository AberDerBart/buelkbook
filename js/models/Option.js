var bb = bb || {};

(function (bb) {
	'use strict';

	bb.Option = Backbone.RelationalModel.extend({
		defaults: {
			id: '',
		},
	});
}(bb));