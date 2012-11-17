// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var Dispatch, Lock, TcpTransport, iced, net, __iced_k, __iced_k_noop,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-coffee-script').iced;
  __iced_k = __iced_k_noop = function() {};

  net = require('net');

  Lock = require('./lock').Lock;

  Dispatch = require('./dispatch').Dispatch;

  exports.TcpTransport = TcpTransport = (function(_super) {

    __extends(TcpTransport, _super);

    function TcpTransport(_arg) {
      this.port = _arg.port, this.host = _arg.host, this.tcp_opts = _arg.tcp_opts, this.tcp_stream = _arg.tcp_stream, this.log_hook = _arg.log_hook, this.parent = _arg.parent;
      TcpTransport.__super__.constructor.apply(this, arguments);
      if (!this.host || this.host === "-") this.host = "127.0.0.1";
      if (!this.tcp_opts) this.tcp_opts = {};
      this.tcp_opts.host = this.host;
      this.tcp_opts.port = this.port;
      this._remote_str = [this.host, this.port].join(":");
      this._lock = new Lock();
      this._write_closed_warn = false;
      this._generation = 1;
    }

    TcpTransport.prototype.remote = function() {
      return this._remote_str;
    };

    TcpTransport.prototype._warn = function(err) {
      var fn;
      fn = this._opts.log_hook || console.log;
      return fn("TcpTransport(" + this._remote_str + "): " + err);
    };

    TcpTransport.prototype.connect = function(cb) {
      var res, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/transport.iced",
          funcname: "TcpTransport.connect"
        });
        _this._lock.acquire(__iced_deferrals.defer({
          lineno: 38
        }));
        __iced_deferrals._fulfill();
      })(function() {
        (function(__iced_k) {
          if (!(_this.tcp_stream != null)) {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "src/transport.iced",
                funcname: "TcpTransport.connect"
              });
              _this._connect_critical_section(__iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    return res = arguments[0];
                  };
                })(),
                lineno: 41
              }));
              __iced_deferrals._fulfill();
            })(__iced_k);
          } else {
            return __iced_k(res = true);
          }
        })(function() {
          _this._lock.release();
          return cb(res);
        });
      });
    };

    TcpTransport.prototype._connect_critical_section = function(cb) {
      var CLS, CON, ERR, err, ok, rv, rv_id, x, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      x = new net.createConnection(this.tcp_opts, __iced_deferrals.defer({
        lineno: 49
      }));
      if (!this._opts.delay) x.setNoDelay(true);
      _ref = [0, 1, 2], CON = _ref[0], ERR = _ref[1], CLS = _ref[2];
      rv = new iced.Rendezvous;
      x.on('connect', rv.id(CON).__iced_deferrals.defer({
        lineno: 57
      }));
      x.on('error', rv.id(ERR).__iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return err = arguments[0];
          };
        })(),
        lineno: 58
      }));
      x.on('close', rv.id(CLS).__iced_deferrals.defer({
        lineno: 59
      }));
      ok = false;
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/transport.iced",
          funcname: "TcpTransport._connect_critical_section"
        });
        rv.wait(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return rv_id = arguments[0];
            };
          })(),
          lineno: 64
        }));
        __iced_deferrals._fulfill();
      })(function() {
        switch (rv_id) {
          case CON:
            ok = true;
            break;
          case ERR:
            _this._warn(err);
            break;
          case CLS:
            _this._warn("connection closed during open");
        }
        if (ok) {
          x.on('error', function(err) {
            return _this.handle_error(err);
          });
          x.on('close', function() {
            return _this.handle_close();
          });
          x.on('data', function(msg) {
            return _this.packetize_data(msg);
          });
          _this.tcp_stream = x;
          _this._write_closed_warn = false;
          _this._generation++;
        }
        return cb(ok);
      });
    };

    TcpTransport.prototype._fatal = function(err) {
      var x;
      this._warn(err);
      if (this.tcp_stream) {
        x = this.tcp_stream;
        this.tcp_stream = null;
        return x.end();
      }
    };

    TcpTransport.prototype._raw_write = function(msg, encoding) {
      if (this.tcp_stream) {
        return this.tcp_stream.write(msg, encoding);
      } else if (!this._write_closed_warn) {
        this._write_closed_warn = true;
        return this._warn("attempt to write to closed connection");
      }
    };

    return TcpTransport;

  })(Dispatch);

}).call(this);