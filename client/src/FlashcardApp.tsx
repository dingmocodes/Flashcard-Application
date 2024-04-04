import React, { Component } from "react";
import { isRecord } from './record';
import { CreateDeck } from './CreateDeck';
import { PracticeDeck } from './PracticeDeck';
import { Deck, parseBody } from './deck';

type Page = {kind: "home"} | {kind: "create"} | {kind: "practice"};

type FlashcardAppState = {
  //name: string;  // mirror state of name input box
  //msg: string;   // message sent from server
  page: Page;
  deckList: string[];
  currDeckName: string;
  currDeck?: Deck;
  scoreList: string[];
}


/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {page: {kind: "home"}, deckList: [], currDeckName: "", scoreList: []};
  }

  componentDidMount = (): void => {
    // Fetch the list of decks and scores when the component mounts
    this.doListChange();
    this.doScoreChange();
  }
  
  render = (): JSX.Element => {
    if (this.state.page.kind === "home") {
      return (<div>
                <h2>List</h2>
                {this.renderList()}
                <button onClick={this.doCreateClick}>New</button>
                <h2>Scores</h2>
                {this.renderScores()}
              </div>)
    } else if (this.state.page.kind === "create") {
      return <CreateDeck onAdd={this.doSaveClick} onBack={this.doBackClick} decks={this.state.deckList}/>
    } 
      else if (this.state.page.kind === "practice" && this.state.currDeck) {
        return <PracticeDeck nameDeck={this.state.currDeckName} initialDeck={this.state.currDeck} onFinish={this.doFinishClick}/>
    } else {
      return <div></div>
    }
  };

  renderList = (): JSX.Element => {
    if (this.state.deckList.length === 0) {
      return <p>no decks yet</p>;
    } else {
      const fileNameElements: JSX.Element[] = [];
      for (const nameFile of this.state.deckList) {
        fileNameElements.push(
          <li key={nameFile}>
            <a href="#" onClick={() => this.doDeckClick(nameFile)}>
            {nameFile}
            </a>
          </li>
        );
      }
      return <div>{fileNameElements}</div>
    }
  };

  renderScores = (): JSX.Element => {
    console.log("ay we're rendering the files " + this.state.scoreList.length);
    if (this.state.scoreList.length === 0) {
      return <p>no scores yet</p>;
    } else {
      const scoreElements: JSX.Element[] = [];
      for (const score of this.state.scoreList) {
        scoreElements.push(
          <li key={score}>
            {score}
          </li>
        );
      }
      return <div>{scoreElements}</div>
    }
  };

  doFinishClick = (name: string, nameDeck: string, correct: number, incorrect: number): void => {
    this.setState({page: {kind: "home"}});
    fetch("/api/saveScore", {
      method: "POST", 
      body: JSON.stringify({name: name, nameDeck: nameDeck, correct: correct, incorrect: incorrect}), 
      headers: {"Content-Type": "application/json"} })
    .then(this.doFinishResp)
    // should we change the error?
    .catch(() => this.doFinishError("failed to connect to server"));
    this.doScoreChange();
  }

  doFinishResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doFinishJson)
         .catch(() => this.doFinishError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doFinishError)
         .catch(() => this.doFinishError("400 response is not text"));
    } else {
      this.doFinishError(`bad status code ${res.status}`);
    }
  };

  doFinishJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/saveScore: not a record", data);
      return;
    }

    if (typeof data.message !== 'string') {
      console.error("expected a message");
      return;
    }
  };

  doFinishError = (msg: string): void => {
    console.error(`Error fetching /api/saveScore: ${msg}`);
  };





  doScoreChange = (): void => {
    fetch("/api/listScore")
    .then(this.doListScoreResp)
    .catch(() => this.doListScoreError("failed to connect to server"));
  };

  doListScoreResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doListScoreJson)
         .catch(() => this.doListScoreError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doListScoreError)
         .catch(() => this.doListScoreError("400 response is not text"));
    } else {
      this.doListScoreError(`bad status code ${res.status}`);
    }
  };

  doListScoreJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/listScore: not a record", data);
      return;
    }

    if (typeof data.list === 'undefined' || !Array.isArray(data.list)) {
      console.error("expected an array of strings");
      return;
    }

    const stringArray: string[] = data.list;
    this.setState({scoreList: stringArray});
  };

  doListScoreError = (msg: string): void => {
    console.error(`Error fetching /api/listScore: ${msg}`);
  };






 


  doDeckClick = (nameFile: string): void => {
    this.setState({currDeckName: nameFile});
    this.doDeckChange(nameFile);
  };

  doDeckChange = (fileName: string): void => {
    fetch(`/api/load?name=${encodeURIComponent(fileName)}`)
    .then(this.doDeckResponse)
    .catch(() => this.doDeckError("failed to connect to server"));
  };

  doDeckResponse = (res: Response): void => {
    //console.log(res.text);
    if (res.status === 200) {
      res.json().then(this.doDeckJson)
            .catch(e => console.log(e));
    } else if (res.status === 400) {
      res.text().then(this.doDeckError)
         .catch(() => this.doDeckError("400 response is not text"));
    } else {
      this.doDeckError(`bad status code ${res.status}`);
    }
  };

  doDeckJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/load: not a record", data);
      return;
    }

    if (!(typeof data.value === 'string')) {
      console.error("expected deck info");
      return;
    }

    console.log("ay we made it to the point where the deck should be updated");
    const deck: Deck = parseBody(this.state.currDeckName, data.value);
    this.setState({page: {kind: "practice"}, currDeck: deck});
  };

  doDeckError = (msg: string): void => {
    console.error(`Error fetching /api/load: ${msg}`);
  };






  doSaveClick = (dName: string, info: string): void => {
    // made a change here, from toJson(d) to d
    fetch("/api/save", {
      method: "POST", 
      body: JSON.stringify({name: dName, file: info}), 
      headers: {"Content-Type": "application/json"} })
    .then(this.doSaveResp)
    .catch(() => this.doSaveError("failed to connect to server"));
    this.setState({page: {kind: "home"}});
    this.doListChange();
  }

  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
         .catch(() => this.doSaveError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
         .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code ${res.status}`);
    }
  };

  doSaveJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/save: not a record", data);
      return;
    }

    if (typeof data.message !== 'string') {
      console.error("expected a message");
      return;
    }
  };

  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };





  doListChange = (): void => {
    fetch("/api/list")
    .then(this.doListResp)
    .catch(() => this.doListError("failed to connect to server"));
  };

  doListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doListJson)
         .catch(() => this.doListError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doListError)
         .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code ${res.status}`);
    }
  };

  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }

    if (typeof data.list === 'undefined' || !Array.isArray(data.list)) {
      console.error("expected an array of strings");
      return;
    }

    const stringArray: string[] = data.list;
    this.setState({deckList: stringArray});
  };

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };








  doBackClick = (): void => {
    this.setState({page: {kind: "home"}})
  }

  doCreateClick = (): void => {
    this.setState({page: {kind: "create"}});
  }

}