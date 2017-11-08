import WebpackHotMiddleware from 'webpack-hot-middleware'
import _debug from 'debug'

const debug = _debug('app:server:webpack-hmr');

export default function (compiler, opts) {
  debug('Enable Webpack Hot Module Replacement (HMR).');

  const middleware = WebpackHotMiddleware(compiler, opts);
  return async function koaWebpackHMR (ctx, next) {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, ctx.res);

    if (hasNext && next) {
      await next()
    }
  }
}



function applyExpressMiddleware (fn, req, res) {
  const originalEnd = res.end;

  return new Promise((resolve) => {
    res.end = function () {
      originalEnd.apply(this, arguments);
      resolve(false)
    };
    fn(req, res, function () {
      resolve(true)
    })
  })
}
