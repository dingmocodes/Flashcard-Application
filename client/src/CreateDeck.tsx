import React, { Component, ChangeEvent, MouseEvent } from "react";

type CreateDeckProps = {
    onAdd: (name: string, options: string) => void;
    onBack: () => void;
    decks: string[];
};

// what fields do we want this to have?
type CreateDeckState = {
    name: string;
    deckInfo: string;
    error: string;
};

export class CreateDeck extends Component<CreateDeckProps, CreateDeckState> {

    constructor(props: CreateDeckProps) {
        super(props);
        this.state = {name: "", deckInfo: "", error: ""};
    }

    render = (): JSX.Element => {
        return (<div>
                    <h2>Create</h2>
                    <div>
                        <label htmlFor="fileName">Name:</label>
                        <input
                            id="fileName"
                            type="text"
                            value={this.state.name}
                            onChange={this.doNameChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="textbox">Enter text:</label>
                        <br/>
                        <textarea id="textbox" rows={3} cols={40} value={this.state.deckInfo}
                            onChange={this.doDeckInfoChange}></textarea>
                    </div>
                    <button onClick={this.doAddClick}>Add</button>
                    <button onClick={this.doBackClick}>Back</button>
                    <span style={{ color: 'red' }}>{this.state.error}</span>
                </div>);
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ name: evt.target.value });
    };

    doDeckInfoChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({ deckInfo: evt.target.value });
    };

    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.name === "") {
            this.setState({ error: "error: name should not be empty"});
        } else if (this.state.deckInfo === "") {
            this.setState({ error: "error: no cards"});
        } else if (this.props.decks.includes(this.state.name)) {
            this.setState({ error: "cannot have repeating deck names"});
        } else {
            this.setState({ error: "" });
            //const deck: Deck = parseBody(this.state.name, this.state.deckInfo);
            this.props.onAdd(this.state.name, this.state.deckInfo);
        }
    }

    doBackClick = (): void => {
        this.props.onBack();
    };
}