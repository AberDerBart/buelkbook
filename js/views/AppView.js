var app = app || {};

(function (app) {
	'use strict';

	bb.AppView = Backbone.View.extend({
		template: _.template($('#template-AppView').html()),

		events: {
			'click a[href^="/"]': 'navigate'
		},

		initialize: function () {
			this.attendees = new bb.AttendeeCollection();
			this.attendeesFetched = false;

			this.options = new bb.OptionCollection();
			this.options.add([{
				id: 'Käse'
			}, {
				id: 'Wurst'
			}])

			this._views = {};

			this._viewEls = {
				main: null,
				overlay: null,
			};

			// intialize main view
			this.setView('main', new bb.AttendeeCollectionView({
				collection: this.attendees,
			}));
		},
		render: function () {
			this.$el.html(this.template());

			this._viewEls.main = this.$('.js--app-view__main');
			this._viewEls.overlay = this.$('.js--app-view__overlay');

			_(this._viewEls)
			.keys()
			.forEach(
				_.bind(function (viewName) {
					if (this._views[viewName]) {
						this._viewEls[viewName].html(this._views[viewName].render().el);
					}
				}, this)
			);

			return this;
		},

		navigate: function (e) {
			var url;
			if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
				e.preventDefault();
				url = $(e.currentTarget).attr('href').replace(/^\//, "");
				Backbone.history.navigate(url, {
					trigger: true
				});
			}
		},	

		fetchAttendeesIfNeeded: function () {
			if (!this.attendeesFetched) {
				return Promise.resolve(this.attendees.fetch())
					.then(_.bind(function () {
						this.attendeesFetched = true;
					}, this))
				;
			} else {
				return Promise.resolve(true);
			}
		},

		showAttendeeCreate: function () {
			this.fetchAttendeesIfNeeded()
				.then(_.bind(function () {

					var attendee = new bb.Attendee();
					attendee.set('option', this.options.at(0));
					this.attendees.add(attendee);

					this.setView('overlay', new bb.AttendeeEditView({
						model: attendee,
						options: this.options,
					}));

					this.setOverlayShown(true);
				}, this), function () {
					console.log(arguments);
				})
			;
		},
		showAttendeeEdit: function (id) {
			this.fetchAttendeesIfNeeded()
				.then(_.bind(function () {
					var attendee = this.attendees.add({id: id});

					this.setView('overlay', new bb.AttendeeEditView({
						model: attendee,
						options: this.options,
					}));

					this.setOverlayShown(true);
				}, this))
			;
		},
		showHome: function () {
			this.attendeesFetched = false;
			this.fetchAttendeesIfNeeded();

			this.setOverlayShown(false);
			this.removeView('overlay');
		},

		setOverlayShown: function (isShown) {
			if (isShown) {
				this.$el.addClass('app-view--overlay-visible');
			} else {	
				this.$el.removeClass('app-view--overlay-visible');
			}
		},


		getView: function (name) {
			return this._views[name];
		},
		setView: function (name, view) {
			// save new view
			this.removeView(name);
			this._views[name] = view;

			// render new view
			if (this._viewEls[name]) {
				this._viewEls[name].html(this._views[name].render().el);
			}
		},
		removeView: function (name) {
			if (this._views[name]) {
				this._views[name].remove();
				delete this._views[name];
			}
		},
		removeAllViews: function () {
			_(this._viewEls).keys().forEach(_.bind(function (name) {
				this.removeView(name);
			}, this));
		},
	});
}(bb));