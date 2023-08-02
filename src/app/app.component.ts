import { Component } from '@angular/core'
import { OpenAI } from "langchain/llms/openai"
import { LLMChain } from "langchain/chains"
import { PromptTemplate } from "langchain/prompts"
import { HttpClient } from '@angular/common/http'
import * as FileSaver from 'file-saver'

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
  wordDictionary:string[ ]= []

  ngOnInit() {
    this.loadWordDictionary();
  }

  loadWordDictionary() {
    this.http.get<string[]>('assets/wordDictionary.json').subscribe(
      (data: string[]) => {
        this.wordDictionary = data
      })
  }

  constructor(private http: HttpClient) {}

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
      promptString += `You guessed ${guess}, which had ${correctLetters} letters in common with the secret.\n`
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

  async standardPromptGame(secretWord: string, modelName: string, gameStats: Record<string,any> = {}): Promise<string> {
    const llm = new OpenAI({openAIApiKey: this.apiKey, modelName })
    const secretWordSet = new Set(secretWord.toUpperCase())
    let latestGuess = ""
    let attempts = 0, highestLetterMatch = 0, repeatedWordCount = 0
    const MAX_ATTEMPTS = 10
    const priorGuesses: [string, number][] = []
    const responseTexts: string[] = []
    let resultString = ''

    while (attempts < MAX_ATTEMPTS && latestGuess.toUpperCase() !== secretWord.toUpperCase()) {
      attempts += 1
      
      let modelResponse = await (this.standardPromptRequest(llm, this.formatPriorGuesses(priorGuesses)))
      responseTexts.push(modelResponse)
      
      // reverse the response, use regex to find the last word, and flip that word back around
      let reversedResponse = modelResponse.split('').reverse().join('')
      let lastWord = reversedResponse.match(/[a-zA-Z]+/)
      let guessWord = lastWord ? lastWord[0] : reversedResponse
      latestGuess = guessWord.split('').reverse().join('')
      
      const correctLetters = [...secretWordSet].filter(letter => new Set(latestGuess.toUpperCase()).has(letter)).length
      
      // count the number of times a word is guessed that was already guessed
      if (priorGuesses.find((guess) => guess[0].toUpperCase() === latestGuess.toUpperCase()))
        repeatedWordCount++
      
      priorGuesses.push([latestGuess, correctLetters])
      resultString += `${latestGuess}, ${correctLetters}\n`
      
      highestLetterMatch = correctLetters > highestLetterMatch ? correctLetters : highestLetterMatch
    }

    if (latestGuess.toUpperCase() === secretWord.toUpperCase()) {
      resultString += '\nSecret word successfully guessed'
      gameStats['success'] = true
    } else {
      resultString += '\nModel failed to guess the secret'
      gameStats['success'] = false
    }
    
    gameStats['resultString'] = resultString
    gameStats['responseTexts'] = responseTexts
    gameStats['attempts'] = attempts
    gameStats['highestLetterMatch'] = highestLetterMatch
    gameStats['repeatedWordCount'] = repeatedWordCount

    return resultString
  }

  async runGameForAllWords() {
    const wordDictionary = this.wordDictionary
    const gameStatsMap: Record<string,any> = {}
    for (const word of wordDictionary) {
      let gameStats: Record<string,any> = {}
      const result = await this.standardPromptGame(word, this.selectedModel, gameStats)
      gameStatsMap[word] = gameStats
    }

    const jsonContent = JSON.stringify(gameStatsMap, null, 2)
    const blob = new Blob([jsonContent], { type: 'text/plain;charset=utf-8' })
    FileSaver.saveAs(blob, 'game_results.json')
  }

}