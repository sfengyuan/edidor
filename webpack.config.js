const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')
let config = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'static'),
    publicPath: '/'
  },
  devtool: 'inline-source-map',

  module: {
    rules: [
      { test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i, type: 'asset' },
      { test: /\.less$/i,
        use: [
          process.env.mode === 'development' ?
            "style-loader" :
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: '/' }
            },

          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "less-loader",
            options: { lessOptions: { strictMath: true } }
          }
        ],
      },
    ]
  },
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin(),
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    })
  ],
}
module.exports = config
