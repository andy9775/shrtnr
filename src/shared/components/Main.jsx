/**
 * An opensource URL shortener
 *
 * Coded by: Andy (github.com/andy9775)
 */
/*
Outermost router wrapper
*/

import React from 'react';

export class Main extends React.Component{
  render(){
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}