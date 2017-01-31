webpackHotUpdate(0,{

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _Paper = __webpack_require__(61);

var _Paper2 = _interopRequireDefault(_Paper);

var _RaisedButton = __webpack_require__(199);

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _TextField = __webpack_require__(200);

var _TextField2 = _interopRequireDefault(_TextField);

var _reactRouter = __webpack_require__(527);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginForm = function (_React$Component) {
	_inherits(LoginForm, _React$Component);

	function LoginForm(props) {
		_classCallCheck(this, LoginForm);

		var _this = _possibleConstructorReturn(this, (LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call(this, props));

		_this.handleChange = function (e) {
			var _e$target = e.target,
			    name = _e$target.name,
			    value = _e$target.value;

			console.log("Changed: " + name + " -> " + JSON.stringify(value));
			_this.setState(_extends({}, _this.state, _defineProperty({}, name, value)));
		};

		_this.doLogin = function (ev) {
			console.log("Attemptifying to login...");
			console.log("In state: " + JSON.stringify(_this.state));
			_this.app.authenticate({
				type: 'local',
				email: _this.state.email,
				password: _this.state.password
			}).then(function () {
				_reactRouter.browserHistory.push('/');console.log("Loginized");
			}).catch(function (error) {
				return console.log("Errorated.");
			});
			ev.preventDefault();
		};

		_this.app = props.feathers;
		_this.state = { email: "", password: "" };
		return _this;
	}

	// componentDidMount() {

	// };

	_createClass(LoginForm, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				_Paper2.default,
				null,
				_react2.default.createElement(
					'h2',
					null,
					'Lag in'
				),
				_react2.default.createElement(
					'form',
					{ onSubmit: this.doLogin },
					_react2.default.createElement(_TextField2.default, {
						name: 'email',
						hintText: 'Email',
						floatingLabelText: 'Email',
						value: this.state.email,
						onChange: this.handleChange
					}),
					_react2.default.createElement(_TextField2.default, {
						type: 'password',
						name: 'password',
						hintText: 'Password',
						floatingLabelText: 'Password',
						value: this.state.password,
						onChange: this.handleChange
					}),
					_react2.default.createElement(_RaisedButton2.default, { label: 'Login', onClick: this.doLogin, primary: true })
				),
				_react2.default.createElement(
					_reactRouter.Link,
					{ to: '/signup' },
					'Sign up'
				)
			);
		}
	}]);

	return LoginForm;
}(_react2.default.Component);

;

exports.default = LoginForm;

/***/ })

})