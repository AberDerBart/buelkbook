var bb = bb || {};

(function (bb) {
	'use strict';

	bb.AttendeeTableRowView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template($('#template-AttendeeTableRowView').html()),
		templateControlsDefault: _.template($('#template-AttendeeTableRowView__controls--default').html()),
		templateControlsDelete: _.template($('#template-AttendeeTableRowView__controls--delete').html()),

		events: {
			'click .js--attendee-table-row__delete-show': 'showDelete',
			'click .js--attendee-table-row__delete-confirm': 'doDelete',
			'click .js--attendee-table-row__delete-abort': 'abortDelete',
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render);

			this.companionsView = new bb.CompanionCollectionView({collection: this.model.get('companions')});
		},

		render: function () {
			var json = this.model.toJSON();

			json.stuff = json.stuff
				.split("\n")
				.map(_.escape)
				.join('<br>')
			;
			json.controls = this.templateControlsDefault(json);
			this.$el.html(this.template(json));

			this.$('.js--attendee-table-row__companions').html(this.companionsView.render().el);

			return this;
		},

		remove: function () {
			this.companionsView.remove();
			return this._super.apply(this, arguments);
		},

		doDelete: function () {
			return Promise.resolve(this.model.destroy())
				.then(_.bind(function () {
					Backbone.history.navigate('/', true);
				}, this), function (error) {
					// TODO error indicator
					console.error(error);
					alert("fail");
					throw error;
				})
			;
		},

		showDelete: function () {
			this.$('.js--attendee-table-row__controls').html(this.templateControlsDelete(this.model.toJSON()));
		},

		abortDelete: function () {
			this.$('.js--attendee-table-row__controls').html(this.templateControlsDefault(this.model.toJSON()));
		},
	});
}(bb));