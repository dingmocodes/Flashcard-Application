import React, { Component, ChangeEvent, MouseEvent } from "react";
//import { isRecord } from './record';
import { compact_list } from './list';
import { Deck } from './deck';

type Page = {kind: "practice"} | {kind: "result"};

type PracticeDeckProps = {
    nameDeck: string;
    initialDeck: Deck;
    onFinish: (name: string, nameDeck: string, correct: number, incorrect: number) => void;
};

type PracticeDeckState = {
    page: Page;
    numCorrect: number;
    numIncorrect: number;
    frontList: string[];
    backList: string[];
    isFront: boolean;
    index: number;
    cardFace: string; // like what we're showing on the card (question/answer side)
    name: string; // for at the result at the end
};

export class PracticeDeck extends Component<PracticeDeckProps, PracticeDeckState> {

    constructor(props: PracticeDeckProps) {
        super(props);
        this.state = {
            page: { kind: "practice" },
            numCorrect: 0,
            numIncorrect: 0,
            frontList: [],
            backList: [],
            isFront: true,
            index: 0,
            cardFace: "", // Initialize to an empty string
            name: ""
        };
    }

    componentDidMount = (): void => {
        const frontList = compact_list(this.props.initialDeck.front);
        const backList = compact_list(this.props.initialDeck.back);
    
        // Set the initial value of cardFace after frontList has been initialized
        this.setState({
            frontList,
            backList,
            cardFace: frontList[0] || "" // Set cardFace to the first element of frontList, or an empty string if frontList is empty
        });
    }

    render = (): JSX.Element => {
        if (this.state.page.kind === "practice") {
            return (<div>
                        <h2>{this.props.nameDeck}</h2>
                        <p>
                            Correct: {this.state.numCorrect} | Incorrect: {this.state.numIncorrect}
                        </p>
                        <div style={{ border: '1px solid black', 
                                      padding: '10px', 
                                      borderRadius: '5px', 
                                      backgroundColor: 'lightgray',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center' 
                                    }}>
                            {this.state.cardFace}
                        </div>
                        <button onClick={this.doFlipClick}>Flip</button>
                        <button onClick={this.doCorrectClick}>Correct</button>
                        <button onClick={this.doIncorrectClick}>Incorrect</button>
                    </div>);
        } else { // page.kind = "result"
            return (<div>
                        <h2>{this.props.nameDeck}</h2>
                        <h3>
                            Correct: {this.state.numCorrect} | Incorrect: {this.state.numIncorrect}
                        </h3>
                        <p>End of Quiz</p>
                        <div>
                            <label htmlFor="resultName">Name:</label>
                            <input
                                id="resultName"
                                type="text"
                                value={this.state.name}
                                onChange={this.doNameChange}
                            />
                        </div>
                        <button onClick={this.doFinishClick}>Finish</button>
                    </div>);
        }
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({ name: evt.target.value });
    };

    doFlipClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.isFront) {
            this.setState({isFront: false, cardFace: this.state.backList[this.state.index]});
        } else {
            this.setState({isFront: true, cardFace: this.state.frontList[this.state.index]});
        }
    }

    doCorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.index === this.state.frontList.length - 1) {
            console.log("i guess we did change the state");
            this.setState({page: {kind: "result"}, numCorrect: this.state.numCorrect + 1});
        } else {
            const newIndex: number = this.state.index + 1;
            this.setState({index: newIndex, 
                           cardFace: this.state.frontList[newIndex],
                           numCorrect: this.state.numCorrect + 1});
        }
    }

    doIncorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.index === this.state.frontList.length - 1) {
            console.log("i guess we did change the state");
            this.setState({page: {kind: "result"}, numIncorrect: this.state.numIncorrect + 1});
        } else {
            const newIndex: number = this.state.index + 1;
            this.setState({index: newIndex, 
                           cardFace: this.state.frontList[newIndex],
                           numIncorrect: this.state.numIncorrect + 1});
        }
    }

    doFinishClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onFinish(this.state.name, this.props.nameDeck, this.state.numCorrect, this.state.numIncorrect);
    }
}