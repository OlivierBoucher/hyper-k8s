module.exports = (React) => {
	return class BottomBar extends React.Component {
		constructor(props) {
			super(props)
		}

		render() {
			return <div style={{
				height: 33,
				paddingLeft: 10,
				paddingRight: 10,
				marginLeft: -15,
				marginRight: -15}}>Wazzaa</div>
		}
	}
};