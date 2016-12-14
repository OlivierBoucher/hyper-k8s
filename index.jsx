/**
 * Created by olivier on 2016-12-13.
 */

exports.onApp = (app) => {
    console.log(app)
};

exports.decorateTerm = (Term, {React, notify}) => {
    const BottomBar = require('./src/components/BottomBar')(React);

    return class extends React.Component {
        constructor(props, context) {
            super(props, context)
        }

        render () {
            return React.createElement(Term, Object.assign({}, this.props, {
                padding: '12px 14px 32px 14px',
                customChildren: [
                    <BottomBar key="wazz"/>
                ]
            }));
        }
    }
};