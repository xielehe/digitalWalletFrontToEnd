import React from 'react';
import View from "views/pages/View";
import Eth from "views/pages/eth/Index.jsx";

export default [
  {id: 'btc', Icon: (props) => <span {...props} >B</span>, text: 'BTC', page: View},
  {id: 'eth', Icon: (props) => <span {...props} >E</span>, text: 'ETH', page: Eth},
]