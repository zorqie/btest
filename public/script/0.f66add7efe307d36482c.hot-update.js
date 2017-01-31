webpackHotUpdate(0,{

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(33);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _MuiThemeProvider = __webpack_require__(207);

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _AppBar = __webpack_require__(205);

var _AppBar2 = _interopRequireDefault(_AppBar);

var _Divider = __webpack_require__(206);

var _Divider2 = _interopRequireDefault(_Divider);

var _FlatButton = __webpack_require__(554);

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _colors = __webpack_require__(60);

var _venueForm = __webpack_require__(491);

var _venueForm2 = _interopRequireDefault(_venueForm);

var _loginForm = __webpack_require__(490);

var _loginForm2 = _interopRequireDefault(_loginForm);

var _signupForm = __webpack_require__(553);

var _signupForm2 = _interopRequireDefault(_signupForm);

var _reactRouter = __webpack_require__(527);

var _reactTapEventPlugin = __webpack_require__(208);

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactTapEventPlugin2.default)();

// touchy-screen stuff 


var feathers = __webpack_require__(204);
var auth = __webpack_require__(201);
var socketio = __webpack_require__(203);
var hooks = __webpack_require__(202);
var io = __webpack_require__(209);

// Establish a Socket.io connection
// const socket = io('http://localhost:3017');
var socket = io('https://fathomless-gorge-78924.herokuapp.com/');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
var app = feathers().configure(socketio(socket)).configure(hooks())
// Use localStorage to store our login token
.configure(auth({ storage: window.localStorage }));

var Layout = _react2.default.createClass({
	displayName: 'Layout',
	render: function render() {
		return _react2.default.createElement(
			_MuiThemeProvider2.default,
			null,
			_react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(_AppBar2.default, {
					title: 'Ze App',
					iconElementRight: _react2.default.createElement(
						'span',
						null,
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/login' },
							_react2.default.createElement(_FlatButton2.default, { label: 'Login' })
						),
						_react2.default.createElement(_FlatButton2.default, { onClick: app.logout, label: 'Logout' })
					) }),
				_react2.default.createElement(
					'ul',
					null,
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/login' },
							_react2.default.createElement(_FlatButton2.default, { label: 'Login' })
						)
					),
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement(_FlatButton2.default, { onClick: app.logout, label: 'Logout' })
					),
					_react2.default.createElement(
						'li',
						null,
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/signup' },
							'Signup'
						)
					)
				),
				this.props.children,
				_react2.default.createElement(
					'footer',
					null,
					'Footing business goes here'
				)
			)
		);
	}
});

var Home = function Home(props) {
	return _react2.default.createElement(
		'p',
		null,
		'We\'re home'
	);
};

app.authenticate().then(function () {
	console.log("Authentificated.");
	_reactDom2.default.render(_react2.default.createElement(
		_reactRouter.Router,
		{ history: _reactRouter.browserHistory },
		_react2.default.createElement(
			_reactRouter.Route,
			{ path: '/', component: Layout },
			_react2.default.createElement(_reactRouter.IndexRoute, { component: Home }),
			_react2.default.createElement(_reactRouter.Route, { path: 'login', component: _loginForm2.default }),
			_react2.default.createElement(_reactRouter.Route, { path: 'signup', component: _signupForm2.default })
		)
	), document.getElementById("app"));
}).catch(function (error) {
	console.log("Not happening.", error);
	_reactDom2.default.render(_react2.default.createElement(
		_MuiThemeProvider2.default,
		null,
		_react2.default.createElement(_loginForm2.default, { feathers: app })
	), document.getElementById("app"));
});

/***/ })

})