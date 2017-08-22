module.exports = (React) => {
	const KubernetesLogo = require('./KubernetesLogo')(React);

	return class BottomBar extends React.Component {
		constructor(props) {
			super(props)

			window.rpc.on('KUBE_STATE_CHANGE', (state) => {
				console.log(state);
			});
		}

		render() {
			const Status = ({ kubeState }) => {
				if (kubeState) {
					return <div style={{ marginLeft: 5 }}>
						<span>{kubeState.cluster}</span>
						<span style={{ marginLeft: 5, marginRight: 5 }}>{'\u2192'}</span>
						<span>{kubeState.namespace}</span>
					</div>
				} else {
					return <span style={{ marginLeft: 5 }}>Loading...</span>
				}
			}
			return <div style={{
				fontSize: '12px',
				height: 35,
				paddingLeft: 10,
				paddingRight: 10,
				paddingBottom: 5,
				marginLeft: -15,
				marginRight: -15,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center'
			}}>
				<KubernetesLogo></KubernetesLogo>
				<Status kubeState={this.props.kubeState}></Status>
			</div>
		}
	}
};