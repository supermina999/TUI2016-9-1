window.ResultTable = React.createClass({
    getInitialState: function() {
        return {
            isEnded: false
        }
    },
    finishGame: function() {
        this.setState({isEnded: true});
    },
    transformText: function(text) {
        var ans = [];
        var colors = ["green", "red", "blue", "brown", "purple", "orange"];
        for (var i = 0; i < text.length; i++) {
            var r = Math.trunc(Math.random() * colors.length);
            ans.push(<span style={{ color: colors[r] }}>{ text[i] }</span>);
        }
        return <i>{ ans }</i>;
    },
    render: function() {
        var txt = "Waiting for player " + (this.props.parent.state.player + 1),
            stateChange = this.props.parent.state.resultChange,
            results = this.props.parent.state.count;
        var elem = [];
        if (stateChange[0] || stateChange[1]) {
            console.log(stateChange);
            elem.push(<h2 style={{color: "#9acd32"}}>Current move will make: {results[0] + stateChange[0]} : {results[1] + stateChange[1]}</h2>);
        }
        if (this.state.isEnded) {
            elem.push(<div className="prettyButton"><a href="main.html">New game</a></div>);
            var txt = this.props.parent.state.count[0] == this.props.parent.state.count ?
                "It's a tie." : (this.props.parent.state.count[0] > this.props.parent.state.count[1] ?
                "First" : "Second") + " player wins.";
        }
        return (
            <div style={{marginTop: 0}}>
                <h1>Count: { (this.props.parent.state.count[0]) + " : " + (this.props.parent.state.count[1]) }</h1>
                <h2 color="yellow">{ this.transformText(txt) }</h2>
                { elem }
            </div>
        )
    },
    componentDidMount: function() {
        this.props.parent.props.result = this;
    }
});
