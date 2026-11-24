module.exports = ({ config }) => process.env.YAFT_WEB_BUILD === '1'
  ? { ...config, experiments: { ...config.experiments, baseUrl: '/app' } }
  : config;
