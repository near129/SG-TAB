const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


module.exports = {
    entry: {
        popup: path.join(__dirname, "..", "src", "popup", "index.tsx"),
        background: path.join(__dirname, "..", "src", "background.ts"),
    },
    output: {
        path: path.join(__dirname, "..", "build"),
        filename: "[name].bundle.js",
        clean: true
    },
    // optimization: {
    //     splitChunks: {
    //         name: "vendor",
    //         chunks(chunk) {
    //             return chunk.name !== "background";
    //         }
    //     },
    // },
    module: {
        rules: [
            // {
            //     test: /\.html$/,
            //     loader: "html-loader",
            //     exclude: /node_modules/,
            // },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{ from: path.join(__dirname, "..", "src", "manifest.json"), to: path.join(__dirname, "..", "build") }],
        }),
        new HtmlWebPackPlugin({
            template: path.join(__dirname, "..", "src", "popup", "index.html"),
            filename: "popup.html",
            chunks: ["popup"],
            caches: false
        })
    ],
};
