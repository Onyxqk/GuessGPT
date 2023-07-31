import { Component } from '@angular/core'
import { OpenAI } from "langchain/llms/openai"
import { LLMChain } from "langchain/chains"
import { PromptTemplate } from "langchain/prompts"
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'GuessGPT'
  secret = ''
  selectedModel = ''
  modelOptions = ['gpt-3.5-turbo', 'text-davinci-003', 'text-davinci-002', 'text-davinci-001']
  result = ''
  apiKey = ''
  randomWord= ''
  private readonly wordDictionary = 'wordDictionary.json'

  async submitForm() {
    if (!this.secret) {
      this.result = 'You must enter a secret to run the game';
    } else {
      this.result = await (this.standardPromptGame(this.secret, this.selectedModel))
    }
  }

  formatPriorGuesses(priorGuesses: [string, number][]): string {
    if (priorGuesses.length === 0) {
      return "N/A"
    }
    let promptString = ""
    for (const [guess, correctLetters] of priorGuesses) {
      promptString += `${guess}, ${correctLetters}\n`
    }
    return promptString
  }

  async standardPromptRequest(llm: OpenAI, priorGuessString: string): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(`We are going to play the game of Jotto. I have decided on a secret five letter word, and your goal is to guess that word.
    You will submit five letter words as guesses, and I will tell you for each guess how many letters in your guess are also in the secret word.
    
    PRIOR GUESSES, CORRECT LETTERS:
    {priorGuessString}
    
    YOUR GUESS:  `)
    const chain = new LLMChain({ llm, prompt })
    const response = await (chain.run(priorGuessString))
    return response
  }

  async standardPromptGame(secretWord: string, modelName: string): Promise<string> {
    const llm = new OpenAI({openAIApiKey: this.apiKey, modelName })
    const secretWordSet = new Set(secretWord.toUpperCase())
    let latestGuess = ""
    let attempts = 0
    const MAX_ATTEMPTS = 10
    const priorGuesses: [string, number][] = []
    let resultString = ''

    while (attempts < MAX_ATTEMPTS && latestGuess.toUpperCase() !== secretWord.toUpperCase()) {
      attempts += 1
      latestGuess = await (this.standardPromptRequest(llm, this.formatPriorGuesses(priorGuesses)))
      const correctLetters = [...secretWordSet].filter(letter => new Set(latestGuess.toUpperCase()).has(letter)).length;
      resultString += `${latestGuess}, ${correctLetters}\n`
    }

    if (latestGuess.toUpperCase() === secretWord.toUpperCase()) {
      resultString += '\nSecret word successfully guessed'
    } else {
      resultString += '\nModel failed to guess the secret'
    }

    return resultString;
  }

  async runGameForAllWords() {
    const wordDictionary = this.wordDictionary
    const csvContentArray: string[] = [];
    for (const word of wordDictionary) {
      const result = await this.standardPromptGame(word, this.selectedModel)
      csvContentArray.push(`${word}, ${result}`)
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvContentArray.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    FileSaver.saveAs(blob, 'game_results.csv');
  }

}