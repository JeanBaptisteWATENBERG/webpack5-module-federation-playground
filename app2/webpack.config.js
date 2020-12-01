const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const DashboardPlugin = require("@module-federation/dashboard-plugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8083/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devtool: "source-map",

  devServer: {
    port: 8083,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      filename: "remoteEntry.js",
      remotes: {
        shell: "shell@http://localhost:8080/remoteEntry.js",
        // nav: "nav@http://localhost:8081/remoteEntry.js",
      },
      exposes: {
        "./Widget": "./src/Widget",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new DashboardPlugin({
      filename: "dashboard.json",
      dashboardURL: "http://localhost:3000/api/update",
      metadata: {
        source: {
          url: "https://github.com/?/app2",
        },
        remote: "http://localhost:8083/remoteEntry.js",
      },
    }),
  ],
};
