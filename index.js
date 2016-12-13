/**
 * Created by olivier on 2016-12-13.
 */

exports.onApp = (app) => {
    console.log(app)
};

exports.decorateTerm = (Term, { React, notify }) => {
    return class extends React.Component {
        constructor(props, context) {
            super(props, context);

            this._onTerminal = this._onTerminal.bind(this);
        }

        _onTerminal (term) {
            if (this.props.onTerminal) this.props.onTerminal(term);

            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.bottom = 0;
            div.style.height = '50px';
            div.style.width = '100%';
            div.style.backgroundColor = 'red';

            document.body.appendChild(div);

            term.div_.parentElement.style.paddingBottom = "62px"
        }

        render () {
            return React.createElement(Term, Object.assign({}, this.props, {
                onTerminal: this._onTerminal
            }));
        }
    }
};