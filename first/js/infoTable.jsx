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
        var parent = this.props.parent,
            colors = ["red", "rgb(163, 73, 164)"];
        var elem = [];
        if (this.state.isEnded) {
            elem.push(<div className="prettyButton"><a href="../first/">New game</a></div>);
            elem.push(<h2>{parent.state.count>parent.state.count[0] == parent.state.count ?
                "It's a tie." : (parent.state.count[0] > parent.state.count[1] ?
                "First" : "Second") + " player wins."}</h2>);
        } else {
            elem.push(<h2><span style={{color: colors[parent.state.player]}}>{parent.state.player == 0 ? "First" : "Second"}</span> player's move.</h2>);
        }
        return (
            <div style={{marginTop: 0}}>
                <h1>Count: <span style={{color: colors[0]}}>{ (parent.state.count[0])}</span> : <span style={{color: colors[1]}}>{(parent.state.count[1]) }</span></h1>
                { elem }
            </div>
        )
    },
    componentDidMount: function() {
        this.props.parent.props.result = this;
    }
});