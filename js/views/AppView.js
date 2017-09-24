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
			this.options = new bb.OptionCollection();
			this.meals = new bb.MealCollection();
			this.dataFetched = false;

			this._views = {};

			this._viewEls = {
				main: null,
				overlay: null,
			};

			// intialize main view
			this.setView('main', new bb.AttendeeCollectionView({
				collection: this.attendees,
				meals: this.meals,
				options: this.options,
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

		fetchDataIfNeeded: function () {
			if (!this.dataFetched) {
				return Promise.resolve(this.options.fetch())
					.then(_.bind(this.meals.fetch, this.meals))
					.then(_.bind(this.attendees.fetch, this.attendees))
					.then(_.bind(function () {
						this.dataFetched = true;
					}, this))
				;
			} else {
				return Promise.resolve(true);
			}
		},

		showAttendeeCreate: function () {
			this.fetchDataIfNeeded()
				.then(_.bind(function () {

					var attendee = new bb.Attendee();
					this.attendees.add(attendee);

					this.setView('overlay', new bb.AttendeeEditView({
						model: attendee,
						options: this.options,
						meals: this.meals,
					}));

					this.setOverlayShown(true);
				}, this))
				.catch(function (error) {
					console.log(error);
				})
			;
		},
		showAttendeeEdit: function (id) {
			this.fetchDataIfNeeded()
				.then(_.bind(function () {
					var attendee = this.attendees.add({id: id});

					this.setView('overlay', new bb.AttendeeEditView({
						model: attendee,
						options: this.options,
						meals: this.meals,
					}));

					this.setOverlayShown(true);
				}, this))
				.catch(function (error) {
					console.log(error);
				})
			;
		},
		showHome: function () {
			this.dataFetched = false;
			this.fetchDataIfNeeded();

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