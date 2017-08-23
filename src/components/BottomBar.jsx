module.exports = (React) => {
	const KubernetesLogo = require('./KubernetesLogo')(React);

	return class BottomBar extends React.Component {
		constructor(props) {
			super(props)
		}

		render() {
			const Status = ({ kubeState, kubeMissingContext }) => {
				const containerStyle = { marginLeft: 5 };

				if (kubeState) {
					return <div style={containerStyle}>
						<span>{kubeState.cluster}</span>
						<span style={{ marginLeft: 5, marginRight: 5 }}>{'\u2192'}</span>
						<span>{kubeState.namespace}</span>
					</div>
				} else if (kubeMissingContext) {
					return <span style={containerStyle}>Error: missing kube config please refer to the README</span>
				} else {
					return <span style={containerStyle}>Loading...</span>
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
				<Status kubeState={this.props.kubeState} kubeMissingContext={this.props.kubeMissingContext}></Status>
			</div>
		}
	}
};