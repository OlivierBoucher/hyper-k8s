/**
 * Created by olivier on 2016-12-13.
 */

exports.onApp = (app) => {
    console.log(app)
};

exports.decorateTerm = (Hyper, {React, notify}) => {
    const BottomBar = require('./src/components/BottomBar')(React);

    return class extends React.Component {
        constructor(props, context) {
            super(props, context)
        }

        render () {
            return React.createElement(Hyper, Object.assign({}, this.props, {
                padding: '20px',
                customChildren: [
                    <BottomBar key="wazz"/>
                ]
            }));
        }
    }
};