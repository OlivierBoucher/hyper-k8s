const {homedir} = require('os');
const path = require('path');
const fs = require('fs');
const watch = require('node-watch');
const yaml = require('js-yaml');

// RPC methods
const KubeConfigFileUpdate = "KUBE_CONFIG_FILE_UPDATE"
const KubeConfigFileMissing = "KUBE_CONFIG_FILE_MISSING"

// Redux actions
const ActionK8sContextChanged = "K8S_CONTEXT_CHANGED"
const ActionK8sContextNotFound = "K8S_CONTEXT_NOT_FOUND"

exports.onWindow = (BrowserWindow) => {
    const getKubeConfigPath = () => {
        let kubeConfigPath = process.env['KUBECONFIG'];
        if(kubeConfigPath && fs.existsSync(kubeConfigPath)) {
            return kubeConfigPath;
        }

        kubeConfigPath = path.join(homedir(), '.kube', 'config');
        if(kubeConfigPath && fs.existsSync(kubeConfigPath)) {
            return kubeConfigPath;
        }

        return '';
    }

    const kubeConfigPath = getKubeConfigPath();
    if(!kubeConfigPath) {
        setTimeout(() => {
            BrowserWindow.rpc.emit(KubeConfigFileMissing, {})
        }, 2000)
        return;
    }

    const getKubeConfig = () => yaml.safeLoad(fs.readFileSync(kubeConfigPath, 'utf8'));
    const emitConfig = () => {
        const config = getKubeConfig();
        const context = config.contexts.find(x => x.name === config['current-context']).context
        const clusterSplit = context.cluster.split('_');

        BrowserWindow.rpc.emit(KubeConfigFileUpdate, {
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

            window.rpc.on(KubeConfigFileUpdate, (kubeState) => {
                window.store.dispatch({
                    type: ActionK8sContextChanged,
                    value: kubeState,
                });
            });

            window.rpc.on(KubeConfigFileMissing, () => {
                window.store.dispatch({
                    type: ActionK8sContextNotFound,
                })
            });
        }

        render() {
            return React.createElement(Term, Object.assign({}, this.props, {
                padding: '12px 14px 32px 14px',
                customChildren: [
                    <BottomBar key="bottomBar" kubeMissingContext={this.props.kubeMissingContext} kubeState={this.props.kubeState} />
                ]
            }));
        }
    }
};

exports.reduceUI = (state, action) => {
    switch (action.type) {
        case ActionK8sContextChanged:
            state.set('kubeState', action.value);
            state.set('kubeMissingContext', false);
            break;
        case ActionK8sContextNotFound:
            state.set('kubeMissingContext', true);
            break;
    }
    return state;
}

exports.mapTermsState = (state, map) => {
    return Object.assign(map, {
        kubeState: state.ui.kubeState,
        kubeMissingContext: state.ui.kubeMissingContext,
    })
}

const passProps = (uid, parentProps, props) => {
    return Object.assign(props, {
        kubeState: parentProps.kubeState,
        kubeMissingContext : parentProps.kubeMissingContext,
    })
}

exports.getTermGroupProps = passProps;
exports.getTermProps = passProps;