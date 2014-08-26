var bb = bb || {};

(function (bb) {
	'use strict';

	bb.Companion = Backbone.RelationalModel.extend({
		defaults: {
			name: "",
		},
	});
}(bb));