/*
 Home Page
 */

import React, { Component } from 'react';
import styles from './style';
import URLForm from './Elements/URLForm';

export default class Home extends Component {
	render() {
		return (
			<div style={ styles.container }>
				<URLForm />
				<div />
			</div>
		);
	}

}
