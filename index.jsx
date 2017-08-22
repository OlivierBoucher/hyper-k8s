/**
 * Created by olivier on 2016-12-13.
 */
const fs = require('fs');
const watch = require('node-watch');
const yaml = require('js-yaml');

const ActionK8sContextChanged = "K8S_CONTEXT_CHANGED"

exports.onApp = (app) => {
    console.log(app)
};

exports.onWindow = (BrowserWindow) => {
    const kubeConfigPath = '/Users/olivier/.kube/config'

    const getKubeConfig = () => yaml.safeLoad(fs.readFileSync(kubeConfigPath, 'utf8'));
    const emitConfig = () => {
        const config = getKubeConfig();
        const context = config.contexts.find(x => x.name === config['current-context']).context
        const clusterSplit = context.cluster.split('_');

        BrowserWindow.rpc.emit("KUBE_STATE_CHANGE", {
            namespace: context.namespace || 'default',
            cluster: clusterSplit[clusterSplit.length -1],
        })
    }

    watch(kubeConfigPath, {}, (event, file) => {
        emitConfig();
    })
    setTimeout(() => {
        emitConfig();
    }, 2000);
}

exports.decorateTerm = (Term, { React, notify }) => {
    const BottomBar = require('./src/components/BottomBar')(React);

    return class extends React.Component {
        constructor(props, context) {
            super(props, context)

            window.rpc.on('KUBE_STATE_CHANGE', (kubeState) => {
                window.store.dispatch({
                    type: ActionK8sContextChanged,
                    value: kubeState,
                });
            });
        }

        render() {
            return React.createElement(Term, Object.assign({}, this.props, {
                padding: '12px 14px 32px 14px',
                customChildren: [
                    <BottomBar key="bottomBar" kubeState={this.props.kubeState} />
                ]
            }));
        }
    }
};

exports.reduceUI = (state, action) => {
    switch (action.type) {
        case ActionK8sContextChanged:
            return state.set('kubeState', action.value);
    }
    return state;
}

exports.mapTermsState = (state, map) => {
    return Object.assign(map, {
        kubeState: state.ui.kubeState,
    })
}

const passProps = (uid, parentProps, props) => {
    return Object.assign(props, {
        kubeState: parentProps.kubeState,
    })
}

exports.getTermGroupProps = passProps;
exports.getTermProps = passProps;